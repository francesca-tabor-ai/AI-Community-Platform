import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getCommunityDashboardUserId,
  canAdminCommunity,
} from "@/lib/community-auth";
import { trackEvent } from "@/lib/analytics/track";

/**
 * PATCH - Update a post (e.g. publish draft)
 * Body: { status?: "draft" | "published", title?: string, body?: string }
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string; postId: string }> }
) {
  const { slug, postId } = await params;
  const userId = await getCommunityDashboardUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const community = await prisma.community.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  const canAdmin = await canAdminCommunity(userId, community.id);
  if (!canAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.post.findFirst({
    where: { id: postId, communityId: community.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  let body: { status?: "draft" | "published"; title?: string; body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const wasDraft = existing.status === "draft";
  const isPublishing = body.status === "published" && wasDraft;

  const updated = await prisma.post.update({
    where: { id: postId },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.title !== undefined && { title: body.title }),
      ...(body.body !== undefined && { body: body.body }),
    },
  });

  if (isPublishing) {
    trackEvent({
      event_id: crypto.randomUUID(),
      event_name: "post_published",
      timestamp: new Date().toISOString(),
      user_id: userId,
      post_id: postId,
      post_title: updated.title,
      post_type: updated.type === "article" ? "article" : "post",
    });
  }

  return NextResponse.json(updated);
}
