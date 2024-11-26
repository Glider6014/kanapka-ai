import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import Recipe from "@/models/Recipe";
import authOptions from "@/lib/nextauth";
import { NextApiRequest } from "next";

export type POSTParams = {
  params: {
    id: string;
  };
};

// Add to favorites
export async function POST(req: NextApiRequest, { params }: POSTParams) {
  try {
    console.log("POST request received with params:", params);
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: recipeId } = params;

    await connectDB();
    console.log("Connected to database");

    // Verify recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      console.log("Recipe not found:", recipeId);
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Add to favorites if not already added
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $addToSet: { favorites: recipeId } },
      { new: true }
    );

    if (user) {
      console.log("Recipe added to favorites:", recipeId);
      user.save();
    } else {
      console.log("User not found:", session.user.id);
    }

    return NextResponse.json({ success: true, favorites: user?.favorites });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Remove from favorites
export async function DELETE(
  request: Request,
  { params }: { params: { recipeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipeId } = params;

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $pull: { favorites: recipeId } },
      { new: true }
    );

    return NextResponse.json({ success: true, favorites: user?.favorites });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
