import { NextRequest, NextResponse } from "next/server";
import {
  processApiHandler,
  getServerSessionProcessed,
  Context,
} from "@/lib/apiUtils";
import Fridge from "@/models/Fridge";
import connectDB from "@/lib/connectToDatabase";
import { z } from "zod";
import User from "@/models/User";

const handleGET = async (_req: NextRequest, { params }: Context) => {
  await connectDB();

  const session = await getServerSessionProcessed();
  const { id } = params;

  const fridge = await Fridge.findById(id);

  if (!fridge) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!fridge.isOwner(session.user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(fridge);
};

const fridgePutForm = z.object({
  name: z.string().optional(),
  members: z.array(z.string()).optional(),
});

const handlePUT = async (req: NextRequest, { params }: Context) => {
  await connectDB();

  const session = await getServerSessionProcessed();
  const { id } = params;

  const body = await req.json().catch(() => ({}));
  const validationResult = fridgePutForm.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: validationResult.error.issues },
      { status: 400 }
    );
  }

  const fridge = await Fridge.findById(id);

  if (!fridge) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!fridge.isOwner(session.user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (validationResult.data.name) fridge.name = validationResult.data.name;

  if (validationResult.data.members) {
    for (const username of validationResult.data.members) {
      if (fridge.isMember(username)) continue;

      const user = await User.findOne({ username });
      if (!user) continue;

      fridge.members.push(user._id);
    }
  }

  await fridge.save();

  return NextResponse.json(fridge);
};

const handleDELETE = async (_req: NextRequest, { params }: Context) => {
  await connectDB();

  const session = await getServerSessionProcessed();
  const { id } = params;

  const fridge = await Fridge.findById(id);

  if (!fridge) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!fridge.isOwner(session.user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await fridge.deleteOne();

  return NextResponse.json({ message: "Fridge deleted" });
};

export const GET = processApiHandler(handleGET);
export const PUT = processApiHandler(handlePUT);
export const DELETE = processApiHandler(handleDELETE);
