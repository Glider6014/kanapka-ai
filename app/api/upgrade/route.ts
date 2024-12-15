import { getServerSessionProcessed, processApiHandler } from '@/lib/apiUtils';
import connectDB from '@/lib/connectToDatabase';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const handlePOST = async (_req: NextRequest) => {
  await connectDB();

  const session = await getServerSessionProcessed();

  const user = await User.findById(session.user.id);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const product = await stripe.products.create({
    name: 'Plus Subscription',
    description: 'Unlock unlimited access to all features',
    images: ['https://i.imgur.com/XeCUkMO.png'],
  });

  const priceObject = await stripe.prices.create({
    product: product.id,
    unit_amount: 500, // Price in cents
    currency: 'usd',
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceObject.id,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:3000/user/upgrade-confirmed`,
    cancel_url: `http://localhost:3000/pricing`,
  });

  user.stripeCheckoutSessionId = checkoutSession.id;
  await user.save();

  return NextResponse.json({ checkoutUrl: checkoutSession.url });
};

export const POST = processApiHandler(handlePOST);
