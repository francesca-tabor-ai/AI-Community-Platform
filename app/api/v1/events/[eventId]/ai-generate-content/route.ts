import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden, badRequest } from "@/lib/api-v1/errors";

const schema = z.object({
  content_type: z.string().min(1),
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
    return forbidden("Only the organizer can trigger AI content generation");
  }

  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    // Empty body ok
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const field_errors: Record<string, string> = {};
    parsed.error.errors.forEach((e) => {
      const path = e.path[0]?.toString();
      if (path) field_errors[path] = e.message;
    });
    return badRequest("Validation failed", field_errors);
  }

  const taskId = crypto.randomUUID();
  const insight = await prisma.aIInsight.create({
    data: {
      entityType: "event",
      entityId: eventId,
      insightType: "event_content_gen",
      data: {
        status: "queued",
        taskId,
        contentType: parsed.data.content_type,
        requestedAt: new Date().toISOString(),
      },
      generatedByUserId: authResult.user.id,
    },
  });

  // In production: enqueue to message queue for background worker to process
  // Worker would call AI service, update insight.data with result, set status "completed"

  return Response.json({
    task_id: taskId,
    message: "AI generation initiated",
  });
}
