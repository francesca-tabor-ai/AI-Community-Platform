import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { MemberRole } from "@prisma/client";

/**
 * Require a valid session. Use in API routes.
 * Returns the session user or a 401 Response.
 */
export async function requireAuth(): Promise<
  { user: { id: string; email?: string | null } } | NextResponse
> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { user: { id: session.user.id, email: session.user.email } };
}

/**
 * Require user to be a member of a community with at least the given role.
 * Use in community-scoped API routes.
 */
export async function requireMember(
  communityId: string,
  minRole: MemberRole = "member"
): Promise<
  | { user: { id: string }; member: { role: MemberRole } }
  | NextResponse
> {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const member = await prisma.member.findUnique({
    where: {
      userId_communityId: {
        userId: authResult.user.id,
        communityId,
      },
    },
  });

  if (!member) {
    return NextResponse.json(
      { error: "You must be a member of this community" },
      { status: 403 }
    );
  }

  const roleOrder: Record<MemberRole, number> = {
    member: 1,
    moderator: 2,
    owner: 3,
  };

  if (roleOrder[member.role] < roleOrder[minRole]) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  return {
    user: { id: authResult.user.id },
    member: { role: member.role },
  };
}
