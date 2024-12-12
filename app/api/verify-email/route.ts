import { NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/user/signin?verified=true`
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
