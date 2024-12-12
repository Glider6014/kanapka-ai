import { processApiHandler } from "@/lib/apiUtils";
import connectDB from "@/lib/connectToDatabase";
import Ingredient from "@/models/Ingredient";
import { NextResponse } from "next/server";

const handleGET = async () => {
  await connectDB();

  const ingredients = await Ingredient.find({});

  return NextResponse.json(ingredients, { status: 200 });
};

export const GET = processApiHandler(handleGET);
