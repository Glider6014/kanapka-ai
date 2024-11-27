import {
  withApiErrorHandling,
  getServerSessionOrCauseUnathorizedError,
} from "@/lib/apiUtils";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const GET = withApiErrorHandling(async () => {
  await connectDB();

  await getServerSessionOrCauseUnathorizedError(["read:users"]);

  const users = await User.find().select("-password");

  return NextResponse.json(users);
});
