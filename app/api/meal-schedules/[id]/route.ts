import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/nextauth";
import connectDB from "@/lib/connectToDatabase";
import { MealSchedule } from "@/models/MealSchedule";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date } = await request.json();
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    await connectDB();

    const schedule = await MealSchedule.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { date: new Date(date) },
      { new: true }
    );

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error("Error updating meal schedule:", error);
    return NextResponse.json(
      { error: "Failed to update meal schedule" },
      { status: 500 }
    );
  }
}
