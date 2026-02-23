import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getArticleUserId } from "@/lib/article-auth";
import { canAdminCommunity } from "@/lib/community-auth";

/**
 * GET - List pending revisions for communities the user moderates.
 */
export async function GET() {
  const userId = await getArticleUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memberships = await prisma.member.findMany({
    where: {
      userId,
      role: { in: ["owner", "moderator"] },
    },
    select: { communityId: true },
  });
  const communityIds = memberships.map((m) => m.communityId);

  if (communityIds.length === 0) {
    return NextResponse.json([]);
  }

  const revisions = await prisma.articleRevision.findMany({
    where: {
      approvedAt: null,
      article: {
        communityId: { in: communityIds },
        status: "published",
      },
    },
    include: {
      article: {
        select: { id: true, slug: true, title: true, community: { select: { name: true, slug: true } } },
      },
      author: {
        select: { id: true, name: true, profile: { select: { displayName: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(revisions);
}
