import { getServerSessionProcessed, processApiHandler } from "@/lib/apiUtils";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const handlePOST = async (_req: NextRequest) => {
  await connectDB();

  const session = await getServerSessionProcessed();

  const user = await User.findById(session.user.id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const product = await stripe.products.create({
    name: "Plus Subscription",
    description: "Unlock unlimited access to all features",
    images: ["localhost:3000/favicon.ico"],
  });

  const priceObject = await stripe.prices.create({
    product: product.id,
    unit_amount: 500, // Price in cents
    currency: "usd",
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "blik"],
    line_items: [
      {
        price: priceObject.id,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `localhost:3000/upgrade-confirmed`,
    cancel_url: `localhost:3000/pricing`,
  });

  user.stripeCheckoutSessionId = checkoutSession.id;
  await user.save();

  return NextResponse.json({ checkoutUrl: checkoutSession.url });
};

export const POST = processApiHandler(handlePOST);
