/**
 * MDX parsing and rendering utilities
 */

import matter from "gray-matter";

export interface ProfileFrontmatter {
  title: string;
  description?: string;
  image?: string;
  location?: string;
  email?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  keywords?: string[];
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParsedProfile {
  frontmatter: ProfileFrontmatter;
  content: string;
}

/**
 * Parse MDX content with frontmatter
 */
export function parseMDX(mdxContent: string): ParsedProfile {
  const { data, content } = matter(mdxContent);

  return {
    frontmatter: {
      title: data.title || "",
      description: data.description,
      image: data.image,
      location: data.location,
      email: data.email,
      website: data.website,
      twitter: data.twitter,
      github: data.github,
      linkedin: data.linkedin,
      keywords: data.keywords || [],
      published: data.published ?? false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
    content,
  };
}


/**
 * Validate profile frontmatter
 */
export function validateFrontmatter(
  frontmatter: Partial<ProfileFrontmatter>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!frontmatter.title || frontmatter.title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (frontmatter.title && frontmatter.title.length > 100) {
    errors.push("Title must be less than 100 characters");
  }

  if (frontmatter.description && frontmatter.description.length > 300) {
    errors.push("Description must be less than 300 characters");
  }

  if (frontmatter.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(frontmatter.email)) {
    errors.push("Invalid email format");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

