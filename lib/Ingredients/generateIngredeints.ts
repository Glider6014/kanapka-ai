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
});

const prompt = ChatPromptTemplate.fromTemplate(`
Analyze the given food ingredient and provide its nutritional information.

Required format:
{{
  "name": "ingredient name",
  "unit": "g" | "ml" | "piece",
  "nutrition": {{
    "calories": number (per 100g/ml),
    "protein": number (g per 100g/ml),
    "fats": number (g per 100g/ml),
    "carbs": number (g per 100g/ml),
    "fiber": number (g per 100g/ml),
    "sugar": number (g per 100g/ml),
    "sodium": number (mg per 100g/ml)
  }}
}}

Example response:
{{
  "name": "apple",
  "unit": "piece",
  "nutrition": {{
    "calories": 52,
    "protein": 0.3,
    "fats": 0.2,
    "carbs": 14,
    "fiber": 2.4,
    "sugar": 10.4,
    "sodium": 1
  }}
}}

Ingredient to analyze: {ingredient}

Respond ONLY with a valid JSON object.
`);

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
    const validation = ingredientSchema.safeParse(parsedResult);

    if (!validation.success) {
      console.error(
        "Validation errors:",
        validation.error.flatten().fieldErrors
      );
      return null;
    }

    const newIngredient = new Ingredient({
      name: validation.data.name.toLowerCase(),
      unit: validation.data.unit,
      nutrition: validation.data.nutrition,
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
