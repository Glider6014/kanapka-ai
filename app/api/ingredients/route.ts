import { withApiErrorHandling } from "@/lib/apiUtils";
import connectDB from "@/lib/connectToDatabase";
import Ingredient from "@/models/Ingredient";
import { NextResponse } from "next/server";

export const GET = withApiErrorHandling(async () => {
  await connectDB();

  const ingredients = await Ingredient.find({});

  return NextResponse.json(ingredients, { status: 200 });
});
