import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const notification = await prisma.notification.findFirst({
    where: {
      id: (await params).id,
      userId: authResult.user.id,
    },
  });

  if (!notification) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  await prisma.notification.update({
    where: { id: notification.id },
    data: { read: true },
  });

  return NextResponse.json({ read: true });
}
