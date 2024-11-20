import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/connectToDatabase";
import Recipe from "@/models/Recipe";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    const recipes = await Recipe.find({}).populate("ingredients.ingredient");
    return NextResponse.json({ recipes }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd serwera" },
      { status: 500 }
    );
  }
}
