import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden, badRequest, conflict } from "@/lib/api-v1/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  if (authResult.user.id !== id) return forbidden("Can only view your own connections");

  const connections = await prisma.vibeNetConnection.findMany({
    where: {
      OR: [{ fromUserId: id }, { toUserId: id }],
      status: "accepted",
    },
    include: {
      fromUser: { select: { id: true, name: true, username: true, headline: true, image: true } },
      toUser: { select: { id: true, name: true, username: true, headline: true, image: true } },
    },
  });

  const list = connections.map((c) => {
    const other = c.fromUserId === id ? c.toUser : c.fromUser;
    return {
      id: c.id,
      userId: other.id,
      name: other.name,
      username: other.username,
      headline: other.headline,
      profilePhotoUrl: other.image,
      status: c.status,
    };
  });

  return Response.json({ connections: list });
}

const schema = z.object({ userId: z.string().min(1) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  if (authResult.user.id !== id) return forbidden("Can only send connection requests from your account");

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return badRequest("userId is required");

  const toUserId = parsed.data.userId;
  if (toUserId === id) return badRequest("Cannot connect with yourself");

  const target = await prisma.user.findUnique({ where: { id: toUserId } });
  if (!target) return notFound("User not found");

  const existing = await prisma.vibeNetConnection.findFirst({
    where: {
      OR: [
        { fromUserId: id, toUserId },
        { fromUserId: toUserId, toUserId: id },
      ],
    },
  });
  if (existing) return conflict("Connection already exists");

  const conn = await prisma.vibeNetConnection.create({
    data: { fromUserId: id, toUserId, status: "pending" },
  });

  return Response.json(
    { id: conn.id, status: conn.status, message: "Connection request sent" },
    { status: 201 }
  );
}
