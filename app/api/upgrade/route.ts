import { getServerSessionProcessed, processApiHandler } from "@/lib/apiUtils";
import connectDB from "@/lib/connectToDatabase";
import { UserSubscription } from "@/lib/subscriptions";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

const handlePOST = async (req: NextRequest) => {
  await connectDB();

  const session = await getServerSessionProcessed();

  const { promoCode } = await req.json();

  const user = await User.findById(session.user.id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (promoCode === process.env.PROMO_CODE) {
    user.subscriptionType = UserSubscription.PLUS;
    await user.save();

    return NextResponse.json(
      { message: "Subscription upgraded to plus" },
      { status: 200 }
    );
  } else {
    return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
  }
};

export const POST = processApiHandler(handlePOST);
