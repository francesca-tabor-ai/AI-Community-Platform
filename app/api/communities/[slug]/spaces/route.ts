import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/auth-helpers";
import { slugify } from "@/lib/slugify";

const createSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(500).optional(),
  type: z.enum(["general", "announcements", "questions"]).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const community = await prisma.community.findUnique({
    where: { slug: (await params).slug },
  });

  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  const spaces = await prisma.space.findMany({
    where: { communityId: community.id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      type: true,
      _count: { select: { posts: true } },
    },
    orderBy: { slug: "asc" },
  });

  return NextResponse.json(spaces);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const community = await prisma.community.findUnique({
    where: { slug: (await params).slug },
  });

  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  const memberResult = await requireMember(community.id, "moderator");
  if (memberResult instanceof NextResponse) return memberResult;

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description, type } = parsed.data;
    let slug = parsed.data.slug ?? slugify(name);
    let attempts = 0;
    while (
      await prisma.space.findUnique({
        where: { communityId_slug: { communityId: community.id, slug } },
      })
    ) {
      slug = `${slugify(name)}-${++attempts}`;
    }

    const space = await prisma.space.create({
      data: {
        communityId: community.id,
        name,
        slug,
        description: description ?? null,
        type: (type as "general" | "announcements" | "questions") ?? "general",
      },
    });

    return NextResponse.json(space, { status: 201 });
  } catch (err) {
    console.error("Create space error:", err);
    return NextResponse.json(
      { error: "Failed to create space" },
      { status: 500 }
    );
  }
}
