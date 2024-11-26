import { NextRequest, NextResponse } from "next/server";
import { getServerSessionAuth } from "@/lib/nextauth";
import { generateRecipes } from "@/lib/Recipe/generateRecipes";
import connectDB from "@/lib/connectToDatabase";
import { generateIngredient } from "@/lib/Ingredients/generateIngredeints";
import mongoose from "mongoose";
import RecipeModel from "@/models/Recipe";

export async function POST(req: NextRequest) {
  const session = await getServerSessionAuth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { ingredients: ingredientsInput, count } = body;

  if (!ingredientsInput || !count) {
    return NextResponse.json(
      { error: "'ingredients' and 'count' are required" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    // Split ingredients string into array and process each ingredient
    const ingredientsList = ingredientsInput
      .toString()
      .split(",")
      .map((i: string) => i.trim());
    const generatedIngredients = await Promise.all(
      ingredientsList.map(async (ingredientName: string) => {
        const ingredient = await generateIngredient(ingredientName);
        if (!ingredient) {
          throw new Error(`Failed to generate ingredient: ${ingredientName}`);
        }
        return ingredient;
      })
    );

    if (!generatedIngredients.length) {
      return NextResponse.json(
        { error: "No ingredients could be generated" },
        { status: 400 }
      );
    }

    const recipes = await generateRecipes(generatedIngredients, count);

    if (!recipes || !recipes.length) {
      return NextResponse.json(
        { error: "Failed to generate recipes" },
        { status: 500 }
      );
    }

    const savedRecipes = await Promise.all(
      recipes.map(async (recipeData) => {
        const recipe = new RecipeModel(recipeData);
        recipe.createdBy = new mongoose.Types.ObjectId(session.user.id);
        await recipe.save();
        await recipe.populate("ingredients.ingredient");
        return recipe;
      })
    );

    return NextResponse.json({
      recipes: savedRecipes,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Server error occurred",
      },
      { status: 500 }
    );
  }
}
