import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

  const matches = await prisma.vibeNetMatch.findMany({
    where: { userId: authResult.user.id, dismissed: false },
    orderBy: { score: "desc" },
    take: limit,
    include: {
      matchedUser: {
        select: {
          id: true,
          name: true,
          username: true,
          headline: true,
          image: true,
          location: true,
          industry: true,
        },
      },
    },
  });

  return Response.json({
    matches: matches.map((m) => ({
      id: m.id,
      userId: m.matchedUserId,
      score: m.score,
      reason: m.reason,
      computedAt: m.computedAt.toISOString(),
      user: m.matchedUser,
    })),
  });
}
