import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const GET = async () => {
  const session = await auth();
  const user = session?.user;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: "price_1QxazEPIwniSDzKOfORIFvSX",
          quantity: 1,
        },
      ],
      customer_email: user?.email as string,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, status: 400 });
    }
  }
};
