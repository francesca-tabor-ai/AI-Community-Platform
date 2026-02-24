import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { createNotification } from "@/lib/notifications";
import { logActivity } from "@/lib/activity";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const community = await prisma.community.findUnique({
    where: { slug: (await params).slug },
  });

  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  if (community.visibility === "private") {
    return NextResponse.json(
      { error: "This community is private. An invite is required to join." },
      { status: 403 }
    );
  }

  const existing = await prisma.member.findUnique({
    where: {
      userId_communityId: {
        userId: authResult.user.id,
        communityId: community.id,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ message: "Already a member", isMember: true });
  }

  await prisma.member.create({
    data: {
      userId: authResult.user.id,
      communityId: community.id,
      role: "member",
    },
  });

  await logActivity({
    userId: authResult.user.id,
    type: "join_community",
    targetType: "community",
    targetId: community.id,
    metadata: { communityName: community.name },
  });

  if (community.ownerId !== authResult.user.id) {
    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: { name: true, profile: { select: { displayName: true } } },
    });
    const joinerName = user?.profile?.displayName || user?.name || "Someone";
    await createNotification({
      userId: community.ownerId,
      type: "member_join",
      targetId: community.id,
      title: "New member joined",
      message: `${joinerName} joined ${community.name}`,
    });
  }

  return NextResponse.json({ message: "Joined successfully", isMember: true });
}
