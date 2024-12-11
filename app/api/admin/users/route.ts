import { processApiHandler, getServerSessionProcessed } from "@/lib/apiUtils";
import connectDB from "@/lib/connectToDatabase";
import { UserPermissions } from "@/lib/permissions";
import User from "@/models/User";
import { NextResponse } from "next/server";

const GET = async () => {
  await connectDB();

  await getServerSessionProcessed([UserPermissions.readUsers]);

  const users = await User.find().select("-password");

  return NextResponse.json(users);
};

export default {
  GET: processApiHandler(GET),
};
