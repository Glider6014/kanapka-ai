import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import Recipe, { RecipeType } from "@/models/Recipe";
import { IngredientType } from "@/models/Ingredient";

// Zdefiniowanie schematu przepisu
const recipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  ingredients: z
    .array(
      z.object({
        name: z.string(),
        amount: z.number().nonnegative(),
      })
    )
    .min(1),
  steps: z.array(z.string()).min(1),
  prepTime: z.number().nonnegative(),
  cookTime: z.number().nonnegative(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

// Parser do przekształcania wyników na JSON
const parser = new StringOutputParser();

// Model AI z LangChain
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.5,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Szablon prompta do generowania przepisów
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a recipe generator AI. Generate as many meaningful recipes as possible using the provided ingredients.
Response must be a valid JSON array of recipe objects.

Example response:
[
  {{
    "name": "Recipe Name",
    "description": "Brief description",
    "ingredients": [
      {{
        "name": "ingredient name",
        "amount": 100
  }}
    ],
    "steps": ["Step 1", "Step 2"],
    "prepTime": 10,
    "cookTime": 20,
    "difficulty": "Easy"
  }}
]

Available ingredients:
{ingredients}

Respond ONLY with a valid JSON array of recipes.`,
  ],
]);

// Funkcja generująca przepisy
export async function* generateRecipes(
  ingredients: IngredientType[],
  maxRecipes: number = 5
): AsyncGenerator<RecipeType> {
  try {
    const ingredientsList = ingredients
      .map((ing) => `${ing.name} (${ing.unit})`)
      .join(", ");

    const chain = prompt.pipe(model).pipe(parser);
    const response = await chain.invoke({
      ingredients: ingredientsList,
      count: maxRecipes,
    });

    let parsedRecipes;
    try {
      parsedRecipes = JSON.parse(response);
      if (!Array.isArray(parsedRecipes)) {
        throw new Error("Response is not an array");
      }
    } catch (error) {
      console.error("Parse error:", error);
      console.error("Raw response:", response);
      throw error;
    }

    for (const recipe of parsedRecipes) {
      const validation = recipeSchema.safeParse(recipe);

      if (!validation.success) {
        console.error("Recipe validation failed:", validation.error.flatten());
        continue;
      }

      const validRecipe = new Recipe({
        name: validation.data.name,
        description: validation.data.description,
        ingredients: validation.data.ingredients.map((ing) => ({
          ingredient: ingredients.find(
            (ingredient) =>
              ingredient.name.toLowerCase() === ing.name.toLowerCase()
          )?._id,
          amount: ing.amount,
        })),
        steps: validation.data.steps,
        prepTime: validation.data.prepTime,
        cookTime: validation.data.cookTime,
        difficulty: validation.data.difficulty,
      });

      yield validRecipe;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.flatten().fieldErrors);
    } else {
      console.error("Recipe generation error:", error);
    }
  }
}
