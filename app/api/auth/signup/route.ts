import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { withApiErrorHandling } from "@/lib/apiUtils";

export const POST = withApiErrorHandling(async (request: Request) => {
  const { username, email, password } = await request.json();

  // Validate input
  if (!username || !email || !password) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  // Connect to database
  await connectDB();

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "User with this email or username already exists" },
      { status: 409 }
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user.toObject();

  return NextResponse.json(
    { message: "User created successfully", user: userWithoutPassword },
    { status: 201 }
  );
});
