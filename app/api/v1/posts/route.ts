import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireCreator } from "@/lib/api-v1/auth";
import { badRequest } from "@/lib/api-v1/errors";

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

const createPostSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const authResult = await requireCreator(req);
  if (authResult instanceof Response) return authResult;

  const posts = await prisma.creatorPost.findMany({
    where: { creatorId: authResult.user.id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(posts.map(toPostResponse));
}

export async function POST(req: NextRequest) {
  const authResult = await requireCreator(req);
  if (authResult instanceof Response) return authResult;

  try {
    const body = await req.json();
    const parsed = createPostSchema.safeParse(body);

    if (!parsed.success) {
      const field_errors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const path = e.path[0]?.toString();
        if (path) field_errors[path] = e.message;
      });
      return badRequest("Validation failed", field_errors);
    }

    const { title, content } = parsed.data;

    const post = await prisma.creatorPost.create({
      data: {
        creatorId: authResult.user.id,
        title,
        content: content ?? "",
        status: "draft",
      },
    });

    return Response.json(
      { post: toPostResponse(post) },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { detail: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
