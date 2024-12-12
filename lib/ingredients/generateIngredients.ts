import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import connectDB from "@/lib/connectToDatabase";
import Ingredient, { IngredientType } from "@/models/Ingredient";

const ingredientSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  unit: z.enum(["g", "ml", "piece"], {
    required_error: "Unit is required",
    invalid_type_error: "Invalid unit type. Must be 'g', 'ml', or 'piece'",
  }),
  nutrition: z.object({
    calories: z
      .number({
        required_error: "Calories value is required",
        invalid_type_error: "Calories must be a number",
      })
      .nonnegative("Calories cannot be negative"),
    protein: z
      .number({
        required_error: "Protein value is required",
        invalid_type_error: "Protein must be a number",
      })
      .nonnegative("Protein cannot be negative"),
    fats: z
      .number({
        required_error: "Fats value is required",
        invalid_type_error: "Fats must be a number",
      })
      .nonnegative("Fats cannot be negative"),
    carbs: z
      .number({
        required_error: "Carbs value is required",
        invalid_type_error: "Carbs must be a number",
      })
      .nonnegative("Carbs cannot be negative"),
    fiber: z
      .number({
        required_error: "Fiber value is required",
        invalid_type_error: "Fiber must be a number",
      })
      .nonnegative("Fiber cannot be negative"),
    sugar: z
      .number({
        required_error: "Sugar value is required",
        invalid_type_error: "Sugar must be a number",
      })
      .nonnegative("Sugar cannot be negative"),
    sodium: z
      .number({
        required_error: "Sodium value is required",
        invalid_type_error: "Sodium must be a number",
      })
      .nonnegative("Sodium cannot be negative"),
  }),
});

const parser = new StringOutputParser();

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
  cache: true,
});

const systemPrompt = ChatPromptTemplate.fromTemplate(`
  You are a nutritional information analyzer for food ingredients. Provide nutritional data in a specific JSON format.

  Required format:
  {{
    "name": "ingredient name in English",
    "unit": "g" | "ml" | "piece",
    "nutrition": {{
      "calories": number,
      "protein": number (g),
      "fats": number (g),
      "carbs": number (g),
      "fiber": number (g),
      "sugar": number (g),
      "sodium": number (mg)
    }}
  }}

  IMPORTANT:
  - Always return the ingredient name in English, regardless of input language.
  - Nutrition values should be PER PIECE for unit="piece"
  - Nutrition values should be PER 100g for unit="g"
  - Nutrition values should be PER 100ml for unit="ml"

  Examples:
  Input: "jabłko" (Polish) -> Output: {{"name": "apple", ...}}
  Respond ONLY with a valid JSON object.
`);

const humanPrompt = ChatPromptTemplate.fromTemplate(`
  Analyze the following food ingredient and provide its nutritional information:

  Ingredient to analyze: {ingredient}
`);

const prompt = ChatPromptTemplate.fromMessages([systemPrompt, humanPrompt]);

const chain = prompt.pipe(model).pipe(parser);

export async function generateIngredient(
  ingredientName: string
): Promise<IngredientType | null> {
  try {
    await connectDB();

    const existingIngredient = await Ingredient.findOne({
      name: { $regex: new RegExp(`^${ingredientName}$`, "i") },
    });

    if (existingIngredient) {
      return existingIngredient;
    }

    const result = await chain.invoke({
      ingredient: ingredientName,
    });

    const parsedResult = JSON.parse(result);
    const validationResult = ingredientSchema.safeParse(parsedResult);

    if (!validationResult.success) {
      console.error(
        "Validation errors:",
        validationResult.error.flatten().fieldErrors
      );
      return null;
    }

    const newIngredient = new Ingredient({
      name: validationResult.data.name.toLowerCase(),
      unit: validationResult.data.unit,
      nutrition: validationResult.data.nutrition,
    });

    await newIngredient.save();
    return newIngredient;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.flatten().fieldErrors);
    } else {
      console.error("Error generating/saving ingredient:", error);
    }
    return null;
  }
}

export type GeneratedIngredient = z.infer<typeof ingredientSchema>;
