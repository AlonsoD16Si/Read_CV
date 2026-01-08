/**
 * Feature access permissions based on subscription plan and user state
 */

import { PlanId, isProPlan } from "@/config/plans";
import { UserStateContext, canAccessFeature } from "./user-states";

export interface FeaturePermission {
  id: string;
  allowed: boolean;
  reason?: string;
}

export function canUseFeature(
  planId: PlanId | null | undefined,
  featureId: string,
  userState?: UserStateContext
): FeaturePermission {
  // Use user state if provided (more accurate)
  if (userState) {
    const allowed = canAccessFeature(userState, featureId);
    return {
      id: featureId,
      allowed,
      reason: allowed
        ? undefined
        : getFeatureReason(featureId, planId, userState.state),
    };
  }

  // Fallback to plan-based check
  const isPro = isProPlan(planId);

  const featurePermissions: Record<string, (isPro: boolean) => FeaturePermission> = {
    "custom-domain": (isPro) => ({
      id: "custom-domain",
      allowed: isPro,
      reason: isPro ? undefined : "Custom domains are available in Pro plan",
    }),
    "advanced-seo": (isPro) => ({
      id: "advanced-seo",
      allowed: isPro,
      reason: isPro ? undefined : "Advanced SEO is available in Pro plan",
    }),
    "remove-branding": (isPro) => ({
      id: "remove-branding",
      allowed: isPro,
      reason: isPro ? undefined : "Branding removal is available in Pro plan",
    }),
    "advanced-sections": (isPro) => ({
      id: "advanced-sections",
      allowed: isPro,
      reason: isPro ? undefined : "Advanced sections (MDX, Projects, Metrics) are available in Pro plan",
    }),
    "analytics-dashboard": (isPro) => ({
      id: "analytics-dashboard",
      allowed: isPro,
      reason: isPro ? undefined : "Analytics are available in Pro plan",
    }),
    "recruiter-mode": (isPro) => ({
      id: "recruiter-mode",
      allowed: isPro,
      reason: isPro ? undefined : "Recruiter mode is available in Pro plan",
    }),
    "custom-cta": (isPro) => ({
      id: "custom-cta",
      allowed: isPro,
      reason: isPro ? undefined : "Custom CTAs are available in Pro plan",
    }),
  };

  const permission = featurePermissions[featureId];
  if (!permission) {
    return {
      id: featureId,
      allowed: true, // Default to allowed for unknown features
    };
  }

  return permission(isPro);
}

function getFeatureReason(
  featureId: string,
  planId: PlanId | null | undefined,
  state: string
): string {
  if (state === "visitor" || state === "public_viewer") {
    return "Please log in to access this feature";
  }
  if (state === "registered") {
    return "Please create and publish your profile first";
  }
  if (planId !== "pro") {
    return `${featureId} is available in Pro plan`;
  }
  return "Feature not available";
}

