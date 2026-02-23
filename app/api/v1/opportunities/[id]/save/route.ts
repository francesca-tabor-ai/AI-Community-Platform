import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound } from "@/lib/api-v1/errors";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  const opp = await prisma.vibeNetOpportunity.findUnique({ where: { id } });
  if (!opp) return notFound("Opportunity not found");

  await prisma.vibeNetSavedOpportunity.upsert({
    where: {
      userId_opportunityId: { userId: authResult.user.id, opportunityId: id },
    },
    create: { userId: authResult.user.id, opportunityId: id },
    update: {},
  });

  return Response.json({ message: "Opportunity saved" }, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  await prisma.vibeNetSavedOpportunity.deleteMany({
    where: {
      userId: authResult.user.id,
      opportunityId: id,
    },
  });

  return new Response(null, { status: 204 });
}
