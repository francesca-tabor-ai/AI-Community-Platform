import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden, badRequest } from "@/lib/api-v1/errors";

const schema = z.object({ name: z.string().min(1).max(100) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  if (authResult.user.id !== id) return forbidden("Can only add skills to your own profile");

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return notFound("User not found");

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return badRequest("Validation failed", { name: parsed.error.errors[0]?.message });
  }

  const skill = await prisma.vibeNetSkill.create({
    data: { userId: id, name: parsed.data.name.trim() },
  });

  return Response.json({ id: skill.id, name: skill.name }, { status: 201 });
}
