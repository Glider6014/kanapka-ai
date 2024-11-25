import connectDB from "@/lib/connectToDatabase";
import Ingredient from "@/models/Ingredient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const ingredients = await Ingredient.find({});

    return NextResponse.json(ingredients, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 }
    );
  }
}
