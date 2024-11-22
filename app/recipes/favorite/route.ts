// route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import Recipe from "@/models/Recipe";
import authOptions from "@/lib/nextauth";

// List favorites
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id)
      .populate("favorites")
      .select("favorites");

    return NextResponse.json({ favorites: user?.favorites || [] });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Add to favorites
export async function POST(
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

    // Verify recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Add to favorites if not already added
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $addToSet: { favorites: recipeId } },
      { new: true }
    );

    return NextResponse.json({ success: true, favorites: user?.favorites });
  } catch (error) {
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
