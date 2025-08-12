import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { sessionId } = await req.json();
  console.log("Server sessionId", sessionId);
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if payment was successful
    if (session.payment_status === "paid") {
      const sessionUserEmail = session.customer_email;
      console.log("Session customer email", sessionUserEmail);
      const authSession = await auth();
      const loggedInUserEmail = authSession?.user?.email;

      // Ensure authenticated user matches the Stripe session user
      if (sessionUserEmail !== loggedInUserEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      // Update user in DB
      await prisma.user.update({
        where: { email: loggedInUserEmail as string },
        data: { premiumAccountHolder: true },
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Payment not verified" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Stripe verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
