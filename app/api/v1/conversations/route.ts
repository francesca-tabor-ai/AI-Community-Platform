import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { badRequest } from "@/lib/api-v1/errors";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const parts = await prisma.vibeNetConversationParticipant.findMany({
    where: { userId: authResult.user.id },
    include: {
      conversation: {
        include: {
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
          participants: { include: { user: { select: { id: true, name: true, username: true, image: true } } } },
        },
      },
    },
  });

  const list = parts.map((p) => {
    const others = p.conversation.participants
      .filter((x) => x.userId !== authResult.user.id)
      .map((x) => x.user);
    const lastMsg = p.conversation.messages[0];
    return {
      id: p.conversation.id,
      participants: others,
      lastMessage: lastMsg
        ? { content: lastMsg.content.slice(0, 100), createdAt: lastMsg.createdAt.toISOString() }
        : null,
      lastReadAt: p.lastReadAt?.toISOString() ?? null,
    };
  });

  return Response.json({ conversations: list });
}

const schema = z.object({ userId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return badRequest("userId is required");

  const otherUserId = parsed.data.userId;
  if (otherUserId === authResult.user.id) return badRequest("Cannot start conversation with yourself");

  const other = await prisma.user.findUnique({ where: { id: otherUserId } });
  if (!other) return badRequest("User not found");

  const myConvs = await prisma.vibeNetConversation.findMany({
    where: { participants: { some: { userId: authResult.user.id } } },
    include: { participants: true },
  });
  const existing = myConvs.find((c) => {
    const ids = c.participants.map((p) => p.userId);
    return ids.length === 2 && ids.includes(authResult.user.id) && ids.includes(otherUserId);
  });
  if (existing) {
    return Response.json({ id: existing.id, message: "Conversation already exists" }, { status: 200 });
  }

  const conv = await prisma.vibeNetConversation.create({
    data: {
      participants: {
        create: [{ userId: authResult.user.id }, { userId: otherUserId }],
      },
    },
  });

  return Response.json({ id: conv.id, message: "Conversation started" }, { status: 201 });
}
