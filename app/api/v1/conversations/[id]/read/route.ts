import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound } from "@/lib/api-v1/errors";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  const part = await prisma.vibeNetConversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId: id, userId: authResult.user.id },
    },
  });
  if (!part) return notFound("Conversation not found");

  await prisma.vibeNetConversationParticipant.update({
    where: {
      conversationId_userId: { conversationId: id, userId: authResult.user.id },
    },
    data: { lastReadAt: new Date() },
  });

  return Response.json({ message: "Conversation marked as read" });
}
