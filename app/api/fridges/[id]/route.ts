import { NextRequest, NextResponse } from "next/server";
import {
  withApiErrorHandling,
  getServerSessionOrCauseUnathorizedError,
} from "@/lib/apiUtils";
import Fridge from "@/models/Fridge";
import connectDB from "@/lib/connectToDatabase";
import { z } from "zod";
import User from "@/models/User";

export const GET = withApiErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    await connectDB();

    const session = await getServerSessionOrCauseUnathorizedError();
    const { id } = params;

    const fridge = await Fridge.findById(id);

    if (!fridge) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!fridge.isOwner(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(fridge);
  }
);

const fridgePutForm = z.object({
  name: z.string().optional(),
  members: z.array(z.string()).optional(),
});

export const PUT = withApiErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    await connectDB();

    const session = await getServerSessionOrCauseUnathorizedError();
    const { id } = params;

    const body = await req.json().catch(() => ({}));
    const result = fridgePutForm.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: result.error.issues },
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

    if (result.data.name) fridge.name = result.data.name;

    if (result.data.members) {
      for (const username of result.data.members) {
        if (fridge.isMember(username)) continue;

        const user = await User.findOne({ username });
        if (!user) continue;

        fridge.members.push(user._id);
      }
    }

    await fridge.save();

    return NextResponse.json(fridge);
  }
);

export const DELETE = withApiErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    await connectDB();

    const session = await getServerSessionOrCauseUnathorizedError();
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
  }
);
