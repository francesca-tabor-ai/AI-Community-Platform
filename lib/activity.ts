import { prisma } from "@/lib/prisma";

export async function logActivity(params: {
  userId: string;
  type: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
}) {
  await prisma.activity.create({
    data: {
      userId: params.userId,
      type: params.type,
      targetType: params.targetType,
      targetId: params.targetId,
      metadata: params.metadata as object | undefined,
    },
  });
}
