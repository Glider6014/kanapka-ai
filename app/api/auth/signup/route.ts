import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { signUpFormSchema } from "@/lib/formSchemas/authFormSchemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = signUpFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { username, email, password } = result.data;

    await connectDB();
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

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
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
