import { NextRequest } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { badRequest } from "@/lib/api-v1/errors";
import { trackEvent } from "@/lib/analytics/track";
import type { EventCreatedEvent } from "@/lib/analytics/events";

const createEventSchema = z
  .object({
  name: z.string().max(255).optional(),
  title: z.string().max(255).optional(),
  description: z.string().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  location: z.string().max(255).optional(),
  ticket_price: z.number().min(0).optional(),
  capacity: z.number().int().min(1).optional(),
  rules: z.record(z.unknown()).optional(),
  settings: z.record(z.unknown()).optional(),
})
  .refine((d) => (d.name?.trim() ?? "").length > 0 || (d.title?.trim() ?? "").length > 0, {
    message: "name or title is required",
    path: ["name"],
  });

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  try {
    const body = await req.json();
    const parsed = createEventSchema.safeParse(body);

    if (!parsed.success) {
      const field_errors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const path = e.path[0]?.toString();
        if (path) field_errors[path] = e.message;
      });
      return badRequest("Validation failed", field_errors);
    }

    const d = parsed.data;
    const title = d.name ?? d.title ?? "";
    const startTime = d.start_date || d.start_time
      ? new Date(d.start_date ?? d.start_time!)
      : new Date();
    const endTime = d.end_date || d.end_time
      ? new Date(d.end_date ?? d.end_time!)
      : new Date(Date.now() + 86400000);

    const event = await prisma.platformEvent.create({
      data: {
        organizerId: authResult.user.id,
        title,
        description: d.description ?? null,
        startTime,
        endTime,
        location: d.location ?? null,
        ticketPrice: d.ticket_price != null ? new Prisma.Decimal(d.ticket_price) : null,
        capacity: d.capacity ?? null,
        rules: (d.rules ?? {}) as object,
        settings: (d.settings ?? {}) as object,
        status: "draft",
      },
    });

    trackEvent({
      event_id: crypto.randomUUID(),
      event_name: "event_created",
      timestamp: new Date().toISOString(),
      user_id: authResult.user.id,
      organizer_id: authResult.user.id,
      community_event_id: event.id,
      is_paid: (d.ticket_price ?? 0) > 0,
    } as EventCreatedEvent);

    return Response.json(
      {
        event_id: event.id,
        message: "Event created",
      },
      { status: 201 }
    );
  } catch {
    const { apiError } = await import("@/lib/api-v1/errors");
    return apiError(500, "Internal server error", { code: "INTERNAL_ERROR" });
  }
}

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Prisma.PlatformEventWhereInput = {};
  if (from) where.startTime = { gte: new Date(from) };
  if (to) where.endTime = { lte: new Date(to) };

  const events = await prisma.platformEvent.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    include: { organizer: { select: { id: true, username: true, name: true } } },
    orderBy: { startTime: "asc" },
    take: limit,
    skip: offset,
  });

  return Response.json(
    events.map((e) => ({
      event_id: e.id,
      organizer_id: e.organizerId,
      title: e.title,
      description: e.description,
      start_time: e.startTime.toISOString(),
      end_time: e.endTime.toISOString(),
      location: e.location,
      ticket_price: e.ticketPrice?.toNumber() ?? null,
      capacity: e.capacity,
      created_at: e.createdAt.toISOString(),
      updated_at: e.updatedAt.toISOString(),
    }))
  );
}
