import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound } from "@/lib/api-v1/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ communityId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { communityId } = await params;

  const community = await prisma.community.findUnique({
    where: { id: communityId },
    select: {
      id: true,
      name: true,
      description: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!community) return notFound("Community not found");

  return Response.json({
    community_id: community.id,
    name: community.name,
    description: community.description,
    creator_id: community.ownerId,
    created_at: community.createdAt.toISOString(),
    updated_at: community.updatedAt.toISOString(),
  });
}
