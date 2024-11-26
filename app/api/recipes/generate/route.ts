import { NextRequest, NextResponse } from "next/server";
import { getServerSessionAuth } from "@/lib/nextauth";
import { generateRecipes } from "@/lib/langchain/generateRecipes";
import connectDB from "@/lib/connectToDatabase";
import { extractIngredients } from "@/lib/langchain/extractIngredients";

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSessionAuth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
      recipe.createdBy = session.user.id;
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
