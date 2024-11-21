import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectToDatabase";
import Recipe from "@/models/Recipe";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const recipe = await Recipe.findById(params.id);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }
    const nutrition = await recipe.calculateNutrition();
    return NextResponse.json(nutrition);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
