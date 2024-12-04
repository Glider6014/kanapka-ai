import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import Recipe, { RecipeType } from "@/models/Recipe";
import Ingredient from "@/models/Ingredient";
import { Types } from "mongoose";
import connectDB from "../connectToDatabase";

const singleRecipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  ingredients: z.array(
    z.object({
      ingredientId: z.string(),
      amount: z.number().nonnegative(),
    })
  ),
  steps: z.array(z.string()).min(1),
  prepTime: z.number().nonnegative(),
  cookTime: z.number().nonnegative(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a recipe creation assistant. Create precise recipes following JSON format.`,
  ],
  [
    "human",
    `Create a recipe named "{recipeName}" using these ingredients:
  {ingredients}
  
  Response must be a valid JSON object with this structure:
  {{
    "name": "string (should match {recipeName})",
    "description": "string (brief description)",
    "ingredients": [
      {{
        "ingredientId": "string (from provided ingredients)",
        "amount": number (positive quantity)
      }}
    ],
    "steps": ["string (step 1)", "string (step 2)", ...],
    "prepTime": number (minutes),
    "cookTime": number (minutes),
    "difficulty": "Easy" | "Medium" | "Hard"
  }}
  
  Example response:
  {{
    "name": "Simple Recipe",
    "description": "A quick and easy dish",
    "ingredients": [
      {{
        "ingredientId": "507f1f77bcf86cd799439011",
        "amount": 100
      }}
    ],
    "steps": ["Step 1", "Step 2"],
    "prepTime": 10,
    "cookTime": 20,
    "difficulty": "Easy"
  }}
  
  Available ingredients:
  {ingredients}
  
  Respond ONLY with a valid JSON object for a single recipe.`,
  ],
]);

const parser = new StringOutputParser();
const chain = prompt.pipe(model).pipe(parser);

export async function generateRecipeFromIds(
  recipeName: string,
  ingredientIds: string[],
  userId: string
): Promise<RecipeType | null> {
  try {
    await connectDB();

    const ingredients = await Ingredient.find({
      _id: { $in: ingredientIds },
    });

    if (!ingredients.length) {
      console.error("No ingredients found for the given IDs");
      return null;
    }
    const ingredientsText = ingredients
      .map((ing) => `${ing._id}: ${ing.name} (${ing.unit})`)
      .join("\n");

    const result = await chain.invoke({
      recipeName,
      ingredients: ingredientsText,
    });

    const validation = singleRecipeSchema.safeParse(JSON.parse(result));

    if (!validation.success) {
      console.error("Recipe validation failed:", validation.error);
      return null;
    }
    const recipe = new Recipe({
      name: validation.data.name,
      description: validation.data.description,
      ingredients: validation.data.ingredients.map((ing) => ({
        ingredient: new Types.ObjectId(ing.ingredientId),
        amount: ing.amount,
      })),
      steps: validation.data.steps,
      prepTime: validation.data.prepTime,
      cookTime: validation.data.cookTime,
      difficulty: validation.data.difficulty,
      createdBy: new Types.ObjectId(userId),
    });
    recipe.save();
    return recipe;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.flatten().fieldErrors);
    } else {
      console.error("Recipe generation error:", error);
    }
    return null;
  }
}
