import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const opportunities = await prisma.vibeNetOpportunity.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  const savedIds = await prisma.vibeNetSavedOpportunity.findMany({
    where: { userId: authResult.user.id },
    select: { opportunityId: true },
  });
  const savedSet = new Set(savedIds.map((s) => s.opportunityId));

  return Response.json({
    opportunities: opportunities.map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description,
      type: o.type,
      metadata: o.metadata,
      saved: savedSet.has(o.id),
      createdAt: o.createdAt.toISOString(),
    })),
  });
}
