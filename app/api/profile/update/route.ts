import { NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/nextauth";

export async function POST(request: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { userId, updateData } = body;

  if (!userId || !updateData) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const user = await User.findByIdAndUpdate(userId, updateData);

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "User updated successfully", user });
}
