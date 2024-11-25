import { NextRequest, NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import authOptions from "@/lib/nextauth";

export async function GET(req: NextRequest) {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    session: {
      user: {
        email: session.user.email,
        username: session.user.username,
        permissions: session.user.permissions,
      },
    },
  });
}
