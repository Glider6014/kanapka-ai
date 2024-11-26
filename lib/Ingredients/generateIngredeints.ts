// lib/langchain/generateIngredient.ts

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import connectDB from "@/lib/connectToDatabase";
import Ingredient, { IngredientType } from "@/models/Ingredient";

const ingredientSchema = z.object({
  name: z.string(),
  unit: z.enum(["g", "ml", "piece"]),
  nutrition: z.object({
    calories: z.number(),
    protein: z.number(),
    fats: z.number(),
    carbs: z.number(),
    fiber: z.number(),
    sugar: z.number(),
    sodium: z.number(),
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

Ingredient to analyze: {ingredient}

{format_instructions}
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
      format_instructions: parser.getFormatInstructions(),
    });

    const parsedResult = ingredientSchema.parse(result);

    const newIngredient = new Ingredient({
      name: parsedResult.name.toLowerCase(),
      unit: parsedResult.unit,
      nutrition: parsedResult.nutrition,
    });

    await newIngredient.save();
    return newIngredient;
  } catch (error) {
    console.error("Error generating/saving ingredient:", error);
    return null;
  }
}

export type GeneratedIngredient = z.infer<typeof ingredientSchema>;
