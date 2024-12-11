import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/nextauth";
import connectDB from "@/lib/connectToDatabase";
import { MealSchedule } from "@/models/MealSchedule";

type Context = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
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
  } catch (error) {
    console.error("Error updating meal schedule:", error);
    return NextResponse.json(
      { error: "Failed to update meal schedule" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const schedule = await MealSchedule.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting meal schedule:", error);
    return NextResponse.json(
      { error: "Failed to delete meal schedule" },
      { status: 500 }
    );
  }
}
