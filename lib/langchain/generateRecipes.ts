import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { tool } from "@langchain/core/tools";
import Recipe from "@/models/Recipe";
import Ingredient from "@/models/Ingredient";
import { extractIngredients } from "./extractIngredients";
import { z } from "zod";

// Define the input schema using Zod
const inputSchema = z.object({
  input: z.string(),
});

// Define the tool for extracting ingredients
const extractAndReturnIngredients = tool(
  async (input) => {
    const extractedIngredients = await extractIngredients(input.input);

    // Save ingredients to database
    try {
      await Promise.all(
        extractedIngredients.map(async (ingredient) => {
          const existingIngredient = await Ingredient.findOne({
            name: ingredient.name.toLowerCase(),
          });
          if (!existingIngredient) {
            const newIngredient = new Ingredient({
              name: ingredient.name.toLowerCase(),
              unit: ingredient.unit,
              nutrition: ingredient.nutrition,
            });
            await newIngredient.save();
          }
        })
      );
    } catch (error) {
      console.error("Error saving ingredients to database:", error);
    }

    return extractedIngredients;
  },
  {
    name: "extractAndReturnIngredients",
    description:
      "Extracts ingredients from a string, calculates their nutrition, saves them to database, and returns them.",
    schema: inputSchema,
  }
);

// Initialize the model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Define the prompt template
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are a culinary expert. Create {count} recipe(s) using the provided ingredients as much as possible.

Each recipe should:
- Use as many of the provided ingredients as possible.
- Require as few additional ingredients as possible.
- Conform to the Recipe model.
- IMPORTANT: ALL ingredients mentioned in the steps MUST be listed in the ingredients section.
- IMPORTANT: The ingredients list MUST include exact amounts for EVERY ingredient used in the steps.

Must conform with provided ingredients units.

Notes for unknown ingredients:
- Things like fruits, vegetables should be in their natural unit, which is usually piece
- Things like bread, which are usually in slices should be named as "slice" like "bread slice" and piece unit
- Naming should be in English
- Names should be singular
- Common ingredients like salt, pepper, oil should also be included in the ingredients list if used in steps

Respond ONLY with a valid JSON array string in this exact format (no other text):
[
  {{
    "name": "[Recipe name]",
    "description": "[Description]",
    "ingredients": [
      {{
        "name": "[Ingredient name]",
        "amount": [number]
      }}
    ],
    "steps": ["[Step 1]", "[Step 2]", "..."],
    "prepTime": [number],
    "cookTime": [number],
    "difficulty": "[Easy/Medium/Hard]",
    "experience": [number]
  }}
]

{agent_scratchpad}
`,
  ],
  ["user", "{ingredients}"],
]);

// Create the agent
const agent = createToolCallingAgent({
  tools: [extractAndReturnIngredients],
  prompt,
  llm: model,
});

// Create the agent executor
const agentExecutor = new AgentExecutor({
  agent,
  tools: [extractAndReturnIngredients],
});

// Function to translate unit abbreviations
async function translateUnit(unit: keyof typeof units) {
  const units: { [key: string]: string } = {
    g: "gram",
    ml: "milliliter",
    piece: "piece",
  };
  return units[unit] || unit;
}

// Function to validate generated ingredients
async function validateGeneratedIngredient(genIng: {
  amount: number;
  name: string;
}) {
  try {
    if (!genIng.name || !genIng.amount) {
      console.error("Missing name or amount:", genIng);
      return null;
    }
    if (genIng.amount <= 0) {
      console.error("Invalid amount:", genIng);
      return null;
    }

    const ingredient = await Ingredient.findOne({
      name: genIng.name.toLowerCase().trim(),
    });

    if (ingredient) {
      return ingredient;
    }

    console.log("Ingredient not found in DB, extracting:", genIng.name);
    const extractedIngredients = await extractIngredients(genIng.name);
    if (!extractedIngredients || extractedIngredients.length === 0) {
      console.error("Failed to extract ingredient:", genIng.name);
      return null;
    }
    return extractedIngredients[0];
  } catch (error) {
    console.error(
      "Error in validateGeneratedIngredient:",
      error,
      "for ingredient:",
      genIng
    );
    return null;
  }
}

// Function to validate and construct a recipe object
async function validateRecipe(recipeData: {
  name: string;
  description: string;
  ingredients: { name: string; amount: number }[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  difficulty: string;
  experience: number;
}) {
  try {
    // Basic validation
    if (
      !recipeData.name ||
      !recipeData.description ||
      !recipeData.ingredients ||
      !recipeData.steps ||
      !recipeData.prepTime ||
      !recipeData.cookTime ||
      !recipeData.difficulty ||
      !recipeData.experience
    ) {
      console.error("Missing required fields in recipe data:", recipeData);
      return null;
    }

    if (!Array.isArray(recipeData.ingredients)) {
      console.error("Ingredients is not an array:", recipeData.ingredients);
      return null;
    }

    const ingredients = await Promise.all(
      recipeData.ingredients.map(async (ing) => {
        const validatedIng = await validateGeneratedIngredient(ing);
        if (!validatedIng) {
          console.error("Invalid ingredient:", ing);
          return null;
        }
        return {
          ingredient: validatedIng._id,
          amount: ing.amount,
        };
      })
    );

    // Check if any ingredients failed validation
    if (ingredients.some((ing) => ing === null)) {
      console.error("Some ingredients failed validation");
      return null;
    }

    const recipe = new Recipe({
      name: recipeData.name,
      description: recipeData.description,
      ingredients: ingredients.filter(Boolean),
      steps: recipeData.steps,
      prepTime: recipeData.prepTime,
      cookTime: recipeData.cookTime,
      difficulty: recipeData.difficulty,
      experience: recipeData.experience,
    });

    return recipe;
  } catch (error) {
    console.error("Error in validateRecipe:", error);
    return null;
  }
}

// Main function to generate recipes
export async function generateRecipes(ingredients: any[], recipesCount = 5) {
  try {
    const ingredientsAsString = (
      await Promise.all(
        ingredients.map(
          async (ing) =>
            `- ${ing.name}, provided in ${await translateUnit(ing.unit)}s`
        )
      )
    ).join("\n");

    const response = await agentExecutor.invoke({
      ingredients: ingredientsAsString,
      count: recipesCount,
    });

    const generatedRecipes = JSON.parse(response.output);

    const recipes = (
      await Promise.all(generatedRecipes.map(validateRecipe))
    ).filter(Boolean);

    return recipes;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
