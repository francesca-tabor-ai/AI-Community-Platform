import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { badRequest } from "@/lib/api-v1/errors";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const user = await prisma.user.findUnique({
    where: { id: authResult.user.id },
    include: { profile: true },
  });

  if (!user) {
    const { notFound } = await import("@/lib/api-v1/errors");
    return notFound("User not found");
  }

  const profileData = (user.profileData as Record<string, unknown>) ?? {};
  const profile = {
    ...profileData,
    displayName: user.profile?.displayName ?? user.name,
    bio: user.bio ?? user.profile?.bio,
    avatarUrl: user.image ?? user.profile?.avatarUrl,
    skills: profileData.skills,
    interests: profileData.interests,
  };

  return Response.json({
    user_id: user.id,
    username: user.username,
    email: user.email,
    profile,
  });
}

const updateSchema = z.object({
  username: z.string().min(2).max(50).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  profile: z.record(z.unknown()).optional(),
});

export async function PUT(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      const field_errors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const path = e.path[0]?.toString();
        if (path) field_errors[path] = e.message;
      });
      return badRequest("Validation failed", field_errors);
    }

    const updates: { username?: string; profileData?: object } = {};

    if (parsed.data.username !== undefined) {
      const existing = await prisma.user.findUnique({
        where: { username: parsed.data.username },
      });
      if (existing && existing.id !== authResult.user.id) {
        const { conflict } = await import("@/lib/api-v1/errors");
        return conflict("Username already taken");
      }
      updates.username = parsed.data.username;
    }

    if (parsed.data.profile !== undefined) {
      const current = (await prisma.user.findUnique({
        where: { id: authResult.user.id },
        select: { profileData: true },
      }))?.profileData as Record<string, unknown> | null;
      updates.profileData = { ...(current ?? {}), ...parsed.data.profile };
    }

    await prisma.user.update({
      where: { id: authResult.user.id },
      data: updates,
    });

    return Response.json({
      user_id: authResult.user.id,
      message: "Profile updated",
    });
  } catch {
    const { apiError } = await import("@/lib/api-v1/errors");
    return apiError(500, "Internal server error", { code: "INTERNAL_ERROR" });
  }
}
