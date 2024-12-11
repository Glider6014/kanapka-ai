import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { signUpFormSchema } from "@/lib/formSchemas/authFormSchemas";

export async function POST(request: Request) {
  await connectDB();

  const body = await request.json().catch(() => null);
  const validationResult = signUpFormSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: validationResult.error.message },
      { status: 400 }
    );
  }

  const { username, displayName, email, password } = validationResult.data;

  if (
    await User.exists({
      $or: [{ email }, { username }],
    })
  ) {
    return NextResponse.json(
      { message: "User with this email or username already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = await User.create({
    username,
    displayName,
    email,
    password: hashedPassword,
  });

  const user = await User.findById(createdUser._id).select("-password");

  return NextResponse.json(
    { message: "User created successfully", user },
    { status: 201 }
  );
}
