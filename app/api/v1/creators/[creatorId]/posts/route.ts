import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { badRequest } from "@/lib/api-v1/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ creatorId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { creatorId } = await params;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  if (isNaN(limit) || limit < 1) {
    return badRequest("limit must be a positive number");
  }
  if (isNaN(offset) || offset < 0) {
    return badRequest("offset must be a non-negative number");
  }

  const where: { creatorId: string; status?: "draft" | "published" } = {
    creatorId,
  };
  if (status === "draft" || status === "published") {
    where.status = status;
  }

  const posts = await prisma.creatorPost.findMany({
    where,
    select: {
      id: true,
      title: true,
      status: true,
      publishedAt: true,
    },
    orderBy: [{ status: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
    skip: offset,
  });

  return Response.json(
    posts.map((p) => ({
      id: p.id,
      title: p.title,
      status: p.status,
      published_at: p.publishedAt?.toISOString() ?? null,
    }))
  );
}
