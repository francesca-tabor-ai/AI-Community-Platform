import { prisma } from "@/lib/prisma";
import type { NotificationType } from "@prisma/client";

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  targetId: string;
  title?: string;
  message?: string;
}) {
  await prisma.notification.create({
    data: params,
  });
}
