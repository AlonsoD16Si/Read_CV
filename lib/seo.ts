/**
 * SEO utilities and metadata generation
 */

import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export interface ProfileMetadata {
  title: string;
  description: string;
  username: string;
  image?: string;
  keywords?: string[];
}

export function generateProfileMetadata(
  profile: ProfileMetadata
): Metadata {
  const title = `${profile.title} | ${siteConfig.name}`;
  const description = profile.description || siteConfig.description;
  const url = `${siteConfig.url}/u/${profile.username}`;
  const image = profile.image || `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title,
    description,
    keywords: profile.keywords,
    openGraph: {
      type: "profile",
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: profile.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: `@${profile.username}`,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateSiteMetadata(
  title: string,
  description?: string
): Metadata {
  return {
    title: `${title} | ${siteConfig.name}`,
    description: description || siteConfig.description,
    openGraph: {
      type: "website",
      title: `${title} | ${siteConfig.name}`,
      description: description || siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description: description || siteConfig.description,
    },
  };
}

