import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectToDatabase';
import { User } from '@/models/User';
import { Session, User as UserType } from 'next-auth';
import { z } from 'zod';
import { UserPermissions } from '@/lib/permissions';
import {
  Context,
  getServerSessionProcessed,
  processApiHandler,
} from '@/lib/apiUtils';

function canEditUser(user: UserType, session: Session) {
  return (
    user.id === session.user.id ||
    session.user.permissions.includes(UserPermissions.writeUsers)
  );
}

const postRequestSchema = z.object({
  updateData: z.object({
    displayName: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().url().optional(),
    bgc: z.string().url().optional(),
  }),
});

export type PostRequestSchemaType = z.infer<typeof postRequestSchema>;

const handlePOST = async (req: NextRequest, { params }: Context) => {
  await connectDB();

  const session = await getServerSessionProcessed();
  const { id: userId } = params;

  if (!canEditUser(session.user, session)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const validationResult = postRequestSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        message: 'Invalid input',
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
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    message: 'User updated successfully',
  });
};

export const POST = processApiHandler(handlePOST);
