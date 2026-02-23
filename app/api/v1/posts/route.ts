import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireCreator } from "@/lib/api-v1/auth";
import { badRequest } from "@/lib/api-v1/errors";

const createPostSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1),
});

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
        content,
        status: "draft",
      },
    });

    return Response.json(
      {
        id: post.id,
        creator_id: post.creatorId,
        title: post.title,
        status: post.status,
        created_at: post.createdAt.toISOString(),
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
