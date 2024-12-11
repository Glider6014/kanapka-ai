import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import Recipe from "@/models/Recipe";

type Context = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Context) {
  await connectDB();

  const recipe = await Recipe.findById(params.id);

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  const nutrition = await recipe.calculateNutrition();

  return NextResponse.json(nutrition);
}
