import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";

export type GETParams = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: GETParams) {
  await connectDB();

  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: "Invalid user ID format" },
      { status: 400 }
    );
  }

  const user = await User.findById(id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user); 
}