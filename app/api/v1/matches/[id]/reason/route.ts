import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden } from "@/lib/api-v1/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  const match = await prisma.vibeNetMatch.findUnique({
    where: { id },
    include: { matchedUser: { select: { id: true, name: true, headline: true } } },
  });
  if (!match) return notFound("Match not found");
  if (match.userId !== authResult.user.id) return forbidden("Not your match");

  return Response.json({
    matchId: match.id,
    userId: match.matchedUserId,
    reason: match.reason ?? "No explanation available",
    user: match.matchedUser,
  });
}
