/**
 * Feature access permissions based on subscription plan
 */

import { PlanId, isProPlan } from "@/config/plans";

export interface FeaturePermission {
  id: string;
  allowed: boolean;
  reason?: string;
}

export function canUseFeature(
  planId: PlanId | null | undefined,
  featureId: string
): FeaturePermission {
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
    "multiple-templates": (isPro) => ({
      id: "multiple-templates",
      allowed: isPro,
      reason: isPro ? undefined : "Multiple templates are available in Pro plan",
    }),
    "analytics-dashboard": (isPro) => ({
      id: "analytics-dashboard",
      allowed: isPro,
      reason: isPro ? undefined : "Analytics are available in Pro plan",
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

