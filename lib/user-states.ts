/**
 * User state management for Nexary
 * Defines different user states and their permissions
 */

import { PlanId } from "@/config/plans";

export type UserState =
  | "visitor" // Not logged in, only viewing public profiles
  | "registered" // Logged in but no profile created
  | "free_user" // Has published profile on Free plan
  | "pro_user" // Has published profile on Pro plan
  | "owner" // Owner of the profile being viewed
  | "public_viewer"; // Viewing a public profile (can be visitor or logged in user)

export interface UserStateContext {
  state: UserState;
  userId?: string;
  planId?: PlanId | null;
  profileId?: string;
  isOwner?: boolean;
  isPublished?: boolean;
}

/**
 * Determine user state based on session and profile data
 */
export function determineUserState(
  session: { user: { id: string } } | null,
  profileOwnerId?: string,
  userPlanId?: PlanId | null,
  isProfilePublished?: boolean
): UserStateContext {
  // Public viewer (viewing someone else's profile)
  if (session && profileOwnerId && session.user.id !== profileOwnerId) {
    return {
      state: "public_viewer",
      userId: session.user.id,
      planId: userPlanId || null,
    };
  }

  // Visitor (not logged in)
  if (!session) {
    return {
      state: "visitor",
    };
  }

  // Owner (viewing own profile)
  if (profileOwnerId && session.user.id === profileOwnerId) {
    return {
      state: isProfilePublished
        ? (userPlanId === "pro" ? "pro_user" : "free_user")
        : "registered",
      userId: session.user.id,
      planId: userPlanId || null,
      profileId: profileOwnerId,
      isOwner: true,
      isPublished: isProfilePublished,
    };
  }

  // Registered but no profile
  if (!profileOwnerId) {
    return {
      state: "registered",
      userId: session.user.id,
      planId: userPlanId || null,
    };
  }

  // Default: registered user
  return {
    state: "registered",
    userId: session.user.id,
    planId: userPlanId || null,
  };
}

/**
 * Check if user can access a feature based on state
 */
export function canAccessFeature(
  state: UserStateContext,
  featureId: string
): boolean {
  // Owner always has access to edit their own profile
  if (state.isOwner && featureId.startsWith("edit:")) {
    return true;
  }

  // Pro features
  const proFeatures = [
    "custom-domain",
    "advanced-seo",
    "remove-branding",
    "advanced-sections",
    "analytics-dashboard",
    "recruiter-mode",
    "custom-cta",
  ];

  if (proFeatures.includes(featureId)) {
    return state.planId === "pro" && state.state === "pro_user";
  }

  // Free features
  const freeFeatures = [
    "public-profile",
    "basic-sections",
    "basic-seo",
    "limited-customization",
  ];

  if (freeFeatures.includes(featureId)) {
    return (
      state.state === "free_user" ||
      state.state === "pro_user" ||
      state.state === "registered"
    );
  }

  // Default: allow for registered users
  return state.state !== "visitor";
}

/**
 * Get user-friendly state label
 */
export function getUserStateLabel(state: UserState): string {
  const labels: Record<UserState, string> = {
    visitor: "Visitor",
    registered: "Getting Started",
    free_user: "Free User",
    pro_user: "Pro User",
    owner: "Owner",
    public_viewer: "Viewer",
  };
  return labels[state] || "Unknown";
}

