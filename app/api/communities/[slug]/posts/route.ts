import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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

  const session = await auth();
  if (community.visibility === "private" && session?.user?.id) {
    const member = await prisma.member.findUnique({
      where: {
        userId_communityId: { userId: session.user.id, communityId: community.id },
      },
    });
    if (!member) {
      return NextResponse.json({ error: "Private community" }, { status: 403 });
    }
  } else if (community.visibility === "private") {
    return NextResponse.json({ error: "Private community" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 50);

  const posts = await prisma.post.findMany({
    where: {
      communityId: community.id,
      status: "published",
    },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      space: { select: { slug: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ posts });
}
