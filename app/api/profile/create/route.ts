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
  content: z.string(),
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

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        userId: session.user.id,
        username: validatedData.username,
        content: validatedData.content,
        published: false,
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

