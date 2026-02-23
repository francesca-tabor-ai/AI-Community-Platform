import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden, badRequest } from "@/lib/api-v1/errors";

const schema = z.object({
  user_id: z.string().min(1),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; teamId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { eventId, teamId } = await params;

  const team = await prisma.platformEventTeam.findFirst({
    where: { id: teamId, eventId },
    include: { members: true },
  });
  if (!team) return notFound("Team not found");

  const isMember = team.members.some((m) => m.userId === authResult.user.id);
  if (!isMember) {
    return forbidden("Only team members can send invitations");
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const field_errors: Record<string, string> = {};
    parsed.error.errors.forEach((e) => {
      const path = e.path[0]?.toString();
      if (path) field_errors[path] = e.message;
    });
    return badRequest("Validation failed", field_errors);
  }

  const inviteeId = parsed.data.user_id;
  const invitee = await prisma.user.findUnique({
    where: { id: inviteeId },
  });
  if (!invitee) return notFound("User not found");

  const alreadyMember = await prisma.platformEventTeamMember.findUnique({
    where: {
      teamId_userId: { teamId, userId: inviteeId },
    },
  });
  if (alreadyMember) return conflict("User is already a team member");

  // For MVP: directly add user to team as "invited" flow.
  // In production: create TeamInvitation table, send notification, user accepts.
  await prisma.platformEventTeamMember.create({
    data: {
      teamId,
      userId: inviteeId,
      role: "member",
    },
  });

  return Response.json({
    message: "Invitation sent",
  });
}
