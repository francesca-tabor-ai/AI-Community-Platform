import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, forbidden } from "@/lib/api-v1/errors";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; skillId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id, skillId } = await params;
  if (authResult.user.id !== id) return forbidden("Can only remove skills from your own profile");

  const skill = await prisma.vibeNetSkill.findFirst({
    where: { id: skillId, userId: id },
  });
  if (!skill) return notFound("Skill not found");

  await prisma.vibeNetSkill.delete({ where: { id: skillId } });
  return new Response(null, { status: 204 });
}
