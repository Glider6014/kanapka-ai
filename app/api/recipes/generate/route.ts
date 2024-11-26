import { NextRequest, NextResponse } from "next/server";
import { getServerSessionAuth } from "@/lib/nextauth";
import { generateRecipes } from "@/lib/Recipe/generateRecipes";
import connectDB from "@/lib/connectToDatabase";
import { extractIngredients } from "@/lib/langchain/extractIngredients";
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
    const ingredients = await extractIngredients(ingredientsInput.toString());

    if (!ingredients.length) {
      return NextResponse.json(
        { error: "No ingredients found" },
        { status: 400 }
      );
    }

    await connectDB();
    await Promise.all(ingredients.map((ing) => ing.save()));

    const recipes = await generateRecipes(ingredients, count);

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
      { error: "Server error occurred" },
      { status: 500 }
    );
  }
}
