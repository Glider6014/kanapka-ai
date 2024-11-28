import { NextResponse } from "next/server";
import { planMeals } from "@/lib/mealsPlannerAgent/agent";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/nextauth";

export async function POST(request: Request) {
  try {
    const { preferences, targetDate } = await request.json();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!preferences?.trim()) {
      return NextResponse.json(
        { error: "Preferences are required" },
        { status: 400 }
      );
    }

    if (!targetDate?.trim()) {
      return NextResponse.json(
        { error: "Target date is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const mealPlan = await planMeals(preferences, userId, targetDate);
    return NextResponse.json({ result: mealPlan });
  } catch (error) {
    console.error("Error in meal planning:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
