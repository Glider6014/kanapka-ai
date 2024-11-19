import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextRequest, NextResponse } from "next/server";
import { IngredientInput, IngredientAnalysisResult } from "./types";

const prompt = ChatPromptTemplate.fromTemplate(`
Analyze the given food ingredient and return:
1. The correct name in English
2. Nutritional values per 100g of the product

Ingredient: {ingredient}

Respond ONLY with a valid JSON string in this exact format (no other text):
{{
  "name": "[english name]",
  "nutrition": {{
    "calories": "[number] kcal",
    "protein": "[number] g",
    "carbs": "[number] g",
    "fat": "[number] g"
  }}
}}
`);

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const chain = prompt.pipe(model);

export async function POST(req: NextRequest) {
  try {
    const body: IngredientInput = await req.json();
    const { ingredient } = body;
    console.log("Ingredient:", ingredient);

    if (!ingredient) {
      return NextResponse.json(
        { error: "Ingredient name is missing" },
        { status: 400 }
      );
    }

    const result = await chain.invoke({ ingredient });
    const parsedResult: IngredientAnalysisResult = JSON.parse(
      result.content.toString()
    );

    return NextResponse.json(parsedResult, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 }
    );
  }
}
