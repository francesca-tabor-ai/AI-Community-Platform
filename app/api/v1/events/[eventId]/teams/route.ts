import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden, badRequest } from "@/lib/api-v1/errors";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { eventId } = await params;

  const event = await prisma.platformEvent.findUnique({ where: { id: eventId } });
  if (!event) return notFound("Event not found");
  if (event.organizerId !== authResult.user.id) {
    return forbidden("Only the organizer can create teams");
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

  const team = await prisma.platformEventTeam.create({
    data: {
      eventId,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      status: "active",
    },
  });

  await prisma.platformEventTeamMember.create({
    data: {
      teamId: team.id,
      userId: authResult.user.id,
      role: "lead",
    },
  });

  return Response.json(
    {
      team_id: team.id,
      message: "Team created",
    },
    { status: 201 }
  );
}
