import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";

export type GETParams = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: GETParams) {
  await connectDB();

  const user = await User.findById(params.id);

  if (!user) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
