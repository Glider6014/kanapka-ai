import { getServerSession } from "next-auth";
import authOptions from "@/lib/nextauth";
import { NextResponse } from "next/server";

export class ApiError extends Error {
  status: number;

  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.status = statusCode;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// @ts-expect-error parameter 'handler' implicitly has an 'any' type
export function withApiErrorHandling(handler) {
  // @ts-expect-error parameter 'args' implicitly has an 'any' type
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        );
      }

      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  };
}

export async function getServerSessionOrCauseUnathorizedError(
  permissions?: string[]
) {
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
