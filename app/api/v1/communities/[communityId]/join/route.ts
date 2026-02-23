import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, conflict } from "@/lib/api-v1/errors";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ communityId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { communityId } = await params;

  const community = await prisma.community.findUnique({
    where: { id: communityId },
  });

  if (!community) return notFound("Community not found");

  if (community.visibility === "private") {
    const { forbidden } = await import("@/lib/api-v1/errors");
    return forbidden("Cannot join private community via this endpoint");
  }

  const existing = await prisma.member.findUnique({
    where: {
      userId_communityId: {
        userId: authResult.user.id,
        communityId,
      },
    },
  });

  if (existing) return conflict("Already a member");

  await prisma.member.create({
    data: {
      userId: authResult.user.id,
      communityId,
      role: "member",
    },
  });

  return Response.json({
    community_id: communityId,
    user_id: authResult.user.id,
    status: "joined",
  });
}
