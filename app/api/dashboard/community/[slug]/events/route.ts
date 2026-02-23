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
    select: { id: true },
  });

  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  const canAdmin = await canAdminCommunity(userId, community.id);
  if (!canAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const events = await prisma.event.findMany({
    where: { communityId: community.id },
    include: {
      _count: { select: { rsvps: true } },
    },
    orderBy: { startAt: "asc" },
  });

  return NextResponse.json(events);
}
