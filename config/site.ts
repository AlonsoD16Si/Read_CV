/**
 * Site-wide configuration for Nexary CV Platform
 */

export const siteConfig = {
  name: "Nexary",
  description:
    "Create beautiful, minimal, and SEO-optimized professional profiles using MDX.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/nexary",
    github: "https://github.com/nexary",
  },
  creator: "Nexary",
} as const;

export type SiteConfig = typeof siteConfig;

