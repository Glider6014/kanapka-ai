import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import Recipe from "@/models/Recipe";
import { Context, processApiHandler } from "@/lib/apiUtils";

const handleGET = async (_req: NextRequest, { params }: Context) => {
  await connectDB();

  const recipe = await Recipe.findById(params.id);

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  const nutrition = await recipe.calculateNutrition();

  return NextResponse.json(nutrition);
};

export const GET = processApiHandler(handleGET);
