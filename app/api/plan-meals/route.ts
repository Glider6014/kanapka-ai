import { NextRequest, NextResponse } from "next/server";
import { planMeals } from "@/lib/mealsPlannerAgent/agent";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/nextauth";
import { processApiHandler } from "@/lib/apiUtils";

const handlePOST = async (req: NextRequest) => {
  const { preferences, targetDate } = await req.json();
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
};

export const POST = processApiHandler(handlePOST);
