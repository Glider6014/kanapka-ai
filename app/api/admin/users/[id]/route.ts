import {
  withApiErrorHandling,
  getServerSessionOrCauseUnathorizedError,
} from "@/lib/apiUtils";
import connectDB from "@/lib/connectToDatabase";
import { UserPermissions } from "@/lib/permissions";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { permission } from "process";

type Params = { params: { id: string } };

export const POST = withApiErrorHandling(
  async (req: NextRequest, { params }: Params) => {
    await connectDB();

    await getServerSessionOrCauseUnathorizedError([UserPermissions.writeUsers]);

    const body = await req.json();

    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.permissions = body.permissions;

    await user.save();

    return NextResponse.json({
      permissions: user.permissions,
    });
  }
);

export const DELETE = withApiErrorHandling(
  async (_req: NextRequest, { params }: Params) => {
    await connectDB();

    await getServerSessionOrCauseUnathorizedError([
      UserPermissions.deleteUsers,
    ]);

    const user = await User.findByIdAndDelete(params.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted" });
  }
);
