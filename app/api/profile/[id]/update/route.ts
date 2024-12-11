import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { getServerSession, Session, User as UserType } from "next-auth";
import authOptions from "@/lib/nextauth";
import { z } from "zod";
import { UserPermissions } from "@/lib/permissions";

type Context = { params: { id: string } };

function canEditUser(user: UserType, session: Session) {
  return (
    user.id === session.user.id ||
    session.user.permissions.includes(UserPermissions.writeUsers)
  );
}

const postRequestSchema = z.object({
  userId: z.string(),
  updateData: z.object({
    displayName: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().url().optional(),
    bgc: z.string().url().optional(),
  }),
});

export type PostRequestSchemaType = z.infer<typeof postRequestSchema>;

export async function POST(request: NextRequest, { params }: Context) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const { id: userId } = params;

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!canEditUser(session.user, session)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const validationResult = postRequestSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        message: "Invalid input",
        errors: validationResult.error.errors,
      },
      { status: 400 }
    );
  }

  const { updateData } = validationResult.data;

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
