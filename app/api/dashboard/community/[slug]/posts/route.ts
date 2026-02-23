import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getCommunityDashboardUserId,
  canAdminCommunity,
} from "@/lib/community-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
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

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
  const status = searchParams.get("status"); // draft | published | all

  const posts = await prisma.post.findMany({
    where: {
      communityId: community.id,
      ...(status && status !== "all" ? { status: status as "draft" | "published" } : {}),
    },
    include: {
      author: {
        select: { id: true, name: true, email: true, profile: { select: { displayName: true } } },
      },
      space: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(posts);
}

/**
 * POST - Create a new post (draft)
 * Body: { title: string, body: string, spaceId: string, type?: "post" | "article" }
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const userId = await getCommunityDashboardUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const community = await prisma.community.findUnique({
    where: { slug },
    select: {
      id: true,
      spaces: { take: 1, orderBy: { createdAt: "asc" }, select: { id: true } },
    },
  });

  if (!community) {
    return NextResponse.json({ community: "Community not found" }, { status: 404 });
  }

  const canAdmin = await canAdminCommunity(userId, community.id);
  if (!canAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    title: string;
    body: string;
    spaceId?: string;
    type?: "post" | "article";
    status?: "draft" | "published";
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, body: content, status: postStatus } = body;
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  let spaceId = body.spaceId;
  if (!spaceId) {
    const firstSpace = community.spaces[0];
    if (!firstSpace) {
      return NextResponse.json(
        { error: "No spaces in community. Create a space first." },
        { status: 400 }
      );
    }
    spaceId = community.spaces[0].id;
  }

  const space = await prisma.space.findFirst({
    where: { id: spaceId, communityId: community.id },
  });
  if (!space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  const status = postStatus === "published" ? "published" : "draft";

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      body: content ?? "",
      type: body.type ?? "post",
      status,
      spaceId,
      communityId: community.id,
      authorId: userId,
    },
  });

  return NextResponse.json(post);
}
