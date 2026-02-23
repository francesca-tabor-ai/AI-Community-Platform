import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireCreator } from "@/lib/api-v1/auth";
import { notFound, forbidden, badRequest } from "@/lib/api-v1/errors";

function toPostResponse(post: { id: string; creatorId: string; title: string; content: string; status: string; createdAt: Date; updatedAt: Date; publishedAt: Date | null }) {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    published: post.status === "published",
    authorId: post.creatorId,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

const updatePostSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  const post = await prisma.creatorPost.findUnique({
    where: { id },
  });

  if (!post) return notFound("Post not found");

  if (post.status === "draft" && post.creatorId !== authResult.user.id) {
    return forbidden("Draft posts are only visible to the creator");
  }

  return Response.json({ post: toPostResponse(post) });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireCreator(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  const post = await prisma.creatorPost.findUnique({ where: { id } });
  if (!post) return notFound("Post not found");
  if (post.creatorId !== authResult.user.id) {
    return forbidden("You can only update your own posts");
  }

  try {
    const body = await req.json();
    const parsed = updatePostSchema.safeParse(body);

    if (!parsed.success) {
      const field_errors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const path = e.path[0]?.toString();
        if (path) field_errors[path] = e.message;
      });
      return badRequest("Validation failed", field_errors);
    }

    const updates = parsed.data;
    const updateData: Record<string, unknown> = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.content !== undefined) updateData.content = updates.content;
    if (updates.status !== undefined) updateData.status = updates.status;

    const updated = await prisma.creatorPost.update({
      where: { id },
      data: updateData,
    });

    return Response.json({ post: toPostResponse(updated) });
  } catch {
    return Response.json(
      { detail: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
