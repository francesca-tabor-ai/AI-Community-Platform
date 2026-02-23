/**
 * Event Collector API
 * Receives client-side analytics events and persists them.
 * Validates schema and stores in AnalyticsEvent table.
 */

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { analyticsEventSchema } from "@/lib/analytics/events";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate payload
    const parsed = analyticsEventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid event payload",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const event = parsed.data;
    const payload = event as unknown as Prisma.InputJsonValue;

    await prisma.analyticsEvent.create({
      data: {
        eventId: event.event_id,
        eventName: event.event_name,
        timestamp: new Date(event.timestamp),
        userId: event.user_id ?? null,
        sessionId: event.session_id,
        payload,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[analytics] Event ingest error:", err);
    return NextResponse.json(
      { error: "Failed to ingest event" },
      { status: 500 }
    );
  }
}
