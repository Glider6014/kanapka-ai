import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextRequest, NextResponse } from "next/server";
import {
  ValidationInput,
  ValidationItemResult,
  ValidationResponse,
} from "./types";
import Ingredient from "@/models/Ingredient";
import connectDB from "@/lib/connectToDatabase";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const validationPrompt = ChatPromptTemplate.fromTemplate(`
    Evaluate whether the given ingredient is an edible food product. Respond only with "true" or "false".
    
    Ingredient to evaluate: {ingredient}
    
    Evaluation rules:
    - Respond "true" for:
      * Fruits and vegetables (e.g., apple, carrot, banana)
      * Food products (e.g., bread, pasta, rice)
      * Spices and herbs (e.g., basil, oregano, cinnamon)
      * Meat and fish (e.g., chicken, salmon, beef)
      * Dairy products (e.g., cheese, milk, yogurt)
      * Grains and processed foods (e.g., flour, groats, cereals)
      * Culinary ingredients (e.g., salt, sugar, oil)
      
    - Respond "false" for:
      * Non-food items (e.g., stone, paper)
      * Random strings of characters (e.g., ABC123, XKCD)
      * Inedible substances (e.g., mud, sand)
      * Toxic substances (e.g., poison)
      * Non-existent products
    
    Correct examples (true):
    "banana"
    "apple"
    "salt"
    "chicken"
    "flour"
    "pepper"
    "egg"
    
    Incorrect examples (false):
    "XKCD123"
    "stone"
    "dirt"
    "poison"
    "table"
    
    Respond only with "true" or "false".
    `);

const validationChain = validationPrompt.pipe(model);

async function isValidFood(ingredient: string): Promise<boolean> {
  const result = await validationChain.invoke({ ingredient });
  return result.content.toString().toLowerCase().includes("true");
}

async function findExistingIngredient(name: string) {
  await connectDB();
  return await Ingredient.findOne({ name: { $regex: new RegExp(name, "i") } });
}

export async function POST(req: NextRequest) {
  try {
    const body: ValidationInput = await req.json();
    const { ingredients } = body;

    if (!ingredients) {
      return NextResponse.json(
        { error: "Ingredients are missing" },
        { status: 400 }
      );
    }

    // Handle both string and array inputs
    const ingredientsList = Array.isArray(ingredients)
      ? ingredients
      : ingredients.split(",").map((i) => i.trim());

    const validationResults: ValidationItemResult[] = [];
    const validIngredients: string[] = [];

    for (const ing of ingredientsList) {
      const existing = await findExistingIngredient(ing);
      if (existing) {
        validationResults.push({
          ingredient: ing,
          valid: true,
          exists: true,
        });
        validIngredients.push(ing);
        continue;
      }

      const isValid = await isValidFood(ing);
      validationResults.push({
        ingredient: ing,
        valid: isValid,
        exists: false,
      });

      if (isValid) {
        validIngredients.push(ing);
      }
    }

    const response: ValidationResponse = {
      results: validationResults,
      validIngredients,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 }
    );
  }
}
