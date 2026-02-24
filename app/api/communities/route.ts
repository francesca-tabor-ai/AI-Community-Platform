import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { slugify } from "@/lib/slugify";

const createSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens").optional(),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  visibility: z.enum(["public", "private"]).optional(),
});

export async function POST(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description, imageUrl, visibility } = parsed.data;
    let slug = parsed.data.slug ?? slugify(name);
    let attempts = 0;
    while (await prisma.community.findUnique({ where: { slug } })) {
      slug = `${slugify(name)}-${++attempts}`;
    }

    const community = await prisma.community.create({
      data: {
        name,
        slug,
        description: description ?? null,
        imageUrl: imageUrl || null,
        visibility: (visibility as "public" | "private") ?? "public",
        ownerId: authResult.user.id,
      },
    });

    await prisma.member.create({
      data: {
        userId: authResult.user.id,
        communityId: community.id,
        role: "owner",
      },
    });

    // Default spaces
    await prisma.space.createMany({
      data: [
        { communityId: community.id, name: "General", slug: "general", type: "general" },
        { communityId: community.id, name: "Announcements", slug: "announcements", type: "announcements" },
      ],
    });

    const spaces = await prisma.space.findMany({
      where: { communityId: community.id },
      select: { id: true, name: true, slug: true, type: true },
    });

    return NextResponse.json({
      id: community.id,
      name: community.name,
      slug: community.slug,
      description: community.description,
      imageUrl: community.imageUrl,
      visibility: community.visibility,
      spaces,
      createdAt: community.createdAt,
    }, { status: 201 });
  } catch (err) {
    console.error("Create community error:", err);
    return NextResponse.json(
      { error: "Failed to create community" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

  const communities = await prisma.community.findMany({
    where: {
      visibility: "public",
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { description: { contains: q, mode: "insensitive" as const } },
        ],
      }),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
      visibility: true,
      _count: { select: { members: true, spaces: true, posts: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const withMembership = await Promise.all(
    communities.map(async (c) => {
      const member = await prisma.member.findUnique({
        where: {
          userId_communityId: { userId: authResult.user.id, communityId: c.id },
        },
      });
      return { ...c, isMember: !!member };
    })
  );

  return NextResponse.json(withMembership);
}
