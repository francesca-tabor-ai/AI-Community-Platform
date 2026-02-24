import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function PATCH(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  await prisma.notification.updateMany({
    where: { userId: authResult.user.id },
    data: { read: true },
  });

  return NextResponse.json({ success: true });
}
