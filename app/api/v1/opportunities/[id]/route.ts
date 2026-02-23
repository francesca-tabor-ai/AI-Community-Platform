import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound } from "@/lib/api-v1/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  const opp = await prisma.vibeNetOpportunity.findUnique({
    where: { id },
  });
  if (!opp) return notFound("Opportunity not found");

  const saved = await prisma.vibeNetSavedOpportunity.findUnique({
    where: {
      userId_opportunityId: { userId: authResult.user.id, opportunityId: id },
    },
  });

  return Response.json({
    id: opp.id,
    title: opp.title,
    description: opp.description,
    type: opp.type,
    creatorId: opp.creatorId,
    metadata: opp.metadata,
    saved: !!saved,
    createdAt: opp.createdAt.toISOString(),
    updatedAt: opp.updatedAt.toISOString(),
  });
}
