import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden, badRequest } from "@/lib/api-v1/errors";

const schema = z.object({
  rating: z.number().min(1).max(5).optional(),
  helpful: z.boolean().optional(),
  comment: z.string().max(500).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  const match = await prisma.vibeNetMatch.findUnique({ where: { id } });
  if (!match) return notFound("Match not found");
  if (match.userId !== authResult.user.id) return forbidden("Not your match");

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return badRequest("Invalid feedback");

  const feedback = (match.feedback as Record<string, unknown>) ?? {};
  const updated = await prisma.vibeNetMatch.update({
    where: { id },
    data: {
      feedback: { ...feedback, ...parsed.data, submittedAt: new Date().toISOString() },
    },
  });

  return Response.json({
    matchId: updated.id,
    message: "Feedback submitted",
  });
}
