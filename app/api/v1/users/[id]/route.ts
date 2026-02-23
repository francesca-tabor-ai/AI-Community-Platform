import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden } from "@/lib/api-v1/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      bio: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) return notFound("User not found");

  return Response.json({
    id: user.id,
    email: user.email,
    username: user.username,
    bio: user.bio,
    role: user.role,
    created_at: user.createdAt.toISOString(),
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  if (authResult.user.id !== id) {
    return forbidden("You can only update your own profile");
  }

  const body = await req.json().catch(() => ({}));
  const updates: { username?: string; bio?: string } = {};

  if (body.username !== undefined) {
    if (typeof body.username !== "string" || body.username.length < 2) {
      const { badRequest } = await import("@/lib/api-v1/errors");
      return badRequest("username must be at least 2 characters", {
        username: "Invalid username",
      });
    }
    const existing = await prisma.user.findUnique({
      where: { username: body.username },
    });
    if (existing && existing.id !== id) {
      const { conflict } = await import("@/lib/api-v1/errors");
      return conflict("Username already taken");
    }
    updates.username = body.username;
  }

  if (body.bio !== undefined) {
    updates.bio =
      typeof body.bio === "string" ? body.bio : String(body.bio ?? "");
  }

  const user = await prisma.user.update({
    where: { id },
    data: updates,
  });

  return Response.json({
    id: user.id,
    email: user.email,
    username: user.username,
    bio: user.bio,
    role: user.role,
    updated_at: user.updatedAt.toISOString(),
  });
}
