import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import Ingredient, { IngredientType } from "@/models/Ingredient";
import { isValidFood } from "./validateIngredient";
import connectDB from "../connectToDatabase";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
  stop: ["\n\n"], // Prevent extra text after JSON
});

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

Example output:
[
  {{
    "name": "tomato",
    "unit": "piece",
    "nutrition": {{
      "calories": 22,
      "protein": 1.1,
      "fats": 0.2,
      "carbs": 4.8,
      "fiber": 1.5,
      "sugar": 3.2,
      "sodium": 6
    }}
  }},
  {{
    "name": "milk",
    "unit": "ml",
    "nutrition": {{
      "calories": 42,
      "protein": 3.4,
      "fats": 1.0,
      "carbs": 5.0,
      "fiber": 0,
      "sugar": 5.0,
      "sodium": 44
    }}
  }},
  {{
    "name": "egg",
    "unit": "piece",
    "nutrition": {{
      "calories": 68,
      "protein": 5.5,
      "fats": 4.8,
      "carbs": 0.6,
      "fiber": 0,
      "sugar": 0.6,
      "sodium": 62
    }}
  }}
]

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
  }}
]
`);

const chain = prompt.pipe(model);

async function validateIngredients(ing: IngredientType) {
  await connectDB();

  // Check if ingredient already exists
  const existingIngredient = await Ingredient.findOne({
    name: { $regex: new RegExp(ing.name, "i") },
  });
  if (existingIngredient) return existingIngredient;

  // Validate new ingredient before saving
  const isValid = await isValidFood(ing.name);
  if (!isValid) return null;

  const ingredient = new Ingredient({
    name: ing.name,
    unit: ing.unit,
    nutrition: ing.nutrition,
  });

  return ingredient;
}

export async function extractIngredients(input: string) {
  try {
    const analysis = await chain.invoke({ ingredient: input });
    let parsedIngredients;

    try {
      parsedIngredients = JSON.parse(analysis.content.toString());
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse AI response: ${error.message}`);
      } else {
        throw new Error(`Failed to parse AI response: Unknown error`);
      }
    }

    const ingredientsPromises = parsedIngredients.map(validateIngredients);

    const ingredients = (await Promise.all(ingredientsPromises)).filter(
      Boolean
    );

    return ingredients;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ingredient analysis failed: ${error.message}`);
    } else {
      throw new Error("Ingredient analysis failed: Unknown error");
    }
  }
}
