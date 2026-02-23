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
  { params }: { params: Promise<{ eventId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { eventId } = await params;

  const event = await prisma.platformEvent.findUnique({ where: { id: eventId } });
  if (!event) return notFound("Event not found");
  if (event.organizerId !== authResult.user.id) {
    return forbidden("Only the organizer can add judges");
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

  const user = await prisma.user.findUnique({
    where: { id: parsed.data.user_id },
  });
  if (!user) return notFound("User not found");

  await prisma.platformEventJudge.upsert({
    where: {
      eventId_userId: { eventId, userId: parsed.data.user_id },
    },
    create: { eventId, userId: parsed.data.user_id },
    update: {},
  });

  return Response.json({
    message: "Judge added",
  });
}
