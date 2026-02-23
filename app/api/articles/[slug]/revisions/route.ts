import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getArticleUserId } from "@/lib/article-auth";
import { canAdminCommunity } from "@/lib/community-auth";

/**
 * GET - List revisions for an article.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    select: { id: true, authorId: true, communityId: true, status: true },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const userId = await getArticleUserId();
  if (article.status === "draft") {
    const isAuthor = userId === article.authorId;
    const isCommunityAdmin =
      article.communityId && userId
        ? await canAdminCommunity(userId, article.communityId)
        : false;
    if (!isAuthor && !isCommunityAdmin) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);

  const revisions = await prisma.articleRevision.findMany({
    where: { articleId: article.id },
    include: {
      author: {
        select: { id: true, name: true, profile: { select: { displayName: true } } },
      },
      approver: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(revisions);
}
