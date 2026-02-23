import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound } from "@/lib/api-v1/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { eventId } = await params;

  const event = await prisma.platformEvent.findUnique({ where: { id: eventId } });
  if (!event) return notFound("Event not found");

  // Get event RSVPs / participants - users who expressed interest
  const rsvps = await prisma.platformEventRsvp.findMany({
    where: { eventId },
    include: { user: true },
  });

  const currentUserProfile = (await prisma.user.findUnique({
    where: { id: authResult.user.id },
    select: { profileData: true },
  }))?.profileData as Record<string, unknown> | null;

  // Simple matching: compare profileData (skills, interests) with other participants
  // In production: call AI Service Module for semantic matching
  const recommendations = rsvps
    .filter((r) => r.userId !== authResult.user.id)
    .map((r) => {
      const otherProfile = r.user.profileData as Record<string, unknown> | null;
      let score = 0.5;
      if (currentUserProfile?.skills && otherProfile?.skills) {
        const mySkills = Array.isArray(currentUserProfile.skills)
          ? currentUserProfile.skills
          : [currentUserProfile.skills];
        const theirSkills = Array.isArray(otherProfile.skills)
          ? otherProfile.skills
          : [otherProfile.skills];
        const overlap = mySkills.filter((s: unknown) =>
          theirSkills.includes(s)
        ).length;
        score = Math.min(1, 0.5 + overlap * 0.1);
      }
      return {
        user_id: r.userId,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return Response.json({
    recommendations,
  });
}
