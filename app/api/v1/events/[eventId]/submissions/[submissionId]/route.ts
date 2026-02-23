import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound } from "@/lib/api-v1/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; submissionId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { eventId, submissionId } = await params;

  const submission = await prisma.platformEventSubmission.findFirst({
    where: { id: submissionId, eventId },
    include: {
      submitter: { select: { id: true, username: true, name: true } },
      team: { select: { id: true, name: true } },
    },
  });

  if (!submission) return notFound("Submission not found");

  const judgingScores = (submission.judgingScores as Record<string, unknown>) ?? {};

  return Response.json({
    submission_id: submission.id,
    event_id: submission.eventId,
    team_id: submission.teamId,
    submitter_id: submission.submitterId,
    title: submission.title,
    description: submission.description,
    submission_url: submission.submissionUrl,
    files: submission.files,
    status: submission.status,
    judging_scores: judgingScores,
    created_at: submission.createdAt.toISOString(),
    updated_at: submission.updatedAt.toISOString(),
  });
}
