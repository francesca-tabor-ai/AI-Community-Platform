import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateEmbedding, embeddingToVectorLiteral } from "@/lib/embeddings";

/**
 * GET - Search published articles.
 * Query: q (search term), limit, mode (keyword | semantic)
 * - keyword: ILIKE search on title, body, summary
 * - semantic: vector similarity search (requires embeddings; falls back to keyword if unavailable)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 50);
  const mode = searchParams.get("mode") ?? "keyword";

  if (!q || q.length === 0) {
    return NextResponse.json([]);
  }

  if (mode === "semantic") {
    const queryEmbedding = await generateEmbedding(q);
    if (queryEmbedding) {
      const vectorLiteral = embeddingToVectorLiteral(queryEmbedding);
      const rows = await prisma.$queryRawUnsafe<
        Array<{ id: string }>
      >(
        `SELECT id FROM "Article"
         WHERE status = 'published' AND embedding IS NOT NULL
         ORDER BY embedding <=> $1::vector
         LIMIT $2`,
        vectorLiteral,
        limit
      );
      const ids = rows.map((r) => r.id);
      if (ids.length === 0) return NextResponse.json([]);
      const articles = await prisma.article.findMany({
        where: { id: { in: ids } },
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          body: true,
          updatedAt: true,
          author: {
            select: { id: true, name: true, profile: { select: { displayName: true } } },
          },
          community: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { updatedAt: "desc" },
      });
      const ordered = ids.map((id) => articles.find((a) => a.id === id)).filter(Boolean);
      return NextResponse.json(ordered);
    }
  }

  const articles = await prisma.article.findMany({
    where: {
      status: "published",
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { body: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      body: true,
      updatedAt: true,
      author: {
        select: { id: true, name: true, profile: { select: { displayName: true } } },
      },
      community: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });

  return NextResponse.json(articles);
}
