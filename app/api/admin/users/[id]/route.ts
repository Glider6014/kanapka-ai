import {
  processApiHandler,
  getServerSessionProcessed,
  Context,
} from "@/lib/apiUtils";
import connectDB from "@/lib/connectToDatabase";
import { UserPermissions } from "@/lib/permissions";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

const POST = async (req: NextRequest, { params }: Context) => {
  await connectDB();

  await getServerSessionProcessed([UserPermissions.writeUsers]);

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
};

const DELETE = async (_req: NextRequest, { params }: Context) => {
  await connectDB();

  await getServerSessionProcessed([UserPermissions.deleteUsers]);

  const user = await User.findByIdAndDelete(params.id);

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "User deleted" });
};

export default {
  POST: processApiHandler(POST),
  DELETE: processApiHandler(DELETE),
};
