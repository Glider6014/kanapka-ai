import { NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import {
  getServerSessionOrCauseUnathorizedError,
  withApiErrorHandling,
} from "@/lib/apiUtils";

// List all favorites
export const GET = withApiErrorHandling(async () => {
  await connectDB();

  const session = await getServerSessionOrCauseUnathorizedError();

  const user = await User.findById(session.user.id)
    .populate("favorites")
    .select("favorites");

  return NextResponse.json({ favorites: user?.favorites || [] });
});
