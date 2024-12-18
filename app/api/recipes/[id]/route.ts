import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import connectDB from "@/lib/connectToDatabase";
import Recipe from "@/models/Recipe";
import { Context, processApiHandler } from "@/lib/apiUtils";

const handleGET = async (_req: NextRequest, { params }: Context) => {
  await connectDB();

  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: "Invalid recipe ID format" },
      { status: 400 }
    );
  }

  const recipe = await Recipe.findById(id).populate("ingredients.ingredient");

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  return NextResponse.json(recipe);
};

export const GET = processApiHandler(handleGET);
