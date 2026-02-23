import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden } from "@/lib/api-v1/errors";

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
    return forbidden("Only the organizer can publish this event");
  }

  await prisma.platformEvent.update({
    where: { id: eventId },
    data: { status: "published" },
  });

  return Response.json({
    event_id: eventId,
    message: "Event published",
  });
}
