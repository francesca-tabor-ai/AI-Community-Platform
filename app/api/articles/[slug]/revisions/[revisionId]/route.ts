import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getArticleUserId } from "@/lib/article-auth";
import { canAdminCommunity } from "@/lib/community-auth";
import { generateEmbedding, embeddingToVectorLiteral } from "@/lib/embeddings";

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

/**
 * POST - Approve a pending revision. Moderator/owner only.
 * Applies the revision body to the article and updates the embedding.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string; revisionId: string }> }
) {
  const { slug, revisionId } = await params;
  const userId = await getArticleUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      community: { select: { id: true, articleApprovalRequired: true } },
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const isCommunityAdmin = article.communityId
    ? await canAdminCommunity(userId, article.communityId)
    : false;
  if (!isCommunityAdmin) {
    return NextResponse.json({ error: "Forbidden: moderator or owner required" }, { status: 403 });
  }

  const revision = await prisma.articleRevision.findFirst({
    where: { id: revisionId, articleId: article.id },
  });

  if (!revision) {
    return NextResponse.json({ error: "Revision not found" }, { status: 404 });
  }
  if (revision.approvedAt) {
    return NextResponse.json({ error: "Revision already approved" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.articleRevision.update({
      where: { id: revisionId },
      data: { approvedAt: new Date(), approvedById: userId },
    }),
    prisma.article.update({
      where: { id: article.id },
      data: { body: revision.body, updatedAt: new Date() },
    }),
  ]);

  const updatedArticle = await prisma.article.findUnique({
    where: { id: article.id },
  });
  if (updatedArticle) {
    const text = [updatedArticle.title, updatedArticle.summary ?? "", updatedArticle.body].join("\n\n");
    const embedding = await generateEmbedding(text);
    if (embedding) {
      const vectorLiteral = embeddingToVectorLiteral(embedding);
      await prisma.$executeRawUnsafe(
        `UPDATE "Article" SET embedding = $1::vector, "updatedAt" = NOW() WHERE id = $2`,
        vectorLiteral,
        updatedArticle.id
      );
    }
  }

  return NextResponse.json({ ok: true });
}
