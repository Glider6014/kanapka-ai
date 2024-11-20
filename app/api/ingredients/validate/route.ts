import { NextRequest, NextResponse } from "next/server";
import {
  ValidationInput,
  ValidationItemResult,
  ValidationResponse,
} from "./types";
import { isValidFood, findExistingIngredient } from "@/lib/validation";

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
