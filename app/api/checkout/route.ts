import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PostHog } from "posthog-node";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PAYMENT_LINK = "https://buy.stripe.com/eVq8wJ9DabII0vwarseUU03";
const PRICE_ID = "price_1UCQoW7pd3R2ckxOZn0lwlgB";

const posthogClient = new PostHog(
  process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_yRSKUoUhg56ijGwnZCJhPH3ozSQSv2YnLQx5RYp6fUVy",
  {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  }
);

export async function POST(request: NextRequest) {
  try {
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json({ url: PAYMENT_LINK });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
    } as any);

    posthogClient.capture({
      distinctId: session.id,
      event: "checkout_session_created",
      properties: {
        product: "offermath",
        session_id: session.id,
        amount: 1900,
      },
    });

    await posthogClient.shutdown();

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ url: PAYMENT_LINK });
  }
}
