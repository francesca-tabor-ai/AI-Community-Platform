import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden, badRequest } from "@/lib/api-v1/errors";

const schema = z.object({ status: z.enum(["accepted", "declined"]) });

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id: connectionId } = await params;

  const conn = await prisma.vibeNetConnection.findUnique({
    where: { id: connectionId },
  });
  if (!conn) return notFound("Connection not found");
  if (conn.toUserId !== authResult.user.id) {
    return forbidden("Only the recipient can accept or decline");
  }
  if (conn.status !== "pending") return badRequest("Connection is not pending");

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return badRequest("status must be 'accepted' or 'declined'");

  const updated = await prisma.vibeNetConnection.update({
    where: { id: connectionId },
    data: { status: parsed.data.status as "accepted" | "declined" },
  });

  return Response.json({
    id: updated.id,
    status: updated.status,
    message: `Connection ${updated.status}`,
  });
}
