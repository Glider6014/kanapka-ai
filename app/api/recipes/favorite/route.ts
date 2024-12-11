import { NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { getServerSessionProcessed, processApiHandler } from "@/lib/apiUtils";

const GET = async () => {
  await connectDB();

  const session = await getServerSessionProcessed();

  const user = await User.findById(session.user.id)
    .populate("favorites")
    .select("favorites");

  return NextResponse.json({ favorites: user?.favorites || [] });
};

export default {
  GET: processApiHandler(GET),
};
