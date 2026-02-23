import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { forbidden } from "@/lib/api-v1/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { userId } = await params;

  if (authResult.user.id !== userId) {
    return forbidden("You can only view your own subscriptions");
  }

  const subs = await prisma.creatorSubscription.findMany({
    where: { subscriberId: userId },
    include: { creator: { select: { id: true, username: true } } },
    orderBy: { subscribedAt: "desc" },
  });

  return Response.json(
    subs.map((s) => ({
      id: s.id,
      creator_id: s.creatorId,
      status: s.status,
      subscribed_at: s.subscribedAt.toISOString(),
    }))
  );
}
