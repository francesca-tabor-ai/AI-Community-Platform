import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { apiError } from "@/lib/api-v1/errors";

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  // In production: enqueue match-refresh job to RabbitMQ/Redis
  // For MVP: run simple match computation synchronously
  const user = await prisma.user.findUnique({
    where: { id: authResult.user.id },
    include: { vibenetSkills: true },
  });
  if (!user) return apiError(404, "User not found", { code: "NOT_FOUND" });

  const otherUsers = await prisma.user.findMany({
    where: { id: { not: user.id } },
    include: { vibenetSkills: true },
    take: 50,
  });

  const mySkillNames = new Set(user.vibenetSkills.map((s) => s.name.toLowerCase()));

  for (const other of otherUsers) {
    const theirSkills = other.vibenetSkills.map((s) => s.name.toLowerCase());
    const overlap = theirSkills.filter((s) => mySkillNames.has(s)).length;
    const industryBonus = other.industry === user.industry ? 10 : 0;
    const locationBonus = other.location === user.location ? 5 : 0;
    const score = Math.min(100, overlap * 8 + industryBonus + locationBonus + 20);

    await prisma.vibeNetMatch.upsert({
      where: {
        userId_matchedUserId: {
          userId: user.id,
          matchedUserId: other.id,
        },
      },
      create: {
        userId: user.id,
        matchedUserId: other.id,
        score,
        reason: `Shared skills: ${overlap}. ${industryBonus ? "Same industry." : ""} ${locationBonus ? "Same location." : ""}`,
      },
      update: { score, reason: `Shared skills: ${overlap}.`, computedAt: new Date() },
    });
  }

  return Response.json({
    message: "Match refresh completed",
  });
}
