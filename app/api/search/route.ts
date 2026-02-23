import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET - Keyword search over published articles.
 * Query: q (search term), limit
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 50);

  if (!q || q.length === 0) {
    return NextResponse.json([]);
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
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });

  return NextResponse.json(articles);
}
