import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getCommunityDashboardUserId,
  canAdminCommunity,
} from "@/lib/community-auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const userId = await getCommunityDashboardUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const community = await prisma.community.findUnique({
    where: { slug },
    select: { id: true, name: true },
  });

  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  const canAdmin = await canAdminCommunity(userId, community.id);
  if (!canAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [memberCount, spaceCount, postCount, eventCount] = await Promise.all([
    prisma.member.count({ where: { communityId: community.id } }),
    prisma.space.count({ where: { communityId: community.id } }),
    prisma.post.count({
      where: { communityId: community.id, status: "published" },
    }),
    prisma.event.count({ where: { communityId: community.id } }),
  ]);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const newMembersThisWeek = await prisma.member.count({
    where: { communityId: community.id, joinedAt: { gte: weekAgo } },
  });

  return NextResponse.json({
    community: { id: community.id, name: community.name, slug },
    memberCount,
    spaceCount,
    postCount,
    eventCount,
    newMembersThisWeek,
  });
}
