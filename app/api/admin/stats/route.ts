import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      userCount,
      communityCount,
      submissionCount,
      unreadSubmissions,
      recentSubmissions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.community.count(),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { read: false } }),
      prisma.contactSubmission.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return NextResponse.json({
      users: userCount,
      communities: communityCount,
      contactSubmissions: submissionCount,
      unreadSubmissions,
      submissionsLast24h: recentSubmissions,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
