import { NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";

export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();

  const { userId, updateData } = body;

  if (!userId || !updateData) {
    return NextResponse.json(
      { message: "Invalid input" },
      { status: 400 }
    );
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "User updated successfully", user });
}
