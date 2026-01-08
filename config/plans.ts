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
    description: "Perfect for getting started with your professional identity",
    price: null,
    features: [
      {
        id: "public-profile",
        name: "Public Profile",
        description: "Share your profile with a custom username (nexary.dev/u/username)",
      },
      {
        id: "basic-sections",
        name: "Basic Sections",
        description: "Hero, About, Experience, Education, Skills, Links",
      },
      {
        id: "nexary-branding",
        name: "Nexary Branding",
        description: "Powered by Nexary footer (required on Free plan)",
      },
      {
        id: "basic-seo",
        name: "Basic SEO",
        description: "Standard SEO optimization",
      },
      {
        id: "limited-customization",
        name: "Limited Customization",
        description: "Basic theme options",
      },
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For professionals who want complete control",
    price: {
      monthly: 9.99,
      currency: "USD",
    },
    features: [
      {
        id: "custom-domain",
        name: "Custom Domain",
        description: "Use your own domain (username.nexary.dev or yourdomain.com)",
      },
      {
        id: "advanced-sections",
        name: "Advanced Sections",
        description: "MDX sections, Projects with case studies, Metrics, Testimonials",
      },
      {
        id: "remove-branding",
        name: "Remove Branding",
        description: "Remove all Nexary branding from your profile",
      },
      {
        id: "advanced-seo",
        name: "Advanced SEO",
        description: "Custom SEO metadata, rich snippets, enhanced indexing",
      },
      {
        id: "analytics-dashboard",
        name: "Analytics Dashboard",
        description: "Track profile views, clicks, referrers, and engagement",
      },
      {
        id: "recruiter-mode",
        name: "Recruiter Mode",
        description: "Clean view for recruiters, PDF export, skill highlights",
      },
      {
        id: "custom-cta",
        name: "Custom CTA",
        description: "Add custom call-to-action buttons (Book a call, Hire me, etc.)",
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

