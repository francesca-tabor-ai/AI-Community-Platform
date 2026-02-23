import OpenAI from "openai";

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;

/**
 * Generate an embedding vector for the given text using OpenAI.
 * Returns null if OPENAI_API_KEY is not configured.
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const openai = new OpenAI({ apiKey });
  const input = text.slice(0, 8000); // Keep under token limit

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input,
      dimensions: EMBEDDING_DIMENSIONS,
    });
    const embedding = response.data[0]?.embedding;
    return Array.isArray(embedding) ? embedding : null;
  } catch (err) {
    console.error("[embeddings] Failed to generate embedding:", err);
    return null;
  }
}

/**
 * Format an embedding array as a pgvector literal string.
 */
export function embeddingToVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}
