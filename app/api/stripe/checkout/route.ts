/**
 * Stripe checkout session creation API
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCheckoutSession, stripeInstance } from "@/lib/stripe";
import { plans } from "@/config/plans";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = body;

    if (planId !== "pro") {
      return NextResponse.json(
        { error: "Invalid plan ID" },
        { status: 400 }
      );
    }

    const plan = plans.pro;
    // Use mock price ID if Stripe is not configured
    const priceId = plan.stripePriceId || "price_mock_pro";

    const checkoutUrl = await createCheckoutSession(
      session.user.id,
      priceId
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

