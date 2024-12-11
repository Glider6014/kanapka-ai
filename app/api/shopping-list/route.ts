import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import { MealSchedule } from "@/models/MealSchedule";
import authOptions from "@/lib/nextauth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    await connectDB();

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    console.log("Looking for meals between:", startDate, "and", endDate);
    console.log("User ID:", session.user?.id);

    const mealSchedules = await MealSchedule.find({
      userId: session.user?.id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate({
      path: "recipeId",
      populate: {
        path: "ingredients.ingredient",
        model: "Ingredient",
      },
    });

    console.log("Raw meal schedules:", JSON.stringify(mealSchedules, null, 2));

    const ingredientsMap = new Map();

    mealSchedules.forEach((schedule) => {
      const recipe = schedule.recipeId;
      if (!recipe) {
        console.log("No recipe found for schedule:", schedule._id);
        return;
      }

      if (!Array.isArray(recipe.ingredients)) {
        console.log("No ingredients array for recipe:", recipe._id);
        return;
      }

      recipe.ingredients.forEach(
        (item: {
          ingredient: { _id: string; name: string; unit: string };
          amount: number;
        }) => {
          const ingredient = item.ingredient;
          if (!ingredient || !ingredient._id) {
            console.log("Invalid ingredient data in recipe:", recipe._id);
            return;
          }

          const key = ingredient._id.toString();
          const currentAmount = ingredientsMap.get(key)?.amount || 0;

          ingredientsMap.set(key, {
            _id: key,
            name: ingredient.name,
            amount: currentAmount + item.amount,
            unit: ingredient.unit,
          });
        }
      );
    });

    const items = Array.from(ingredientsMap.values());

    console.log("Final processed items:", items);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Shopping list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
