import { getServerSessionProcessed, processApiHandler } from "@/lib/apiUtils";
import connectDB from "@/lib/connectToDatabase";
import { UserSubscription } from "@/lib/subscriptions";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const handleGET = async (_req: NextRequest) => {
  await connectDB();

  const session = await getServerSessionProcessed();

  const user = await User.findById(session.user.id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const checkout = await stripe.checkout.sessions.retrieve(
    user.stripeCheckoutSessionId || ""
  );

  if (checkout.payment_status != "paid") {
    return NextResponse.json(
      { message: "Your subscription is not paid" },
      { status: 400 }
    );
  }

  user.subscriptionType = UserSubscription.PLUS;
  await user.save();

  return NextResponse.json({
    message: "Upgrade confirmed successfully",
    success: true,
  });
};

export const GET = processApiHandler(handleGET);
