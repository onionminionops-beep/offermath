import { NextRequest, NextResponse } from "next/server";
import { captureServer } from "@/lib/posthog-server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PAYMENT_LINK = "https://buy.stripe.com/eVq8wJ9DabII0vwarseUU03";
const PRICE_ID = "price_1UCQoW7pd3R2ckxOZn0lwlgB";

export async function POST(request: NextRequest) {
  try {
    if (!STRIPE_SECRET_KEY) {
      await captureServer("anonymous", "checkout_started", { product: "OfferMath", mode: "payment_link" });
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

    await captureServer("anonymous", "checkout_started", { product: "OfferMath", mode: "checkout_session" });
      return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    await captureServer("anonymous", "checkout_started", { product: "OfferMath", mode: "payment_link" });
    return NextResponse.json({ url: PAYMENT_LINK });
  }
}
