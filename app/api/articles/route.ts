import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getArticleUserId } from "@/lib/article-auth";
import { slugify } from "@/lib/slug";

/**
 * GET - List articles.
 * Query: status (draft | published | all), limit, communityId
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "published";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
  const communityId = searchParams.get("communityId") ?? undefined;

  const where: {
    status?: "draft" | "published";
    communityId?: string | null;
  } = {};
  if (status !== "all") {
    where.status = status as "draft" | "published";
  }
  if (communityId) {
    where.communityId = communityId;
  }

  const articles = await prisma.article.findMany({
    where,
    include: {
      author: {
        select: { id: true, name: true, email: true, profile: { select: { displayName: true } } },
      },
      community: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });

  return NextResponse.json(articles);
}

/**
 * POST - Create a new article (draft).
 * Body: { title: string, body: string, slug?: string, communityId?: string }
 */
export async function POST(req: Request) {
  const userId = await getArticleUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { title: string; body: string; slug?: string; communityId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, body: content, slug: customSlug, communityId } = body;
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const baseSlug = customSlug?.trim() || slugify(title);
  let slug = baseSlug;
  let suffix = 0;
  while (true) {
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (!existing) break;
    suffix += 1;
    slug = `${baseSlug}_${suffix}`;
  }

  const article = await prisma.article.create({
    data: {
      slug,
      title: title.trim(),
      body: content ?? "",
      authorId: userId,
      communityId: communityId || null,
      status: "draft",
    },
    include: {
      author: {
        select: { id: true, name: true, profile: { select: { displayName: true } } },
      },
      community: { select: { id: true, name: true, slug: true } },
    },
  });

  await prisma.articleRevision.create({
    data: {
      articleId: article.id,
      body: article.body,
      authorId: userId,
      changeSummary: "Initial revision",
    },
  });

  return NextResponse.json(article);
}
