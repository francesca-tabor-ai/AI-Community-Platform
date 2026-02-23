import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getArticleUserId } from "@/lib/article-auth";
import { canAdminCommunity } from "@/lib/community-auth";
import { generateEmbedding, embeddingToVectorLiteral } from "@/lib/embeddings";

/**
 * GET - Fetch a single article by slug.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: { id: true, name: true, profile: { select: { displayName: true } } },
      },
      community: { select: { id: true, name: true, slug: true } },
      citations: { take: 20 },
    },
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

  return NextResponse.json(article);
}

/**
 * PATCH - Update an article. Creates a new revision on body change.
 * Body: { title?: string, body?: string, status?: "draft" | "published", changeSummary?: string }
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const userId = await getArticleUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { community: { select: { id: true } } },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const isAuthor = article.authorId === userId;
  const isCommunityAdmin = article.communityId
    ? await canAdminCommunity(userId, article.communityId)
    : false;
  if (!isAuthor && !isCommunityAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    title?: string;
    body?: string;
    status?: "draft" | "published";
    changeSummary?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updateData: {
    title?: string;
    body?: string;
    status?: "draft" | "published";
  } = {};
  if (body.title !== undefined) updateData.title = body.title.trim();
  if (body.body !== undefined) updateData.body = body.body;
  if (body.status !== undefined) updateData.status = body.status;

  if (body.body !== undefined && body.body !== article.body) {
    await prisma.articleRevision.create({
      data: {
        articleId: article.id,
        body: body.body,
        authorId: userId,
        changeSummary: body.changeSummary ?? "Edited content",
      },
    });
  }

  const updated = await prisma.article.update({
    where: { id: article.id },
    data: updateData,
    include: {
      author: {
        select: { id: true, name: true, profile: { select: { displayName: true } } },
      },
      community: { select: { id: true, name: true, slug: true } },
    },
  });

  const needsEmbedding =
    body.title !== undefined || body.body !== undefined;
  if (needsEmbedding) {
    const text = [updated.title, updated.summary ?? "", updated.body].join("\n\n");
    const embedding = await generateEmbedding(text);
    if (embedding) {
      const vectorLiteral = embeddingToVectorLiteral(embedding);
      await prisma.$executeRawUnsafe(
        `UPDATE "Article" SET embedding = $1::vector, "updatedAt" = NOW() WHERE id = $2`,
        vectorLiteral,
        updated.id
      );
    }
  }

  return NextResponse.json(updated);
}

/**
 * DELETE - Delete an article (admin/author only).
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const userId = await getArticleUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { community: { select: { id: true } } },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const isAuthor = article.authorId === userId;
  const isCommunityAdmin = article.communityId
    ? await canAdminCommunity(userId, article.communityId)
    : false;
  if (!isAuthor && !isCommunityAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.article.delete({ where: { id: article.id } });
  return NextResponse.json({ ok: true });
}
