import { NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { getServerSessionProcessed, processApiHandler } from "@/lib/apiUtils";

const handleGET = async () => {
  await connectDB();

  const session = await getServerSessionProcessed();

  const user = await User.findById(session.user.id)
    .populate("favorites")
    .select("favorites");

  return NextResponse.json({ favorites: user?.favorites || [] });
};

export const GET = processApiHandler(handleGET);
