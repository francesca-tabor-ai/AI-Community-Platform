import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

const updateSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(100).optional(),
  avatarUrl: z.union([z.string().url(), z.literal("")]).optional(),
  bio: z.string().max(500).optional(),
});

export async function GET() {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const profile = await prisma.profile.findUnique({
    where: { userId: authResult.user.id },
  });

  if (!profile) {
    return NextResponse.json(
      { displayName: "", avatarUrl: "", bio: "" },
      { status: 200 }
    );
  }

  return NextResponse.json({
    displayName: profile.displayName ?? "",
    avatarUrl: profile.avatarUrl ?? "",
    bio: profile.bio ?? "",
  });
}

export async function PATCH(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { displayName, avatarUrl, bio } = parsed.data;

    await prisma.profile.upsert({
      where: { userId: authResult.user.id },
      create: {
        userId: authResult.user.id,
        displayName: displayName ?? "User",
        avatarUrl: avatarUrl || undefined,
        bio: bio ?? undefined,
      },
      update: {
        ...(displayName !== undefined && { displayName }),
        ...(avatarUrl !== undefined && { avatarUrl: avatarUrl || null }),
        ...(bio !== undefined && { bio }),
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
