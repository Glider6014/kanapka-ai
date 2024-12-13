import { getServerSession } from 'next-auth';
import authOptions from '@/lib/nextauth';
import { NextRequest, NextResponse } from 'next/server';

export class ApiError extends Error {
  status: number;

  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.status = statusCode;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export type Context = {
  params: Record<string, string>;
};

export type ApiHandler = (
  req: NextRequest,
  context: Context
) => Promise<NextResponse>;

export function processApiHandler(handler: ApiHandler) {
  return async (req: NextRequest, context: Context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        );
      }

      console.error(error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  };
}

export async function getServerSessionProcessed(permissions?: string[]) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  if (!permissions?.length) return session;

  for (const permission of permissions) {
    if (!session.user.permissions.includes(permission)) {
      throw new UnauthorizedError();
    }
  }

  return session;
}
