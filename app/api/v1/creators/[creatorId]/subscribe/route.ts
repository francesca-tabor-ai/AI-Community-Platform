import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, conflict } from "@/lib/api-v1/errors";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ creatorId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { creatorId } = await params;

  const creator = await prisma.user.findUnique({
    where: { id: creatorId, role: "creator" },
  });
  if (!creator) return notFound("Creator not found");

  if (creatorId === authResult.user.id) {
    return Response.json(
      { detail: "You cannot subscribe to yourself", code: "CONFLICT" },
      { status: 409 }
    );
  }

  const existing = await prisma.creatorSubscription.findUnique({
    where: {
      subscriberId_creatorId: {
        subscriberId: authResult.user.id,
        creatorId,
      },
    },
  });

  if (existing) {
    if (existing.status === "active") {
      return conflict("Already subscribed");
    }
    await prisma.creatorSubscription.update({
      where: { id: existing.id },
      data: { status: "active", cancelledAt: null },
    });
  } else {
    await prisma.creatorSubscription.create({
      data: {
        subscriberId: authResult.user.id,
        creatorId,
        status: "active",
      },
    });
  }

  const sub = await prisma.creatorSubscription.findUnique({
    where: {
      subscriberId_creatorId: {
        subscriberId: authResult.user.id,
        creatorId,
      },
    },
  });

  return Response.json({
    id: sub!.id,
    subscriber_id: sub!.subscriberId,
    creator_id: sub!.creatorId,
    status: sub!.status,
  });
}
