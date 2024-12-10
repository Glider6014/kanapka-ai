import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import Recipe from "@/models/Recipe";
import {
  getServerSessionOrCauseUnathorizedError,
  withApiErrorHandling,
} from "@/lib/apiUtils";

export type POSTParams = {
  params: {
    id: string;
  };
};

export const POST = withApiErrorHandling(
  async (req: NextRequest, { params }: POSTParams) => {
    const session = await getServerSessionOrCauseUnathorizedError();

    const { id: recipeId } = params;

    await connectDB();

    if (!(await Recipe.exists({ _id: recipeId }))) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const user = await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { favorites: recipeId },
    });

    return NextResponse.json({ success: true, favorites: user?.favorites });
  }
);

export const DELETE = withApiErrorHandling(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const session = await getServerSessionOrCauseUnathorizedError();

    const { id: recipeId } = params;

    await connectDB();

    const user = await User.findByIdAndUpdate(session.user.id, {
      $pull: { favorites: recipeId },
    });

    return NextResponse.json({ success: true, favorites: user?.favorites });
  }
);
