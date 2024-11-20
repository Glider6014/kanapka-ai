import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import Ingredient from "@/models/Ingredient";
import { isValidFood } from "./validation";
import { Types } from "mongoose";

// Initialize the language model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Update the prompt template
const prompt = ChatPromptTemplate.fromTemplate(`
Analyze the given food ingredient(s) with their quantities. Multiple ingredients may be provided in a single string.
First split the input into individual ingredients and their amounts, then analyze each one.

For each valid ingredient return:
1. The correct name in English
2. The original amount and unit from input (if provided)
3. The standard unit for this ingredient (g, ml, or piece)
4. Nutritional values per 100g, 100ml, or per piece of the product

Input: {ingredient}

Example inputs:
"2 tomatoes, 500ml milk, 3 eggs"
"pomidor 2 szt, mleko 500ml, 3 jajka"

Respond ONLY with a valid JSON array string in this exact format (no other text):
[
  {{
    "name": "[english name]",
    "originalAmount": [number],
    "originalUnit": "[original unit from input]",
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
  }}
]
`);

export type AnalyzedIngredient = {
  _id?: Types.ObjectId;
  name: string;
  originalAmount: number;
  originalUnit: string;
  unit: string;
  nutrition: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
};

// Update the analyzeIngredients function
export async function analyzeIngredients(
  ingredientInput: string
): Promise<AnalyzedIngredient[]> {
  const chain = prompt.pipe(model);
  const results = [];

  try {
    const analysis = await chain.invoke({ ingredient: ingredientInput });
    let parsedIngredients;

    try {
      parsedIngredients = JSON.parse(analysis.content.toString());
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to parse AI response: ${error.message}\nResponse: ${analysis.content}`
        );
      } else {
        throw new Error(
          `Failed to parse AI response: Unknown error\nResponse: ${analysis.content}`
        );
      }
    }

    for (const newIngredient of parsedIngredients) {
      try {
        // Check if ingredient already exists
        const existingIngredient = await Ingredient.findOne({
          name: { $regex: new RegExp(newIngredient.name, "i") },
        });

        if (existingIngredient) {
          const existingDoc = existingIngredient.toObject();
          results.push({
            _id: existingDoc._id,
            name: existingDoc.name,
            unit: existingDoc.unit,
            nutrition: existingDoc.nutrition,
            originalAmount: newIngredient.originalAmount,
            originalUnit: newIngredient.originalUnit,
          });
          continue;
        }

        // Validate new ingredient before saving
        const isValid = await isValidFood(newIngredient.name);
        if (isValid) {
          const savedIngredient = await Ingredient.create({
            name: newIngredient.name,
            unit: newIngredient.unit,
            nutrition: newIngredient.nutrition,
          });
          results.push({
            ...savedIngredient.toObject(),
            originalAmount: newIngredient.originalAmount,
            originalUnit: newIngredient.originalUnit,
          });
        }
      } catch (error) {
        console.error(
          `Error processing ingredient "${newIngredient.name}":`,
          error
        );
        // Continue with next ingredient instead of failing completely
        continue;
      }
    }

    return results;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ingredient analysis failed: ${error.message}`);
    } else {
      throw new Error("Ingredient analysis failed: Unknown error");
    }
  }
}
