/**
 * Server-side event tracking.
 * Use for events that occur on the server (e.g. post_published, payment_succeeded).
 */

import { prisma } from "@/lib/prisma";
import type { AnalyticsEvent } from "./events";

function makeSessionId(): string {
  return `srv-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function trackEvent(
  event: Omit<AnalyticsEvent, "session_id" | "platform" | "device_type" | "browser" | "os"> & {
    session_id?: string;
    platform?: string;
    device_type?: string;
    browser?: string;
    os?: string;
  }
): Promise<void> {
  const session_id = event.session_id ?? makeSessionId();
  const platform = event.platform ?? "web";
  const device_type = event.device_type ?? "desktop";
  const browser = event.browser ?? "server";
  const os = event.os ?? "server";
  const payload = {
    ...event,
    session_id,
    platform,
    device_type,
    browser,
    os,
  } as unknown as Record<string, unknown>;

  try {
    await prisma.analyticsEvent.create({
      data: {
        eventId: event.event_id,
        eventName: event.event_name,
        timestamp: new Date(event.timestamp),
        userId: event.user_id ?? null,
        sessionId: session_id,
        payload,
      },
    });
  } catch (err) {
    console.error("[analytics] Failed to persist event:", event.event_name, err);
    // Non-fatal: analytics should not break the main flow
  }
}
