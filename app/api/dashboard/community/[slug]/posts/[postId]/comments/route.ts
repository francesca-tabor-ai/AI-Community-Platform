import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getCommunityDashboardUserId,
  canAdminCommunity,
} from "@/lib/community-auth";
import { trackEvent } from "@/lib/analytics/track";

/**
 * POST - Create a comment on a post
 * Body: { body: string, parentId?: string }
 */
export async function POST(
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

  const canAccess = await canAdminCommunity(userId, community.id);
  if (!canAccess) {
    const member = await prisma.member.findUnique({
      where: { userId_communityId: { userId, communityId: community.id } },
    });
    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const post = await prisma.post.findFirst({
    where: { id: postId, communityId: community.id },
    include: { author: { select: { id: true } } },
  });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  let body: { body?: string; parentId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const content = body.body?.trim();
  if (!content) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      authorId: userId,
      body: content,
      parentId: body.parentId || null,
    },
  });

  trackEvent({
    event_id: crypto.randomUUID(),
    event_name: "comment_submitted",
    timestamp: new Date().toISOString(),
    user_id: userId,
    post_id: postId,
    comment_id: comment.id,
    parent_comment_id: comment.parentId ?? undefined,
  });

  return NextResponse.json({
    id: comment.id,
    post_id: postId,
    author_id: userId,
    body: comment.body,
    parent_id: comment.parentId,
    created_at: comment.createdAt,
  });
}

/**
 * GET - List comments for a post
 */
export async function GET(
  _req: Request,
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

  const member = await prisma.member.findUnique({
    where: { userId_communityId: { userId, communityId: community.id } },
  });
  if (!member) {
    const canAdmin = await canAdminCommunity(userId, community.id);
    if (!canAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const post = await prisma.post.findFirst({
    where: { id: postId, communityId: community.id },
  });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: { id: true, name: true, profile: { select: { displayName: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(comments);
}
