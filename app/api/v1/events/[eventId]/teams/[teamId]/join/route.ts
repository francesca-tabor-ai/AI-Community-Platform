import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, conflict } from "@/lib/api-v1/errors";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; teamId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { eventId, teamId } = await params;

  const team = await prisma.platformEventTeam.findFirst({
    where: { id: teamId, eventId },
  });
  if (!team) return notFound("Team not found");

  const existing = await prisma.platformEventTeamMember.findUnique({
    where: {
      teamId_userId: { teamId, userId: authResult.user.id },
    },
  });
  if (existing) return conflict("Already a member of this team");

  await prisma.platformEventTeamMember.create({
    data: {
      teamId,
      userId: authResult.user.id,
      role: "member",
    },
  });

  return Response.json({
    message: "Joined team",
  });
}
