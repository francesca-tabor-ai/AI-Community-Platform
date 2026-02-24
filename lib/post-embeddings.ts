import { prisma } from "@/lib/prisma";
import { generateEmbedding, embeddingToVectorLiteral } from "@/lib/embeddings";

/**
 * Generate and store embedding for a published post.
 * Call when creating or updating a post to "published" status.
 */
export async function generatePostEmbedding(postId: string): Promise<void> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { title: true, body: true, status: true },
  });

  if (!post || post.status !== "published") return;

  const text = `${post.title}\n\n${post.body}`.slice(0, 8000);
  const embedding = await generateEmbedding(text);
  if (!embedding) return;

  const vectorLiteral = embeddingToVectorLiteral(embedding);
  await prisma.$executeRawUnsafe(
    `UPDATE "Post" SET embedding = $1::vector, "updatedAt" = NOW() WHERE id = $2`,
    vectorLiteral,
    postId
  );
}
