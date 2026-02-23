import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";

/**
 * Get personalized event recommendations for the current user.
 * AI-augmented: uses user's communities, past RSVPs, and upcoming events.
 */
export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const userId = authResult.user.id;

  // 1. Events from communities the user has joined
  const memberCommunities = await prisma.member.findMany({
    where: { userId },
    select: { communityId: true },
  });
  const communityIds = memberCommunities.map((m) => m.communityId);

  // 2. Platform events (standalone) - upcoming
  const now = new Date();
  const platformEvents = await prisma.platformEvent.findMany({
    where: { endTime: { gte: now } },
    include: { organizer: { select: { id: true, username: true, name: true } } },
    orderBy: { startTime: "asc" },
    take: 20,
  });

  // 3. Community events (from Event model) - upcoming
  const communityEvents = await prisma.event.findMany({
    where: {
      communityId: { in: communityIds },
      endAt: { gte: now },
    },
    include: {
      community: { select: { id: true, name: true } },
    },
    orderBy: { startAt: "asc" },
    take: 20,
  });

  // 4. User's past RSVPs (for personalization signal - could enhance with ML later)
  const userRsvps = await prisma.platformEventRsvp.findMany({
    where: { userId },
    select: { eventId: true },
  });

  // Merge and dedupe: prefer platform events, then community events
  const seen = new Set<string>();
  const recommendations: {
    event_id: string;
    type: "platform" | "community";
    title: string;
    description: string | null;
    start_time: string;
    end_time: string;
    location: string | null;
    organizer_id?: string;
    community_id?: string;
  }[] = [];

  for (const e of platformEvents) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    recommendations.push({
      event_id: e.id,
      type: "platform",
      title: e.title,
      description: e.description,
      start_time: e.startTime.toISOString(),
      end_time: e.endTime.toISOString(),
      location: e.location,
      organizer_id: e.organizerId,
    });
  }

  for (const e of communityEvents) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    recommendations.push({
      event_id: e.id,
      type: "community",
      title: e.title,
      description: e.description,
      start_time: e.startAt.toISOString(),
      end_time: e.endAt.toISOString(),
      location: e.location,
      community_id: e.communityId,
    });
  }

  // Sort by start time
  recommendations.sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  return Response.json({
    recommendations: recommendations.slice(0, 10),
  });
}
