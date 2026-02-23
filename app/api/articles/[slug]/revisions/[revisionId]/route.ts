import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getArticleUserId } from "@/lib/article-auth";
import { canAdminCommunity } from "@/lib/community-auth";

/**
 * GET - Fetch a single revision by id.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string; revisionId: string }> }
) {
  const { slug, revisionId } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    select: { id: true, authorId: true, communityId: true, status: true },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const revision = await prisma.articleRevision.findFirst({
    where: { id: revisionId, articleId: article.id },
    include: {
      author: {
        select: { id: true, name: true, profile: { select: { displayName: true } } },
      },
      approver: {
        select: { id: true, name: true },
      },
    },
  });

  if (!revision) {
    return NextResponse.json({ error: "Revision not found" }, { status: 404 });
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

  return NextResponse.json(revision);
}
