import { NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import authOptions from "@/lib/nextauth";

export async function GET() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    session: session,
  });
}
