import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { notFound, badRequest } from "@/lib/api-v1/errors";

const createCommentSchema = z.object({
  content: z.string().min(1).max(10000),
  parent_comment_id: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { postId } = await params;

  const post = await prisma.creatorPost.findUnique({ where: { id: postId } });
  if (!post) return notFound("Post not found");

  try {
    const body = await req.json();
    const parsed = createCommentSchema.safeParse(body);

    if (!parsed.success) {
      const field_errors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const path = e.path[0]?.toString();
        if (path) field_errors[path] = e.message;
      });
      return badRequest("Validation failed", field_errors);
    }

    const { content, parent_comment_id } = parsed.data;

    if (parent_comment_id) {
      const parent = await prisma.creatorPostComment.findFirst({
        where: { id: parent_comment_id, postId },
      });
      if (!parent) {
        return badRequest("Parent comment not found", {
          parent_comment_id: "Invalid parent comment",
        });
      }
    }

    const comment = await prisma.creatorPostComment.create({
      data: {
        postId,
        userId: authResult.user.id,
        content,
        parentCommentId: parent_comment_id ?? undefined,
      },
    });

    return Response.json(
      {
        id: comment.id,
        post_id: comment.postId,
        user_id: comment.userId,
        content: comment.content,
        created_at: comment.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { detail: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { postId } = await params;
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const post = await prisma.creatorPost.findUnique({ where: { id: postId } });
  if (!post) return notFound("Post not found");

  const comments = await prisma.creatorPostComment.findMany({
    where: { postId, parentCommentId: null },
    include: { replies: true },
    orderBy: { createdAt: "asc" },
    take: limit,
    skip: offset,
  });

  const flatten = (
    c: { id: string; userId: string; content: string; createdAt: Date; replies: { id: string; userId: string; content: string; createdAt: Date }[] }
  ): { id: string; user_id: string; content: string; created_at: string }[] => {
    const items = [
      {
        id: c.id,
        user_id: c.userId,
        content: c.content,
        created_at: c.createdAt.toISOString(),
      },
    ];
    for (const reply of c.replies) {
      items.push({
        id: reply.id,
        user_id: reply.userId,
        content: reply.content,
        created_at: reply.createdAt.toISOString(),
      });
    }
    return items;
  };

  const result = comments.flatMap(flatten);

  return Response.json(result);
}
