import { NextResponse } from "next/server";
import { planMeals } from "@/lib/mealsPlannerAgent/agent";

export async function POST(request: Request) {
  try {
    const { preferences } = await request.json();
    const mealPlan = await planMeals(preferences);
    return NextResponse.json({ result: mealPlan });
  } catch (error) {
    console.error("Error in meal planning:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
