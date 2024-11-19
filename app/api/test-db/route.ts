import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import Recipe from "@/models/Recipe";
import Ingredient from "@/models/Ingredient";

export async function GET(req: NextRequest) {
  await connectDB();

  const testUser = new User({
    username: "testuser3",
    email: "testuser@example.com3",
    password: "securepassword",
    permissions: ["read:recipes"],
    experience: 0,
  });

  await testUser.save();

  const testIngredient = new Ingredient({
    name: "Test Ingredient3",
    unit: "g",
    nutrition: {
      calories: 100,
      protein: 5,
      fats: 2,
      carbs: 20,
      fiber: 3,
      sugar: 10,
      sodium: 1,
    },
  });

  await testIngredient.save();

  const testRecipe = new Recipe({
    name: "Test Recipe3",
    description: "This is a test recipe.",
    ingredients: [
      {
        ingredient: testIngredient._id,
        amount: 2,
      },
    ],
    steps: ["Step 1: Do something", "Step 2: Do something else"],
    prepTime: 10,
    cookTime: 20,
    difficulty: "Easy",
    experience: 10,
    createdBy: testUser._id,
  });

  await testRecipe.save();

  return NextResponse.json({ message: "Successfully created test data." });
}
