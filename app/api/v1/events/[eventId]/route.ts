import { NextRequest } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden, badRequest } from "@/lib/api-v1/errors";

const updateEventSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  location: z.string().max(255).optional(),
  ticket_price: z.number().min(0).optional(),
  capacity: z.number().int().min(1).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { eventId } = await params;

  const event = await prisma.platformEvent.findUnique({
    where: { id: eventId },
  });

  if (!event) return notFound("Event not found");

  return Response.json({
    event_id: event.id,
    organizer_id: event.organizerId,
    title: event.title,
    description: event.description,
    start_time: event.startTime.toISOString(),
    end_time: event.endTime.toISOString(),
    location: event.location,
    ticket_price: event.ticketPrice?.toNumber() ?? null,
    capacity: event.capacity,
    created_at: event.createdAt.toISOString(),
    updated_at: event.updatedAt.toISOString(),
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { eventId } = await params;

  const event = await prisma.platformEvent.findUnique({ where: { id: eventId } });
  if (!event) return notFound("Event not found");
  if (event.organizerId !== authResult.user.id) {
    return forbidden("You can only update events you organize");
  }

  try {
    const body = await req.json();
    const parsed = updateEventSchema.safeParse(body);

    if (!parsed.success) {
      const field_errors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const path = e.path[0]?.toString();
        if (path) field_errors[path] = e.message;
      });
      return badRequest("Validation failed", field_errors);
    }

    const updates: Prisma.PlatformEventUpdateInput = {};
    if (parsed.data.title !== undefined) updates.title = parsed.data.title;
    if (parsed.data.description !== undefined) updates.description = parsed.data.description;
    if (parsed.data.start_time !== undefined) updates.startTime = new Date(parsed.data.start_time);
    if (parsed.data.end_time !== undefined) updates.endTime = new Date(parsed.data.end_time);
    if (parsed.data.location !== undefined) updates.location = parsed.data.location;
    if (parsed.data.ticket_price !== undefined)
      updates.ticketPrice = new Prisma.Decimal(parsed.data.ticket_price);
    if (parsed.data.capacity !== undefined) updates.capacity = parsed.data.capacity;

    const updated = await prisma.platformEvent.update({
      where: { id: eventId },
      data: updates,
    });

    return Response.json({
      event_id: updated.id,
      organizer_id: updated.organizerId,
      title: updated.title,
      description: updated.description,
      start_time: updated.startTime.toISOString(),
      end_time: updated.endTime.toISOString(),
      location: updated.location,
      ticket_price: updated.ticketPrice?.toNumber() ?? null,
      capacity: updated.capacity,
      created_at: updated.createdAt.toISOString(),
      updated_at: updated.updatedAt.toISOString(),
    });
  } catch {
    const { apiError } = await import("@/lib/api-v1/errors");
    return apiError(500, "Internal server error", { code: "INTERNAL_ERROR" });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { eventId } = await params;

  const event = await prisma.platformEvent.findUnique({ where: { id: eventId } });
  if (!event) return notFound("Event not found");
  if (event.organizerId !== authResult.user.id) {
    return forbidden("You can only delete events you organize");
  }

  await prisma.platformEvent.delete({ where: { id: eventId } });
  return new Response(null, { status: 204 });
}
