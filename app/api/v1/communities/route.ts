import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-v1/auth";
import { badRequest } from "@/lib/api-v1/errors";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const createCommunitySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  try {
    const body = await req.json();
    const parsed = createCommunitySchema.safeParse(body);

    if (!parsed.success) {
      const field_errors: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const path = e.path[0]?.toString();
        if (path) field_errors[path] = e.message;
      });
      return badRequest("Validation failed", field_errors);
    }

    const { name, description } = parsed.data;
    let slug = slugify(name);
    let attempts = 0;
    while (await prisma.community.findUnique({ where: { slug } })) {
      slug = `${slugify(name)}-${++attempts}`;
    }

    const community = await prisma.community.create({
      data: {
        name,
        slug,
        description: description ?? null,
        ownerId: authResult.user.id,
      },
    });

    await prisma.member.create({
      data: {
        userId: authResult.user.id,
        communityId: community.id,
        role: "owner",
      },
    });

    return Response.json(
      {
        community_id: community.id,
        name: community.name,
        description: community.description,
        creator_id: community.ownerId,
        created_at: community.createdAt.toISOString(),
        updated_at: community.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch {
    const { apiError } = await import("@/lib/api-v1/errors");
    return apiError(500, "Internal server error", { code: "INTERNAL_ERROR" });
  }
}

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const communities = await prisma.community.findMany({
    where: { visibility: "public" },
    select: {
      id: true,
      name: true,
      description: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  return Response.json(
    communities.map((c) => ({
      community_id: c.id,
      name: c.name,
      description: c.description,
      creator_id: c.ownerId,
      created_at: c.createdAt.toISOString(),
      updated_at: c.updatedAt.toISOString(),
    }))
  );
}
