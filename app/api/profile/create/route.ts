/**
 * Create profile API route
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { validateUsername } from "@/lib/utils";
import { z } from "zod";

const createProfileSchema = z.object({
  username: z.string().min(3).max(20),
  content: z.string().optional(), // Legacy MDX content (optional)
  sections: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        content: z.any(),
        order: z.number(),
      })
    )
    .optional(), // New section-based structure
  published: z.boolean().optional().default(false),
  // New Profile fields
  displayName: z.string().optional().nullable(),
  headline: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  profilePhotoUrl: z
    .union([
      z.string().url(), // Full URLs (https://example.com/image.jpg)
      z.string().startsWith("/"), // Relative paths (/uploads/profiles/image.jpg)
      z.literal(""),
      z.null(),
      z.undefined(),
    ])
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  accentColor: z.string().optional().nullable(),
  layoutStyle: z.string().optional().nullable(),
  // Social links - allow empty strings or valid URLs
  githubUrl: z
    .union([z.string().url(), z.literal(""), z.null(), z.undefined()])
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  linkedinUrl: z
    .union([z.string().url(), z.literal(""), z.null(), z.undefined()])
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  websiteUrl: z
    .union([z.string().url(), z.literal(""), z.null(), z.undefined()])
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  twitterUrl: z
    .union([z.string().url(), z.literal(""), z.null(), z.undefined()])
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  // Professional experiences (max 3)
  experiences: z
    .array(
      z.object({
        company: z.string().min(1),
        role: z.string().min(1),
        startDate: z.string().min(1),
        endDate: z.string().nullable(),
        description: z.string().optional().default(""),
        techStack: z.array(z.string()).default([]),
        location: z.string().nullable().optional(),
        order: z.number().default(0),
      })
    )
    .max(3)
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createProfileSchema.parse(body);

    if (!validateUsername(validatedData.username)) {
      return NextResponse.json(
        { error: "Invalid username format" },
        { status: 400 }
      );
    }

    // Check if username is taken
    const existingProfile = await prisma.profile.findUnique({
      where: { username: validatedData.username },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Check if user already has a profile
    const existingUserProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingUserProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 400 }
      );
    }

    // Create profile with sections
    const profileData: any = {
      userId: session.user.id,
      username: validatedData.username,
      published: validatedData.published || false,
      // New Profile fields
      displayName: validatedData.displayName || null,
      headline: validatedData.headline || null,
      location: validatedData.location || null,
      profilePhotoUrl: validatedData.profilePhotoUrl || null,
      accentColor: validatedData.accentColor || null,
      layoutStyle: validatedData.layoutStyle || null,
      githubUrl: validatedData.githubUrl || null,
      linkedinUrl: validatedData.linkedinUrl || null,
      websiteUrl: validatedData.websiteUrl || null,
      twitterUrl: validatedData.twitterUrl || null,
    };

    // Support legacy MDX content
    if (validatedData.content) {
      profileData.content = validatedData.content;
    }

    // Create profile with sections if provided
    // Prisma requires nested create syntax for relations
    if (validatedData.sections && validatedData.sections.length > 0) {
      profileData.sections = {
        create: validatedData.sections.map((section: any) => ({
          type: section.type,
          content: section.content,
          order: section.order,
        })),
      };
    }

    const profile = await prisma.profile.create({
      data: {
        ...profileData,
        // Create experiences if provided
        experiences:
          validatedData.experiences && validatedData.experiences.length > 0
            ? {
                create: validatedData.experiences.map(
                  (exp: any, index: number) => ({
                    company: exp.company,
                    role: exp.role,
                    startDate: exp.startDate,
                    endDate: exp.endDate,
                    description: exp.description || "",
                    techStack: exp.techStack || [],
                    location: exp.location || null,
                    order: index,
                  })
                ),
              }
            : undefined,
      },
      include: {
        sections: true,
        experiences: {
          orderBy: { order: "asc" },
        },
      },
    });

    // Update user username
    await prisma.user.update({
      where: { id: session.user.id },
      data: { username: validatedData.username },
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
