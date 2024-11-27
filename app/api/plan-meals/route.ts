import { NextResponse } from "next/server";
import { planMeals } from "@/lib/mealsPlannerAgent/agent";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/nextauth";

export async function POST(request: Request) {
  try {
    const { preferences } = await request.json();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const mealPlan = await planMeals(preferences, userId);
    return NextResponse.json({ result: mealPlan });
  } catch (error) {
    console.error("Error in meal planning:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
