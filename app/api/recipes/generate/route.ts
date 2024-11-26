import { NextRequest, NextResponse } from "next/server";
import { generateRecipes } from "@/lib/langchain/generateRecipes";
import connectDB from "@/lib/connectToDatabase";
import { extractIngredients } from "@/lib/langchain/extractIngredients";
import { z } from "zod";
import {
  getServerSessionOrCauseUnathorizedError,
  withApiErrorHandling,
} from "@/lib/apiUtils";

const requestSchema = z.object({
  ingredients: z.string(),
  count: z.number().int().positive().max(10),
});

export const POST = withApiErrorHandling(async (req: NextRequest) => {
  await connectDB();

  const session = await getServerSessionOrCauseUnathorizedError();

  const body = await req.json().catch(() => null);
  const result = requestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Validation error",
        issues: result.error.issues,
      },
      { status: 400 }
    );
  }

  const ingredients = await extractIngredients(
    result.data.ingredients.toString()
  );

  if (!ingredients.length) {
    return NextResponse.json(
      { error: "No ingredients found" },
      { status: 400 }
    );
  }

  await Promise.all(ingredients.map((ing) => ing.save()));

  const recipes = await generateRecipes(ingredients, result.data.count);

  recipes.forEach((recipe) => {
    recipe.createdBy = session.user.id;
  });

  const savedRecipes = await Promise.all(
    recipes.map((recipe) => recipe.save())
  );

  const populatedRecipes = await Promise.all(
    savedRecipes.map((savedRecipe) =>
      savedRecipe.populate("ingredients.ingredient")
    )
  );

  return NextResponse.json({
    recipes: populatedRecipes,
  });
});
