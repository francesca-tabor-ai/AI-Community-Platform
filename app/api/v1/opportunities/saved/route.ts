import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const saved = await prisma.vibeNetSavedOpportunity.findMany({
    where: { userId: authResult.user.id },
    include: { opportunity: true },
    orderBy: { savedAt: "desc" },
    take: limit,
    skip: offset,
  });

  return Response.json({
    opportunities: saved.map((s) => ({
      ...s.opportunity,
      savedAt: s.savedAt.toISOString(),
    })),
  });
}
