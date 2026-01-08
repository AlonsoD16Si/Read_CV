/**
 * Profile API routes (GET, PATCH)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseMDX, validateFrontmatter } from "@/lib/mdx";
import { z } from "zod";

const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().nullable(),
  description: z.string().optional().default(""),
  techStack: z.array(z.string()).default([]),
  location: z.string().nullable().optional(),
  order: z.number().default(0),
});

const updateProfileSchema = z.object({
  content: z.string().optional(),
  published: z.boolean().optional(),
  // New Profile fields
  displayName: z.string().optional(),
  headline: z.string().optional(),
  location: z.string().optional(),
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
  experiences: z.array(experienceSchema).max(3).optional(),
  // Sections for section-based profiles
  sections: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        content: z.any(),
        order: z.number(),
      })
    )
    .optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profile = await prisma.profile.findUnique({
      where: { id },
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

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const profile = await prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Debug logging
    console.log("[API] Raw body experiences:", body.experiences);
    if (validatedData.experiences) {
      console.log(
        "[API] Validated experiences:",
        validatedData.experiences.map((exp: any) => ({
          company: exp.company,
          role: exp.role,
          techStack: exp.techStack,
          techStackType: typeof exp.techStack,
          techStackIsArray: Array.isArray(exp.techStack),
          techStackLength: Array.isArray(exp.techStack)
            ? exp.techStack.length
            : "N/A",
        }))
      );
    }

    if (validatedData.content !== undefined) {
      // Validate MDX content (only when MDX content is being updated)
      const parsed = parseMDX(validatedData.content);
      const validation = validateFrontmatter(parsed.frontmatter);

      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.errors.join(", ") },
          { status: 400 }
        );
      }
    }

    // Check if there's anything to update
    const hasUpdates =
      validatedData.content !== undefined ||
      validatedData.published !== undefined ||
      validatedData.displayName !== undefined ||
      validatedData.headline !== undefined ||
      validatedData.location !== undefined ||
      validatedData.profilePhotoUrl !== undefined ||
      validatedData.accentColor !== undefined ||
      validatedData.layoutStyle !== undefined ||
      validatedData.githubUrl !== undefined ||
      validatedData.linkedinUrl !== undefined ||
      validatedData.websiteUrl !== undefined ||
      validatedData.twitterUrl !== undefined ||
      validatedData.experiences !== undefined ||
      validatedData.sections !== undefined;

    if (!hasUpdates) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    // Update profile fields
    const profileUpdateData: any = {
      ...(validatedData.content !== undefined
        ? { content: validatedData.content }
        : {}),
      ...(validatedData.published !== undefined
        ? { published: validatedData.published }
        : {}),
      ...(validatedData.displayName !== undefined
        ? { displayName: validatedData.displayName }
        : {}),
      ...(validatedData.headline !== undefined
        ? { headline: validatedData.headline }
        : {}),
      ...(validatedData.location !== undefined
        ? { location: validatedData.location }
        : {}),
      ...(validatedData.profilePhotoUrl !== undefined
        ? { profilePhotoUrl: validatedData.profilePhotoUrl }
        : {}),
      ...(validatedData.accentColor !== undefined
        ? { accentColor: validatedData.accentColor }
        : {}),
      ...(validatedData.layoutStyle !== undefined
        ? { layoutStyle: validatedData.layoutStyle }
        : {}),
      ...(validatedData.githubUrl !== undefined
        ? { githubUrl: validatedData.githubUrl }
        : {}),
      ...(validatedData.linkedinUrl !== undefined
        ? { linkedinUrl: validatedData.linkedinUrl }
        : {}),
      ...(validatedData.websiteUrl !== undefined
        ? { websiteUrl: validatedData.websiteUrl }
        : {}),
      ...(validatedData.twitterUrl !== undefined
        ? { twitterUrl: validatedData.twitterUrl }
        : {}),
    };

    // Update experiences if provided
    if (validatedData.experiences !== undefined) {
      try {
        // Validate max 3 experiences
        if (validatedData.experiences.length > 3) {
          return NextResponse.json(
            { error: "Maximum 3 experiences allowed" },
            { status: 400 }
          );
        }

        // Delete existing experiences first
        await prisma.profileExperience.deleteMany({
          where: { profileId: id },
        });

        // Create experiences one by one to ensure techStack arrays are saved correctly
        if (validatedData.experiences.length > 0) {
          for (
            let index = 0;
            index < validatedData.experiences.length;
            index++
          ) {
            const exp = validatedData.experiences[index];

            // Ensure techStack is an array
            const techStack = Array.isArray(exp.techStack)
              ? exp.techStack.filter((tech: string) => tech && tech.trim())
              : [];

            console.log(`[API] Creating experience ${index}:`, {
              company: exp.company,
              role: exp.role,
              techStack: techStack,
              techStackType: typeof exp.techStack,
              techStackIsArray: Array.isArray(exp.techStack),
              techStackLength: techStack.length,
            });

            await prisma.profileExperience.create({
              data: {
                profileId: id,
                company: exp.company,
                role: exp.role,
                startDate: exp.startDate,
                endDate: exp.endDate,
                description: exp.description || "",
                techStack: techStack, // Ensure this is a proper array
                location: exp.location || null,
                order: index,
              },
            });
          }
        }
      } catch (expError: any) {
        console.error("[API] Error updating experiences:", expError);
        return NextResponse.json(
          {
            error: `Failed to update experiences: ${expError.message || "Unknown error"}`,
          },
          { status: 500 }
        );
      }
    }

    const updatedProfile = await prisma.profile.update({
      where: { id },
      data: profileUpdateData,
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
        experiences: {
          orderBy: { order: "asc" },
        },
      },
    });

    // Update sections if provided
    if (validatedData.sections !== undefined) {
      // Delete existing sections
      await prisma.profileSection.deleteMany({
        where: { profileId: id },
      });

      // Create new sections
      if (validatedData.sections.length > 0) {
        await prisma.profileSection.createMany({
          data: validatedData.sections.map((section: any) => ({
            profileId: id,
            type: section.type,
            content: section.content,
            order: section.order,
          })),
        });
      }

      // Fetch updated profile with sections and experiences
      const profileWithData = await prisma.profile.findUnique({
        where: { id },
        include: {
          sections: {
            orderBy: { order: "asc" },
          },
          experiences: {
            orderBy: { order: "asc" },
          },
        },
      });

      return NextResponse.json({ profile: profileWithData });
    }

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
