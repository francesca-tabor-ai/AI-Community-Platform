import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound } from "@/lib/api-v1/errors";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ creatorId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { creatorId } = await params;

  const creator = await prisma.user.findUnique({
    where: { id: creatorId },
  });
  if (!creator) return notFound("Creator not found");

  const sub = await prisma.creatorSubscription.findUnique({
    where: {
      subscriberId_creatorId: {
        subscriberId: authResult.user.id,
        creatorId,
      },
    },
  });

  if (!sub) {
    return Response.json({
      id: "",
      subscriber_id: authResult.user.id,
      creator_id: creatorId,
      status: "cancelled",
    });
  }

  await prisma.creatorSubscription.update({
    where: { id: sub.id },
    data: { status: "cancelled", cancelledAt: new Date() },
  });

  return Response.json({
    id: sub.id,
    subscriber_id: sub.subscriberId,
    creator_id: sub.creatorId,
    status: "cancelled",
  });
}
