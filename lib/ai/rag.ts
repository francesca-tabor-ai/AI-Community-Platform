import { prisma } from "@/lib/prisma";
import { generateEmbedding, embeddingToVectorLiteral } from "@/lib/embeddings";

export type SearchResult = {
  id: string;
  title: string;
  body: string;
  spaceName?: string;
};

/**
 * Search posts by semantic similarity (RAG) or keyword fallback.
 * If communityId is provided, scope to that community's posts only.
 */
export async function searchPosts(
  query: string,
  options: { limit?: number; communityId?: string } = {}
): Promise<SearchResult[]> {
  const { limit = 5, communityId } = options;
  const q = query.trim();
  if (!q || q.length < 2) return [];

  const whereBase = {
    status: "published" as const,
    ...(communityId && { communityId }),
  };

  // Try semantic search first
  const queryEmbedding = await generateEmbedding(q);
  if (queryEmbedding) {
    const vectorLiteral = embeddingToVectorLiteral(queryEmbedding);
    try {
      const rows = communityId
        ? await prisma.$queryRawUnsafe<
            Array<{ id: string; title: string; body: string; "Space_name": string | null }>
          >(
            `SELECT p.id, p.title, p.body, s.name as "Space_name"
             FROM "Post" p
             LEFT JOIN "Space" s ON p."spaceId" = s.id
             WHERE p.status = 'published' AND p.embedding IS NOT NULL AND p."communityId" = $3
             ORDER BY p.embedding <=> $1::vector
             LIMIT $2`,
            vectorLiteral,
            limit,
            communityId
          )
        : await prisma.$queryRawUnsafe<
            Array<{ id: string; title: string; body: string; "Space_name": string | null }>
          >(
            `SELECT p.id, p.title, p.body, s.name as "Space_name"
             FROM "Post" p
             LEFT JOIN "Space" s ON p."spaceId" = s.id
             WHERE p.status = 'published' AND p.embedding IS NOT NULL
             ORDER BY p.embedding <=> $1::vector
             LIMIT $2`,
            vectorLiteral,
            limit
          );
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        body: r.body,
        spaceName: r.Space_name ?? undefined,
      }));
    } catch (err) {
      console.error("[rag] Semantic search failed:", err);
      // Fall through to keyword search
    }
  }

  // Keyword fallback
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  if (words.length === 0) return [];

  const posts = await prisma.post.findMany({
    where: {
      ...whereBase,
      OR: words.flatMap((word) => [
        { title: { contains: word, mode: "insensitive" as const } },
        { body: { contains: word, mode: "insensitive" as const } },
      ]),
    },
    select: {
      id: true,
      title: true,
      body: true,
      space: { select: { name: true } },
    },
    take: limit,
    orderBy: { updatedAt: "desc" },
  });

  return posts.map((p) => ({
    id: p.id,
    title: p.title,
    body: p.body,
    spaceName: p.space?.name,
  }));
}
