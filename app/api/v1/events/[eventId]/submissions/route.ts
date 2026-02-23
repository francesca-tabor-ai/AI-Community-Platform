import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, badRequest } from "@/lib/api-v1/errors";

const schema = z.object({
  team_id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  submission_url: z.string().url().optional(),
  files: z.array(z.string().url()).optional(),
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

  const { team_id, title, description, submission_url, files } = parsed.data;

  let teamId: string | null = null;
  if (team_id) {
    const team = await prisma.platformEventTeam.findFirst({
      where: { id: team_id, eventId },
    });
    if (!team) return notFound("Team not found");
    teamId = team.id;
  }

  const submission = await prisma.platformEventSubmission.create({
    data: {
      eventId,
      teamId,
      submitterId: authResult.user.id,
      title,
      description: description ?? null,
      submissionUrl: submission_url ?? null,
      files: files ?? [],
      status: "submitted",
    },
  });

  return Response.json(
    {
      submission_id: submission.id,
      message: "Submission successful",
    },
    { status: 201 }
  );
}
