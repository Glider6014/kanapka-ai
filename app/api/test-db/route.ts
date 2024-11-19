import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import Recipe from "@/models/Recipe";
import Ingredient from "@/models/Ingredient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  const testUser = new User({
    username: "testuser",
    email: "testuser@example.com",
    password: "securepassword",
    permissions: ["read:recipes"],
    experience: 0,
  });

  await testUser.save();

  const testIngredient = new Ingredient({
    name: "Test Ingredient",
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
    name: "Test Recipe",
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

  res.status(200).json({ message: "Successfully created test data." });
}
