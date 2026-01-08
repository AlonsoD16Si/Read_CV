/**
 * Site-wide configuration for Nexary
 * Nexary is not a CV platform - it's a Professional Identity Platform
 */

export const siteConfig = {
  name: "Nexary Identity",
  tagline: "Your Professional Identity, Optimized",
  description:
    "Nexary is your professional identity platform. Create a living, breathing representation of your career that's optimized to be found, understood, and hired.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/nexary",
    github: "https://github.com/nexary",
  },
  creator: "Nexary",
  // Profile URL patterns
  profileUrl: {
    free: (username: string) => `${siteConfig.url}/u/${username}`,
    pro: (username: string, customDomain?: string) =>
      customDomain || `${username}.nexary.dev`,
  },
} as const;

export type SiteConfig = typeof siteConfig;

