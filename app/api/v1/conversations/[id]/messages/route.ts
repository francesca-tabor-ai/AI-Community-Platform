import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden, badRequest } from "@/lib/api-v1/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
  const cursor = searchParams.get("cursor");

  const part = await prisma.vibeNetConversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId: id, userId: authResult.user.id },
    },
  });
  if (!part) return notFound("Conversation not found");

  const messages = await prisma.vibeNetMessage.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: { sender: { select: { id: true, name: true, username: true } } },
  });

  const hasMore = messages.length > limit;
  const list = (hasMore ? messages.slice(0, limit) : messages).reverse();

  return Response.json({
    messages: list.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      sender: m.sender,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })),
    nextCursor: hasMore ? list[list.length - 1]?.id : null,
  });
}

const schema = z.object({ content: z.string().min(1).max(10000) });

export async function POST(
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

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return badRequest("content is required");

  const msg = await prisma.vibeNetMessage.create({
    data: {
      conversationId: id,
      senderId: authResult.user.id,
      content: parsed.data.content,
    },
    include: { sender: { select: { id: true, name: true, username: true } } },
  });

  return Response.json(
    {
      id: msg.id,
      senderId: msg.senderId,
      sender: msg.sender,
      content: msg.content,
      createdAt: msg.createdAt.toISOString(),
    },
    { status: 201 }
  );
}
