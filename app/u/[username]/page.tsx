/**
 * Public profile page
 */

import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseMDX } from "@/lib/mdx";
import { generateProfileMetadata } from "@/lib/seo";
import { ProfileRenderer } from "@/components/profile/profile-renderer";
import { MarkdownContent } from "@/components/profile/markdown-content";
import { ProfessionalExperienceSection } from "@/components/profile/sections/professional-experience-section";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams?: { preview?: string } | Promise<{ preview?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username: rawUsername } = await params;
  const username = rawUsername?.toLowerCase();
  const profile = await prisma.profile.findUnique({
    where: { username },
    include: { user: true, sections: { orderBy: { order: "asc" } } },
  });

  const session = await getServerSession(authOptions);
  const isOwner = !!session?.user?.id && session.user.id === profile?.userId;

  if (!profile || (!profile.published && !isOwner)) {
    return {
      title: "Profile Not Found",
    };
  }

  // Use SEO data from profile if available, otherwise fallback to Profile fields or sections
  const seoTitle =
    profile.seoTitle ||
    profile.displayName ||
    profile.headline ||
    profile.username;
  const seoDescription = profile.seoDescription || profile.headline || "";

  // Try to get description from hero section if available
  if (!seoDescription && profile.sections) {
    const heroSection = profile.sections.find((s) => s.type === "hero");
    if (heroSection && heroSection.content) {
      const heroContent = heroSection.content as any;
      // Use new schema fields first, then legacy
      const heroTitle = heroContent.fullName || heroContent.name;
      const heroTagline = heroContent.tagline || heroContent.bio;
      if (heroTitle || heroTagline) {
        return generateProfileMetadata({
          title: heroTitle || seoTitle,
          description: heroTagline || seoDescription,
          username: profile.username,
          keywords: profile.seoKeywords?.split(",") || [],
          image: profile.profilePhotoUrl || undefined,
        });
      }
    }
  }

  // Fallback to legacy MDX parsing
  if (profile.content) {
    const parsed = parseMDX(profile.content);
    return generateProfileMetadata({
      title: parsed.frontmatter.title || seoTitle,
      description: parsed.frontmatter.description || seoDescription,
      username: profile.username,
      image: parsed.frontmatter.image,
      keywords:
        parsed.frontmatter.keywords || profile.seoKeywords?.split(",") || [],
    });
  }

  return generateProfileMetadata({
    title: seoTitle,
    description: seoDescription,
    username: profile.username,
    keywords: profile.seoKeywords?.split(",") || [],
    image: profile.profilePhotoUrl || undefined,
  });
}

export default async function PublicProfilePage({
  params,
  searchParams,
}: PageProps) {
  const { username: rawUsernameFromParams } = await params;
  const rawUsername = rawUsernameFromParams || "";
  const username = rawUsername.toLowerCase();

  // Canonicalize username to lowercase (keeps URLs consistent)
  if (rawUsername !== username) {
    redirect(`/u/${username}`);
  }

  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams as any)
    : undefined;

  // Find profile by username (don't filter by published yet)
  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      user: true,
      sections: {
        orderBy: { order: "asc" },
      },
      experiences: {
        orderBy: { order: "asc" },
      },
    },
  });

  // If profile doesn't exist, return 404
  if (!profile) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const isOwner = !!session?.user?.id && session.user.id === profile.userId;
  const isPreview = resolvedSearchParams?.preview === "1" && isOwner;

  // Only show unpublished profiles to their owner (or explicit preview)
  if (!profile.published && !isOwner && !isPreview) {
    notFound();
  }

  // Track view in analytics (async, don't block rendering)
  if (profile.published) {
    prisma.analytics
      .create({
        data: {
          profileId: profile.id,
          eventType: "view",
          referrer: null, // Will be set from request headers in API route if needed
          userAgent: null,
        },
      })
      .catch(console.error); // Don't fail if analytics fails
  }

  // Legacy: increment view count if using old system
  if (profile.published && profile.views !== undefined) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: { views: { increment: 1 } },
    });
  }

  // Render using new section-based system if sections exist
  if (profile.sections && profile.sections.length > 0) {
    const { SectionRenderer } =
      await import("@/components/profile/section-renderer");

    // Determine layout style
    const layoutClass =
      profile.layoutStyle === "compact"
        ? "max-w-2xl"
        : profile.layoutStyle === "modern"
          ? "max-w-6xl"
          : "max-w-3xl"; // minimal (default) - más estrecho para mejor legibilidad

    // Apply accent color as CSS variable if available
    const accentColorStyle = profile.accentColor
      ? ({ "--accent-color": profile.accentColor } as React.CSSProperties)
      : {};

    return (
      <div
        className="min-h-screen bg-white dark:bg-black"
        style={accentColorStyle}
      >
        <div className={`container mx-auto ${layoutClass} px-6 py-20`}>
          <article className="max-w-none">
            {!profile.published && (
              <div className="mb-8 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
                You are viewing a draft preview of your profile. It won't be
                visible publicly until you publish it.
              </div>
            )}
            {profile.sections.map((section) => (
              <SectionRenderer
                key={section.id}
                section={section as any}
                profile={{
                  displayName: profile.displayName,
                  headline: profile.headline,
                  location: profile.location,
                  profilePhotoUrl: profile.profilePhotoUrl,
                  accentColor: profile.accentColor,
                  layoutStyle: profile.layoutStyle,
                  githubUrl: profile.githubUrl,
                  linkedinUrl: profile.linkedinUrl,
                  websiteUrl: profile.websiteUrl,
                  twitterUrl: profile.twitterUrl,
                }}
              />
            ))}

            {/* Professional Experiences from ProfileExperience table */}
            {profile.experiences && profile.experiences.length > 0 && (
              <ProfessionalExperienceSection
                experiences={profile.experiences as any}
              />
            )}

            {/* Show branding unless removed (Pro feature) */}
            {!profile.removeBranding && (
              <footer className="mt-20 border-t border-gray-200 pt-8 dark:border-gray-800">
                <p className="text-center text-sm text-gray-500 dark:text-gray-500">
                  Powered by{" "}
                  <a
                    href="https://nexary.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    style={
                      profile.accentColor ? { color: profile.accentColor } : {}
                    }
                  >
                    Nexary
                  </a>
                </p>
              </footer>
            )}
          </article>
        </div>
      </div>
    );
  }

  // Fallback to legacy MDX rendering
  const parsed = parseMDX(profile.content || "");

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        {!profile.published && (
          <div className="mb-8 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
            You are viewing a draft preview of your profile. It won't be visible
            publicly until you publish it.
          </div>
        )}
        <ProfileRenderer frontmatter={parsed.frontmatter}>
          <MarkdownContent content={parsed.content} />
        </ProfileRenderer>
      </div>
    </div>
  );
}
