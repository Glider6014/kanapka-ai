import { NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import { MealSchedule } from "@/models/MealSchedule";
import { getServerSessionProcessed, processApiHandler } from "@/lib/apiUtils";

interface Schedule {
  _id: string;
  date: string;
  duration: number;
  recipeId: {
    name: string;
    _id: string;
  };
}

const handleGET = async () => {
  const session = await getServerSessionProcessed();

  await connectDB();

  const schedules: Schedule[] = await MealSchedule.find({
    userId: session.user.id,
  })
    .populate("recipeId", "name")
    .lean<Schedule[]>();

  const events = schedules.map((schedule: Schedule) => {
    const startDate = new Date(schedule.date);
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + (schedule.duration || 0));

    const recipe = schedule.recipeId;
    if (!recipe) return null;

    return {
      id: schedule._id.toString(),
      title: schedule.recipeId.name,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      allDay: false,
      duration: schedule.duration,
      recipeId: schedule.recipeId._id.toString(),
    };
  });

  const filteredEvents = events.filter((e) => e);

  return NextResponse.json({ events: filteredEvents });
};

export const GET = processApiHandler(handleGET);
