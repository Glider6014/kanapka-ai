import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import authOptions from "@/lib/nextauth";
import Recipe from "@/models/Recipe";
import {
  getServerSessionOrCauseUnathorizedError,
  withApiErrorHandling,
} from "@/lib/apiUtils";

// List all favorites
export const GET = withApiErrorHandling(async () => {
  await connectDB();

  const session = await getServerSessionOrCauseUnathorizedError();

  const user = await User.findById(session.user.id)
    .populate("favorites")
    .select("favorites");

  return NextResponse.json({ favorites: user?.favorites || [] });
});

export type POSTParams = {
  params: {
    recipeId: string;
  };
};

// Add to favorites
export const POST = withApiErrorHandling(
  async (req: NextRequest, { params }: POSTParams) => {
    await connectDB();

    const session = await getServerSessionOrCauseUnathorizedError();

    const { recipeId } = params;

    if (await Recipe.exists({ _id: recipeId })) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $addToSet: { favorites: recipeId } },
      { new: true }
    );

    return NextResponse.json({ success: true, favorites: user?.favorites });
  }
);

export type DELETEParams = {
  params: {
    recipeId: string;
  };
};

// Remove from favorites
export const DELETE = withApiErrorHandling(
  async (req: Request, { params }: DELETEParams) => {
    await connectDB();

    const session = await getServerSessionOrCauseUnathorizedError();

    const { recipeId } = params;

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $pull: { favorites: recipeId } },
      { new: true }
    );

    return NextResponse.json({ success: true, favorites: user?.favorites });
  }
);
