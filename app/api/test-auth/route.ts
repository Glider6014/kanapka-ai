import { NextResponse } from "next/server";
import { getServerSessionProcessed, processApiHandler } from "@/lib/apiUtils";

const GET = async () => {
  const session = await getServerSessionProcessed();

  return NextResponse.json({
    authenticated: true,
    session: session,
  });
};

export default {
  GET: processApiHandler(GET),
};
