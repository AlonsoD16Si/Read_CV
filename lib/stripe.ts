/**
 * Mock Stripe for local development
 * No real Stripe required - all payments are simulated
 */

import { prisma } from "@/lib/db";

// Always use mock Stripe for now
const stripe = null;
console.log("🔧 Using mock Stripe for local development");

// Mock Stripe for local development
const mockStripe = {
  customers: {
    create: async (data: any) => ({
      id: `cus_mock_${Date.now()}`,
      email: data.email,
      metadata: data.metadata,
    }),
  },
  checkout: {
    sessions: {
      create: async (data: any) => ({
        id: `cs_mock_${Date.now()}`,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?success=true&mock=true`,
      }),
    },
  },
  subscriptions: {
    retrieve: async (id: string) => ({
      id,
      status: "active",
      current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
      items: {
        data: [{ price: { id: "price_mock" } }],
      },
    }),
  },
  webhooks: {
    constructEvent: (body: string, signature: string, secret: string) => {
      // Mock webhook event
      return JSON.parse(body);
    },
  },
};

export const stripeInstance = stripe || mockStripe;

export async function createCheckoutSession(
  userId: string,
  priceId: string
): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let customerId = user.stripeCustomerId;

  // Create Stripe customer if doesn't exist
  if (!customerId) {
    const customer = await stripeInstance.customers.create({
      email: user.email,
      metadata: {
        userId: user.id,
      },
    });
    customerId = customer.id;

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripeInstance.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing?canceled=true`,
    metadata: {
      userId: user.id,
    },
  });

  return session.url!;
}

export async function handleStripeWebhook(
  event: any
): Promise<void> {
  // In mock mode, just log the event
  if (!stripe) {
    console.log("🔧 Mock webhook event:", event.type);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;

      if (userId && session.subscription) {
        const subscription = await stripeInstance.subscriptions.retrieve(
          session.subscription as string
        );

        await prisma.user.update({
          where: { id: userId },
          data: {
            planId: "pro",
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        if (subscription.status === "active") {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              planId: "pro",
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          });
        } else {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              planId: "free",
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          });
        }
      }
      break;
    }
  }
}

