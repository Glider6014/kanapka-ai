import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import { MealSchedule } from "@/models/MealSchedule";
import {
  Context,
  getServerSessionProcessed,
  processApiHandler,
} from "@/lib/apiUtils";

const POST = async (req: NextRequest, { params }: Context) => {
  const session = await getServerSessionProcessed();

  const { date, duration } = await req.json();
  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  const updateData: { date: Date; duration?: number } = {
    date: new Date(date),
  };
  if (duration !== undefined) {
    updateData.duration = duration;
  }

  await connectDB();

  const schedule = await MealSchedule.findOneAndUpdate(
    { _id: params.id, userId: session.user.id },
    updateData,
    { new: true }
  );

  if (!schedule) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
  }

  const startTime = new Date(schedule.date);
  const endTime = new Date(startTime);
  endTime.setMinutes(startTime.getMinutes() + schedule.duration);

  return NextResponse.json({
    schedule: {
      ...schedule.toObject(),
      start: startTime,
      end: endTime,
      duration: schedule.duration,
    },
  });
};

const DELETE = async (req: NextRequest, { params }: Context) => {
  const session = await getServerSessionProcessed();

  await connectDB();

  const schedule = await MealSchedule.findOneAndDelete({
    _id: params.id,
    userId: session.user.id,
  });

  if (!schedule) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
};

export default {
  POST: processApiHandler(POST),
  DELETE: processApiHandler(DELETE),
};
