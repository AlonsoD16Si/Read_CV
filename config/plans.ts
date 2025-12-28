/**
 * Subscription plan definitions for Nexary CV Platform
 */

export type PlanId = "free" | "pro";

export interface PlanFeature {
  id: string;
  name: string;
  description?: string;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  price: {
    monthly: number;
    currency: string;
  } | null;
  features: PlanFeature[];
  stripePriceId?: string;
}

export const plans: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: null,
    features: [
      {
        id: "basic-profile",
        name: "Basic Profile",
        description: "Create a professional profile with MDX",
      },
      {
        id: "nexary-branding",
        name: "Nexary Branding",
        description: "Powered by Nexary footer",
      },
      {
        id: "limited-customization",
        name: "Limited Customization",
        description: "Basic theme options",
      },
      {
        id: "public-profile",
        name: "Public Profile",
        description: "Share your profile with a custom username",
      },
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For professionals who want more",
    price: {
      monthly: 9.99,
      currency: "USD",
    },
    features: [
      {
        id: "custom-domain",
        name: "Custom Domain",
        description: "Use your own domain name",
      },
      {
        id: "advanced-seo",
        name: "Advanced SEO",
        description: "Enhanced SEO optimization",
      },
      {
        id: "remove-branding",
        name: "Remove Branding",
        description: "Remove Nexary branding",
      },
      {
        id: "multiple-templates",
        name: "Multiple Templates",
        description: "Access to premium profile templates",
      },
      {
        id: "analytics-dashboard",
        name: "Analytics Dashboard",
        description: "Track profile views and engagement",
      },
      {
        id: "priority-support",
        name: "Priority Support",
        description: "Get help when you need it",
      },
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro_monthly",
  },
};

export function getPlanById(id: PlanId): Plan {
  return plans[id];
}

export function isProPlan(planId: PlanId | null | undefined): boolean {
  return planId === "pro";
}

