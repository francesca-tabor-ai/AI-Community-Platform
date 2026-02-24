import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
  const communityId = searchParams.get("communityId");

  let where: { userId: string } | { userId: { in: string[] } };
  if (communityId) {
    const members = await prisma.member.findMany({
      where: { communityId },
      select: { userId: true },
    });
    const userIds = members.map((m) => m.userId);
    where = { userId: { in: userIds } };
  } else {
    where = { userId: authResult.user.id };
  }

  const activities = await prisma.activity.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profile: { select: { displayName: true, avatarUrl: true } },
        },
      },
    },
  });

  return NextResponse.json({ activities });
}
