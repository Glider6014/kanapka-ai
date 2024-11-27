import {
  withApiErrorHandling,
  getServerSessionOrCauseUnathorizedError,
} from "@/lib/apiUtils";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: { id: string } };

export const PATCH = withApiErrorHandling(
  async (req: NextRequest, { params }: Params) => {
    await connectDB();

    await getServerSessionOrCauseUnathorizedError(["update:users"]);

    const body = await req.json();
    const user = await User.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    ).select("-password");

    return Response.json(user);
  }
);

export const DELETE = withApiErrorHandling(
  async (_req: NextRequest, { params }: Params) => {
    await connectDB();

    await getServerSessionOrCauseUnathorizedError(["delete:users"]);

    const user = await User.findByIdAndDelete(params.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted" });
  }
);
