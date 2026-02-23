import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden } from "@/lib/api-v1/errors";

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

  const event = await prisma.platformEvent.findUnique({
    where: { id: eventId },
  });
  if (!event) return notFound("Event not found");

  const isOrganizer = event.organizerId === authResult.user.id;
  const isJudge = await prisma.platformEventJudge.findUnique({
    where: {
      eventId_userId: { eventId, userId: authResult.user.id },
    },
  });

  if (!isOrganizer && !isJudge) {
    return forbidden("Only organizers or judges can trigger AI evaluation");
  }

  const taskId = crypto.randomUUID();
  await prisma.aIInsight.create({
    data: {
      entityType: "submission",
      entityId: submissionId,
      insightType: "project_eval_summary",
      data: {
        status: "queued",
        taskId,
        requestedAt: new Date().toISOString(),
      },
      generatedByUserId: authResult.user.id,
    },
  });

  return Response.json({
    task_id: taskId,
    message: "AI evaluation initiated",
  });
}
