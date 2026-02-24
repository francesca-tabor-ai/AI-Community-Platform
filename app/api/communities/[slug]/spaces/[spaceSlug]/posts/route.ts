import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; spaceSlug: string }> }
) {
  const { slug, spaceSlug } = await params;

  const community = await prisma.community.findUnique({
    where: { slug },
  });

  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  const session = await auth();
  if (community.visibility === "private") {
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const member = await prisma.member.findUnique({
      where: {
        userId_communityId: { userId: session.user.id, communityId: community.id },
      },
    });
    if (!member) {
      return NextResponse.json({ error: "Membership required" }, { status: 403 });
    }
  }

  const space = await prisma.space.findUnique({
    where: {
      communityId_slug: { communityId: community.id, slug: spaceSlug },
    },
  });

  if (!space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

  const posts = await prisma.post.findMany({
    where: {
      spaceId: space.id,
      status: "published",
    },
    select: {
      id: true,
      title: true,
      body: true,
      status: true,
      createdAt: true,
      author: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ posts, space: { name: space.name, description: space.description } });
}
