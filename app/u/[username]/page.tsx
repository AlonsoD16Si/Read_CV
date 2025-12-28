/**
 * Public profile page
 */

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseMDX } from "@/lib/mdx";
import { generateProfileMetadata } from "@/lib/seo";
import { ProfileRenderer } from "@/components/profile/profile-renderer";
import { MarkdownContent } from "@/components/profile/markdown-content";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await prisma.profile.findUnique({
    where: { username, published: true },
    include: { user: true },
  });

  if (!profile) {
    return {
      title: "Profile Not Found",
    };
  }

  const parsed = parseMDX(profile.content);
  return generateProfileMetadata({
    title: parsed.frontmatter.title || profile.username,
    description: parsed.frontmatter.description || "",
    username: profile.username,
    image: parsed.frontmatter.image,
    keywords: parsed.frontmatter.keywords,
  });
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await prisma.profile.findUnique({
    where: { username, published: true },
    include: { user: true },
  });

  if (!profile) {
    notFound();
  }

  // Increment view count
  await prisma.profile.update({
    where: { id: profile.id },
    data: { views: { increment: 1 } },
  });

  const parsed = parseMDX(profile.content);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <ProfileRenderer frontmatter={parsed.frontmatter}>
          <MarkdownContent content={parsed.content} />
        </ProfileRenderer>
      </div>
    </div>
  );
}

