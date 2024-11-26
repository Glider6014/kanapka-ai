import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { signUpFormSchema } from "@/lib/formSchemas/authFormSchemas";

export async function POST(request: Request) {
  await connectDB();

  const body = await request.json().catch(() => null);

  const result = signUpFormSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  const { username, email, password } = result.data;

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
}
