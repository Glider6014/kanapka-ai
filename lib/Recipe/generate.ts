// lib/langchain/generateRecipe.ts

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { IngredientType } from "@/models/Ingredient";
import Recipe, { RecipeType } from "@/models/Recipe";

const recipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.number().positive(),
    })
  ),
  steps: z.array(z.string()),
  prepTime: z.number().positive(),
  cookTime: z.number().positive(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  experience: z.number().positive(),
});

type RecipeResultType = z.infer<typeof recipeSchema>;

const parser = new JsonOutputParser({
  jsonSchema: recipeSchema,
});

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const prompt = ChatPromptTemplate.fromTemplate(`
Generate a recipe using the provided ingredients.
Use as many ingredients from the list as possible while requiring minimal additional ingredients.

Available ingredients:
{ingredients}

${parser.getFormatInstructions()}
`);

const chain = prompt.pipe(model).pipe(parser);

export async function generateRecipe(
  ingredients: IngredientType[]
): Promise<RecipeType | null> {
  try {
    const ingredientsString = ingredients
      .map((ing) => `- ${ing.name} (unit: ${ing.unit})`)
      .join("\n");

    const result = await chain.invoke({ ingredients: ingredientsString });

    const parsedResult = recipeSchema.parse(result);

    const recipe = new Recipe({
      name: parsedResult.name,
      description: parsedResult.description,
      ingredients: parsedResult.ingredients
        .map((ing) => ({
          ingredient: ingredients.find((i) => i.name === ing.name.toLowerCase())
            ?._id,
          amount: ing.amount,
        }))
        .filter((ing) => ing.ingredient),
      steps: parsedResult.steps,
      prepTime: parsedResult.prepTime,
      cookTime: parsedResult.cookTime,
      difficulty: parsedResult.difficulty,
      experience: parsedResult.experience,
    });

    return recipe;
  } catch (error) {
    console.error("Error generating recipe:", error);
    return null;
  }
}
