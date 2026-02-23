import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
    const unreadOnly = searchParams.get("unread") === "true";

    const where = unreadOnly ? { read: false } : {};
    const submissions = await prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const unreadCount = await prisma.contactSubmission.count({
      where: { read: false },
    });

    return NextResponse.json({
      submissions,
      unreadCount,
    });
  } catch (err) {
    console.error("Admin submissions error:", err);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
