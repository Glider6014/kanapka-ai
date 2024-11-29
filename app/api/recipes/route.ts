import { NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import Recipe from "@/models/Recipe";

export async function GET() {
  await connectDB();

  const recipes = await Recipe.find({}).populate("ingredients.ingredient");

  return NextResponse.json({ recipes }, { status: 200 });
}
