import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import Recipe from "@/models/Recipe";
import {
  getServerSessionOrCauseUnathorizedError,
  withApiErrorHandling,
} from "@/lib/apiUtils";

type Context = { params: { id: string } };

export const POST = withApiErrorHandling(
  async (_req: NextRequest, { params }: Context) => {
    const session = await getServerSessionOrCauseUnathorizedError();

    const { id: recipeId } = params;

    await connectDB();

    if (!(await Recipe.exists({ _id: recipeId }))) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        $addToSet: { favorites: recipeId },
      },
      { new: true }
    );

    return NextResponse.json({ success: true, favorites: user?.favorites });
  }
);

export const DELETE = withApiErrorHandling(
  async (_req: NextRequest, { params }: Context) => {
    const session = await getServerSessionOrCauseUnathorizedError();

    const { id: recipeId } = params;

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        $pull: { favorites: recipeId },
      },
      { new: true }
    );

    return NextResponse.json({ success: true, favorites: user?.favorites });
  }
);
