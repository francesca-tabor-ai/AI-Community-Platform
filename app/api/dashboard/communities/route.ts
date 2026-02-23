import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCommunityDashboardUserId } from "@/lib/community-auth";

export async function GET() {
  const userId = await getCommunityDashboardUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const communities = await prisma.community.findMany({
    where: {
      members: {
        some: {
          userId,
          role: { in: ["owner", "moderator"] },
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
      visibility: true,
      _count: {
        select: { members: true, spaces: true, posts: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(communities);
}
