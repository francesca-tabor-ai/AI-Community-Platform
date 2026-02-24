import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
  const unreadOnly = searchParams.get("unreadOnly") === "true";

  const notifications = await prisma.notification.findMany({
    where: {
      userId: authResult.user.id,
      ...(unreadOnly && { read: false }),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: authResult.user.id, read: false },
  });

  return NextResponse.json({
    notifications,
    unreadCount,
  });
}
