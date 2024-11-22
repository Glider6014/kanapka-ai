import { NextRequest, NextResponse } from "next/server";
import Recipe from "@/models/Recipe";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/nextauth";
import { generateRecipes } from "@/lib/langchain/generateRecipes";
import connectDB from "@/lib/connectToDatabase";
import { extractIngredients } from "@/lib/langchain/extractIngredients";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

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

    recipes.forEach((recipe) => {
      recipe.createdBy = "673d93b45e6334f13eadbd4f";
    });

    await connectDB();
    const savedRecipes = await Promise.all(
      recipes.map((recipe) => recipe.save())
    );

    await connectDB();
    const populatedRecipes = await Promise.all(
      savedRecipes.map((savedRecipe) =>
        savedRecipe.populate("ingredients.ingredient")
      )
    );

    return NextResponse.json({
      recipes: populatedRecipes,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 }
    );
  }
}
