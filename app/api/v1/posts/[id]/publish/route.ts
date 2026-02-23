import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCreator } from "@/lib/api-v1/auth";
import { notFound, forbidden } from "@/lib/api-v1/errors";
import { enqueueNewPostNotifications } from "@/lib/api-v1/jobs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireCreator(req);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  const post = await prisma.creatorPost.findUnique({ where: { id } });
  if (!post) return notFound("Post not found");
  if (post.creatorId !== authResult.user.id) {
    return forbidden("You can only publish your own posts");
  }
  if (post.status === "published") {
    return Response.json(
      { detail: "Post is already published", code: "CONFLICT" },
      { status: 409 }
    );
  }

  const updated = await prisma.creatorPost.update({
    where: { id },
    data: { status: "published", publishedAt: new Date() },
  });

  await enqueueNewPostNotifications(id);

  return Response.json({
    id: updated.id,
    creator_id: updated.creatorId,
    title: updated.title,
    content: updated.content,
    status: updated.status,
    published_at: updated.publishedAt!.toISOString(),
  });
}
