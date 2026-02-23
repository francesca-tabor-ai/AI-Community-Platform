import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden, badRequest } from "@/lib/api-v1/errors";

const schema = z.object({
  criteria_id: z.string().min(1),
  score: z.number().int().min(0),
  comments: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; submissionId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { eventId, submissionId } = await params;

  const submission = await prisma.platformEventSubmission.findFirst({
    where: { id: submissionId, eventId },
  });
  if (!submission) return notFound("Submission not found");

  const judge = await prisma.platformEventJudge.findUnique({
    where: {
      eventId_userId: { eventId, userId: authResult.user.id },
    },
  });
  if (!judge) {
    return forbidden("Only judges can score submissions");
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

  const { criteria_id, score, comments } = parsed.data;

  const scoreRecord = await prisma.platformEventSubmissionScore.upsert({
    where: {
      submissionId_judgeId_criteriaId: {
        submissionId,
        judgeId: authResult.user.id,
        criteriaId: criteria_id,
      },
    },
    create: {
      submissionId,
      judgeId: authResult.user.id,
      criteriaId: criteria_id,
      score,
      comments: comments ?? null,
    },
    update: { score, comments: comments ?? undefined },
  });

  return Response.json({
    score_id: scoreRecord.id,
    message: "Score recorded",
  });
}
