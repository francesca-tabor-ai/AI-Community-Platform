import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { requireAuth, requireMember } from "@/lib/auth-helpers";
import { createNotification } from "@/lib/notifications";
import { logActivity } from "@/lib/activity";

const createSchema = z.object({
  body: z.string().min(1, "Comment cannot be empty").max(5000),
  parentId: z.string().cuid().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const post = await prisma.post.findUnique({
    where: { id: (await params).id },
    include: { community: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const session = await auth();
  if (post.community.visibility === "private" && session?.user?.id) {
    const member = await prisma.member.findUnique({
      where: {
        userId_communityId: {
          userId: session.user.id,
          communityId: post.communityId,
        },
      },
    });
    if (!member) {
      return NextResponse.json({ error: "Private community" }, { status: 403 });
    }
  } else if (post.community.visibility === "private") {
    return NextResponse.json({ error: "Private community" }, { status: 401 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId: post.id, parentId: null },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          profile: { select: { displayName: true, avatarUrl: true } },
        },
      },
      replies: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              profile: { select: { displayName: true, avatarUrl: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ comments });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const post = await prisma.post.findUnique({
    where: { id: (await params).id },
    include: { community: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const memberCheck = await requireMember(post.communityId, "member");
  if (memberCheck instanceof NextResponse) return memberCheck;

  if (post.status !== "published") {
    return NextResponse.json(
      { error: "Cannot comment on draft posts" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { body: commentBody, parentId } = parsed.data;

    if (parentId) {
      const parent = await prisma.comment.findFirst({
        where: { id: parentId, postId: post.id },
      });
      if (!parent) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 400 });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        postId: post.id,
        authorId: authResult.user.id,
        body: commentBody.trim(),
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            profile: { select: { displayName: true, avatarUrl: true } },
          },
        },
      },
    });

    await logActivity({
      userId: authResult.user.id,
      type: "comment",
      targetType: "post",
      targetId: post.id,
      metadata: { commentId: comment.id },
    });

    if (post.authorId !== authResult.user.id) {
      const authorName = comment.author?.profile?.displayName || comment.author?.name || "Someone";
      await createNotification({
        userId: post.authorId,
        type: "new_comment",
        targetId: post.id,
        title: "New comment on your post",
        message: `${authorName} commented on "${post.title}"`,
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    console.error("Create comment error:", err);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
