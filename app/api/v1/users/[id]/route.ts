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
      name: true,
      bio: true,
      image: true,
      headline: true,
      location: true,
      industry: true,
      openTo: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) return notFound("User not found");

  const [firstName, ...rest] = (user.name ?? "").split(" ");
  const lastName = rest.join(" ") || null;

  return Response.json({
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: firstName || null,
    lastName: lastName || null,
    headline: user.headline,
    bio: user.bio,
    location: user.location,
    industry: user.industry,
    profilePhotoUrl: user.image,
    openTo: user.openTo ?? [],
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
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
  const updates: Record<string, unknown> = {};

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
  if (body.bio !== undefined) updates.bio = typeof body.bio === "string" ? body.bio : String(body.bio ?? "");
  if (body.headline !== undefined) updates.headline = typeof body.headline === "string" ? body.headline : null;
  if (body.location !== undefined) updates.location = typeof body.location === "string" ? body.location : null;
  if (body.industry !== undefined) updates.industry = typeof body.industry === "string" ? body.industry : null;
  if (body.profilePhotoUrl !== undefined) updates.image = body.profilePhotoUrl;
  if (body.openTo !== undefined) updates.openTo = Array.isArray(body.openTo) ? body.openTo : [];
  if (body.firstName !== undefined || body.lastName !== undefined) {
    const fn = body.firstName ?? "";
    const ln = body.lastName ?? "";
    updates.name = [fn, ln].filter(Boolean).join(" ").trim() || null;
  }

  const user = await prisma.user.update({
    where: { id },
    data: updates,
  });

  return Response.json({
    id: user.id,
    email: user.email,
    username: user.username,
    headline: user.headline,
    bio: user.bio,
    location: user.location,
    industry: user.industry,
    profilePhotoUrl: user.image,
    openTo: user.openTo ?? [],
    updatedAt: user.updatedAt.toISOString(),
  });
}
