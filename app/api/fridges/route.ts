import { NextRequest, NextResponse } from "next/server";
import { processApiHandler, getServerSessionProcessed } from "@/lib/apiUtils";
import Fridge from "@/models/Fridge";
import connectDB from "@/lib/connectToDatabase";
import { z } from "zod";

const GET = async () => {
  await connectDB();

  const session = await getServerSessionProcessed();

  const userId = session.user.id;
  const fridges = await Fridge.find({
    $or: [{ owner: userId }, { members: { $in: [userId] } }],
  }).populate("members");

  if (fridges.length === 0) {
    const newFridge = new Fridge({
      name: "Home",
      owner: userId,
    });

    await newFridge.save();

    fridges.push(newFridge);
  }

  return NextResponse.json(fridges);
};

const fridgePostForm = z.object({
  name: z.string(),
});

const POST = async (req: NextRequest) => {
  await connectDB();

  const session = await getServerSessionProcessed();

  const body = await req.json().catch(() => ({}));
  const validationResult = fridgePostForm.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: validationResult.error.issues },
      { status: 400 }
    );
  }

  const fridge = new Fridge({
    name: validationResult.data.name,
    owner: session.user.id,
  });

  await fridge.save();

  return NextResponse.json(fridge, { status: 201 });
};

export default {
  GET: processApiHandler(GET),
  POST: processApiHandler(POST),
};
