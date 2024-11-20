import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextRequest, NextResponse } from "next/server";
import { IngredientInput, IngredientAnalysisResults } from "./types";
import Ingredient from "@/models/Ingredient";
import connectMongo from "@/lib/connectToDatabase";
import { analyzeIngredients } from "@/lib/ingredients";

// Initialize model first
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Then define prompts and chains
const prompt = ChatPromptTemplate.fromTemplate(`
Analyze the given food ingredient(s) and return an array of ingredients.
If multiple ingredients are provided, they are separated by commas.

For each ingredient return:
1. The correct name in English
2. The unit of the ingredient (g, ml, or piece)
3. Nutritional values per 100g, 100ml, or per piece of the product, depending on the unit. Include calories, protein, fats, carbs, fiber, sugar, and sodium.

Ingredient(s): {ingredient}

Respond ONLY with a valid JSON array string in this exact format (no other text):
[
  {{
    "name": "[english name]",
    "unit": "[g/ml/piece]",
    "nutrition": {{
      "calories": [number],
      "protein": [number],
      "fats": [number],
      "carbs": [number],
      "fiber": [number],
      "sugar": [number],
      "sodium": [number]
    }}
}},
]
`);

const chain = prompt.pipe(model);

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    const ingredients = await Ingredient.find({});
    return NextResponse.json(ingredients, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: IngredientInput = await req.json();
    const { ingredient } = body;

    if (!ingredient) {
      return NextResponse.json(
        { error: "Ingredient name is missing" },
        { status: 400 }
      );
    }

    await connectMongo();
    const results = await analyzeIngredients(ingredient);

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 }
    );
  }
}
