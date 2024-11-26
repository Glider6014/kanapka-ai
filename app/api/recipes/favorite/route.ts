import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
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
