import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/auth-helpers";
import { createNotification } from "@/lib/notifications";
import { logActivity } from "@/lib/activity";
import { generatePostEmbedding } from "@/lib/post-embeddings";

const createSchema = z.object({
  communityId: z.string().cuid(),
  spaceId: z.string().cuid(),
  title: z.string().min(1, "Title is required").max(500),
  body: z.string(),
  status: z.enum(["draft", "published"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { communityId, spaceId, title, body: postBody, status } = parsed.data;

    const memberResult = await requireMember(communityId, "member");
    if (memberResult instanceof NextResponse) return memberResult;

    const space = await prisma.space.findFirst({
      where: { id: spaceId, communityId },
    });

    if (!space) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        spaceId,
        communityId,
        authorId: memberResult.user.id,
        title: title.trim(),
        body: postBody || "",
        status: status ?? "draft",
      },
    });

    await logActivity({
      userId: memberResult.user.id,
      type: "create_post",
      targetType: "post",
      targetId: post.id,
      metadata: { title: title.trim(), spaceId, communityId },
    });

    if (status === "published") {
      const members = await prisma.member.findMany({
        where: {
          communityId,
          userId: { not: memberResult.user.id },
        },
        select: { userId: true },
      });
      const community = await prisma.community.findUnique({
        where: { id: communityId },
        select: { name: true },
      });
      const author = await prisma.user.findUnique({
        where: { id: memberResult.user.id },
        select: { name: true, profile: { select: { displayName: true } } },
      });
      const authorName = author?.profile?.displayName || author?.name || "Someone";
      for (const m of members) {
        await createNotification({
          userId: m.userId,
          type: "new_post",
          targetId: post.id,
          title: "New post in " + (community?.name ?? "community"),
          message: `${authorName} posted: ${title.trim()}`,
        });
      }
    }

    if (status === "published") {
      generatePostEmbedding(post.id).catch((err) =>
        console.error("[posts] Failed to generate embedding:", err)
      );
    }

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("Create post error:", err);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
