import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, badRequest } from "@/lib/api-v1/errors";
import { trackEvent } from "@/lib/analytics/track";
import type { RsvpConfirmedEvent } from "@/lib/analytics/events";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { eventId } = await params;

  const body = await req.json().catch(() => ({}));
  const status = body.status === "interested" ? "interested" : "attending";

  const event = await prisma.platformEvent.findUnique({
    where: { id: eventId },
  });

  if (!event) return notFound("Event not found");

  if (event.capacity) {
    const rsvpCount = await prisma.platformEventRsvp.count({
      where: { eventId, status: "attending" },
    });
    if (status === "attending" && rsvpCount >= event.capacity) {
      return badRequest("Event is at capacity");
    }
  }

  const rsvp = await prisma.platformEventRsvp.upsert({
    where: {
      userId_eventId: {
        userId: authResult.user.id,
        eventId,
      },
    },
    create: {
      userId: authResult.user.id,
      eventId,
      status: status as "attending" | "interested",
    },
    update: { status: status as "attending" | "interested" },
  });

  trackEvent({
    event_id: crypto.randomUUID(),
    event_name: "rsvp_confirmed",
    timestamp: new Date().toISOString(),
    user_id: authResult.user.id,
    community_event_id: eventId,
    rsvp_status: status as "attending" | "interested",
  } as RsvpConfirmedEvent);

  return Response.json({
    rsvp_id: rsvp.id,
    user_id: rsvp.userId,
    event_id: rsvp.eventId,
    status: rsvp.status,
  });
}
