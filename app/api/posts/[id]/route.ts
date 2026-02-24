import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { requireAuth, requireMember } from "@/lib/auth-helpers";
import { generatePostEmbedding } from "@/lib/post-embeddings";

const updateSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  body: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const post = await prisma.post.findUnique({
    where: { id: (await params).id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          profile: { select: { displayName: true, avatarUrl: true } },
        },
      },
      space: { select: { id: true, name: true, slug: true } },
      community: { select: { id: true, name: true, slug: true, visibility: true } },
    },
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

  if (post.status === "draft") {
    if (!session?.user?.id || session.user.id !== post.authorId) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
  }

  return NextResponse.json(post);
}

export async function PATCH(
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

  if (post.authorId !== authResult.user.id) {
    const isMod = memberCheck.member.role === "moderator" || memberCheck.member.role === "owner";
    if (!isMod) {
      return NextResponse.json({ error: "You can only edit your own posts" }, { status: 403 });
    }
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.post.update({
      where: { id: post.id },
      data: {
        ...(parsed.data.title != null && { title: parsed.data.title }),
        ...(parsed.data.body != null && { body: parsed.data.body }),
        ...(parsed.data.status != null && { status: parsed.data.status }),
      },
    });

    if (parsed.data.status === "published") {
      generatePostEmbedding(updated.id).catch((err) =>
        console.error("[posts] Failed to generate embedding:", err)
      );
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const post = await prisma.post.findUnique({
    where: { id: (await params).id },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const memberCheck = await requireMember(post.communityId, "member");
  if (memberCheck instanceof NextResponse) return memberCheck;

  if (post.authorId !== authResult.user.id) {
    const isMod = memberCheck.member.role === "moderator" || memberCheck.member.role === "owner";
    if (!isMod) {
      return NextResponse.json({ error: "You can only delete your own posts" }, { status: 403 });
    }
  }

  await prisma.post.delete({ where: { id: post.id } });
  return NextResponse.json({ deleted: true });
}
