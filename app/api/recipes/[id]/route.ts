import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import connectDB from "@/lib/connectToDatabase";
import Recipe from "@/models/Recipe";

export type GETParams = {
  params: {
    id: string;
  };
};

export async function GET({ params }: GETParams) {
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid recipe ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    const recipe = await Recipe.findById(id).populate("ingredients.ingredient");

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 }
    );
  }
}
