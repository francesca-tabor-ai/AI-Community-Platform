import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getCommunityDashboardUserId,
  canAdminCommunity,
} from "@/lib/community-auth";
import { trackEvent } from "@/lib/analytics/track";
import type { PostPublishedEvent } from "@/lib/analytics/events";
import { enqueueEmailBatch } from "@/lib/email";

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
    } as Omit<
      PostPublishedEvent,
      "session_id" | "platform" | "device_type" | "browser" | "os"
    >);

    // Enqueue new post notifications to community members + subscribers
    try {
      const communityData = await prisma.community.findUnique({
        where: { id: community.id },
        select: { name: true, slug: true },
      });
      const authorData = await prisma.user.findUnique({
        where: { id: updated.authorId },
        select: { name: true, profile: { select: { displayName: true } } },
      });
      const creatorName =
        authorData?.profile?.displayName || authorData?.name || "A creator";
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000");
      const postUrl = `${appUrl}/community/${communityData?.slug ?? community.id}/post/${postId}`;

      const members = await prisma.member.findMany({
        where: {
          communityId: community.id,
          userId: { not: updated.authorId },
        },
        include: {
          user: {
            select: { email: true, name: true, profile: { select: { displayName: true } } },
          },
        },
      });
      const subscribers = await prisma.subscription.findMany({
        where: {
          communityId: community.id,
          subscriberId: { not: updated.authorId },
          status: "active",
        },
        include: {
          subscriber: {
            select: { email: true, name: true, profile: { select: { displayName: true } } },
          },
        },
      });

      const seenEmails = new Set<string>();
      const messages: Array<{
        email_type: "new_post_notification";
        recipient_email: string;
        recipient_name?: string;
        template_data: Record<string, unknown>;
        metadata?: Record<string, string>;
      }> = [];

      for (const m of [...members, ...subscribers]) {
        const user = "user" in m ? m.user : m.subscriber;
        const email = user?.email;
        if (!email || seenEmails.has(email)) continue;
        seenEmails.add(email);

        messages.push({
          email_type: "new_post_notification",
          recipient_email: email,
          recipient_name:
            user?.profile?.displayName || user?.name || undefined,
          template_data: {
            creator_name: creatorName,
            post_title: updated.title,
            post_url: postUrl,
            community_name: communityData?.name,
          },
          metadata: { user_id: "user" in m ? m.userId : m.subscriberId, post_id: postId },
        });
      }

      if (messages.length > 0) {
        await enqueueEmailBatch(messages);
      }
    } catch (emailErr) {
      console.error("[posts/publish] Failed to enqueue email notifications:", emailErr);
      // Don't fail the publish - email is best-effort
    }
  }

  return NextResponse.json(updated);
}
