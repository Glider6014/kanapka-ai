import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import Ingredient from "@/models/Ingredient";
import { isValidFood } from "./validateIngredient";
import connectDB from "../connectToDatabase";

// Pydantic-like schema for the JSON output
type Ingredient = {
  name: string;
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

const parser = new JsonOutputParser<Ingredient[]>();

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const chatPrompt = ChatPromptTemplate.fromTemplate(`
  You are a JSON-only response bot. Your task is to analyze ingredients and return a JSON array.
  Format your entire response as a valid JSON array containing ingredient objects.

  For each ingredient, include:
  1. name (string): English name in singular form
  2. unit (string): Standard unit (g, ml, or piece)
  3. nutrition (object): Nutritional values

  Rules for units:
  - Fruits and vegetables: "piece"
  - Liquids: "ml"
  - Bakery and grain products: "g"
  - Meats and seafood: "g"
  - Dairy products: "g" or "ml"
  - Eggs: "piece"
  - Spices and condiments: "g"
  - Nuts and seeds: "g"
  - Packaged snacks: "g"
  - Legumes: "g"

  IMPORTANT: Respond ONLY with the JSON array. No other text or explanation.

  {format_instructions}
  
  Ingredients: {ingredients}
`);

async function validateIngredients(ing: {
  name: string | RegExp;
  unit: any;
  nutrition: any;
}) {
  await connectDB();

  const existingIngredient = await Ingredient.findOne({
    name: { $regex: new RegExp(ing.name, "i") },
  });
  if (existingIngredient) return existingIngredient;

  const isValid = await isValidFood(ing.name.toString());
  if (!isValid) return null;

  const ingredient = new Ingredient({
    name: ing.name,
    unit: ing.unit,
    nutrition: ing.nutrition,
  });

  return ingredient;
}

export async function extractIngredients(input: any) {
  try {
    const formatInstructions = parser.getFormatInstructions();
    const prompt = await chatPrompt.format({
      format_instructions: formatInstructions,
      ingredients: input,
    });

    const messages = [
      {
        role: "user",
        content: prompt,
      },
    ];

    const rawResponse = await model.call(messages);
    const parsedResponse = await parser.parse(rawResponse.content.toString());

    const validatedIngredients = await Promise.all(
      parsedResponse.map((ing) => validateIngredients(ing))
    );

    return validatedIngredients.filter((ing) => ing !== null);
    // reszta kodu pozostaje bez zmian
  } catch (error) {
    console.error("extractIngredients error:", error);
    throw error;
  }
}
