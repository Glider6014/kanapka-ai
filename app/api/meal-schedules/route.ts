import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/nextauth";
import connectDB from "@/lib/connectToDatabase";
import { MealSchedule } from "@/models/MealSchedule";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const schedules = await MealSchedule.find({ userId: session.user.id })
      .populate("recipeId", "name")
      .lean();

    const events = schedules.map((schedule) => {
      const startDate = new Date(schedule.date);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

      return {
        id: schedule._id.toString(),
        title: schedule.recipeId.name,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        allDay: false,
      };
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching meal schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal schedules" },
      { status: 500 }
    );
  }
}
