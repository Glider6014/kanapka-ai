import { NextResponse } from "next/server";
import { getServerSessionProcessed, processApiHandler } from "@/lib/apiUtils";

const handleGET = async () => {
  const session = await getServerSessionProcessed();

  return NextResponse.json({
    authenticated: true,
    session: session,
  });
};

export const GET = processApiHandler(handleGET);
