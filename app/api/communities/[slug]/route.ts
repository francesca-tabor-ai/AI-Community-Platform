import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/auth-helpers";

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  visibility: z.enum(["public", "private"]).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const community = await prisma.community.findUnique({
    where: { slug },
    include: {
      spaces: { select: { id: true, name: true, slug: true, type: true } },
      _count: { select: { members: true, posts: true } },
      owner: { select: { id: true, name: true, image: true } },
    },
  });

  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  const session = await auth();

  if (community.visibility === "private") {
    if (!session?.user?.id) {
      return NextResponse.json({ error: "This community is private. Please log in." }, { status: 401 });
    }
    const member = await prisma.member.findUnique({
      where: {
        userId_communityId: { userId: session.user.id, communityId: community.id },
      },
    });
    if (!member) {
      return NextResponse.json({ error: "This community is private. An invite is required." }, { status: 403 });
    }
  }

  let isMember = false;
  let isOwner = false;
  if (session?.user?.id) {
    const m = await prisma.member.findUnique({
      where: {
        userId_communityId: { userId: session.user.id, communityId: community.id },
      },
    });
    isMember = !!m;
    isOwner = community.ownerId === session.user.id;
  }

  return NextResponse.json({
    ...community,
    isMember,
    isOwner,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const community = await prisma.community.findUnique({
    where: { slug },
  });
  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  const memberCheck = await requireMember(community.id, "owner");
  if (memberCheck instanceof NextResponse) return memberCheck;

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.community.update({
      where: { id: community.id },
      data: {
        ...(parsed.data.name != null && { name: parsed.data.name }),
        ...(parsed.data.description != null && { description: parsed.data.description }),
        ...(parsed.data.imageUrl != null && { imageUrl: parsed.data.imageUrl || null }),
        ...(parsed.data.visibility != null && { visibility: parsed.data.visibility as "public" | "private" }),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update community" },
      { status: 500 }
    );
  }
}
