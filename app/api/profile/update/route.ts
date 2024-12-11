import { NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/nextauth";
import { z } from "zod";

const requestSchema = z.object({
  userId: z.string(),
  updateData: z.object({
    displayName: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().url().optional(),
    bgc: z.string().url().optional(),
  }),
});

type RequestSchemaType = z.infer<typeof requestSchema>;

export async function POST(request: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate request body against schema
  const validatedData = requestSchema.safeParse(body);

  if (!validatedData.success) {
    return NextResponse.json(
      {
        message: "Invalid input",
        errors: validatedData.error.errors,
      },
      { status: 400 }
    );
  }

  const { userId, updateData } = validatedData.data;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "User updated successfully",
  });
}
