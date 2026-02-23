import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { badRequest } from "@/lib/api-v1/errors";

function splitName(name: string | null): { first_name: string | null; last_name: string | null } {
  if (!name) return { first_name: null, last_name: null };
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return { first_name: null, last_name: null };
  if (parts.length === 1) return { first_name: parts[0], last_name: null };
  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(" "),
  };
}

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const user = await prisma.user.findUnique({
    where: { id: authResult.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      image: true,
      bio: true,
    },
  });

  if (!user) {
    const { notFound } = await import("@/lib/api-v1/errors");
    return notFound("User not found");
  }

  const { first_name, last_name } = splitName(user.name);

  return Response.json({
    user_id: user.id,
    username: user.username,
    email: user.email,
    first_name,
    last_name,
    profile_picture_url: user.image,
  });
}

const updateSchema = z.object({
  username: z.string().min(2).max(50).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  first_name: z.string().max(50).optional(),
  last_name: z.string().max(50).optional(),
  profile_picture_url: z.string().url().nullable().optional(),
});

import { z } from "zod";

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

    const updates: { username?: string; name?: string; image?: string | null } = {};

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

    if (parsed.data.first_name !== undefined || parsed.data.last_name !== undefined) {
      const fn = parsed.data.first_name ?? "";
      const ln = parsed.data.last_name ?? "";
      updates.name = [fn, ln].filter(Boolean).join(" ").trim() || undefined;
    }

    if (parsed.data.profile_picture_url !== undefined) {
      updates.image = parsed.data.profile_picture_url;
    }

    const user = await prisma.user.update({
      where: { id: authResult.user.id },
      data: updates,
    });

    const { first_name, last_name } = splitName(user.name);

    return Response.json({
      user_id: user.id,
      username: user.username,
      email: user.email,
      first_name,
      last_name,
      profile_picture_url: user.image,
    });
  } catch {
    const { apiError } = await import("@/lib/api-v1/errors");
    return apiError(500, "Internal server error", { code: "INTERNAL_ERROR" });
  }
}
