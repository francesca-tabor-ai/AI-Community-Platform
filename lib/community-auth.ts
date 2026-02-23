import { cookies } from "next/headers";
import { prisma } from "./prisma";

const USER_COOKIE = "community_dashboard_user";

/**
 * Get the current user ID for community dashboard.
 * TODO: Wire to NextAuth session when auth is configured.
 * For now: uses DEMO_USER_ID env or community_dashboard_user cookie for dev.
 */
export async function getCommunityDashboardUserId(): Promise<string | null> {
  // 1. Check env override for demo/dev
  const demoUserId = process.env.DEMO_USER_ID;
  if (demoUserId) return demoUserId;

  // 2. Check cookie (set by login or dev mode)
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_COOKIE)?.value;
  if (userId) return userId;

  // 3. Fallback: first user in DB (for local dev with seed)
  if (process.env.NODE_ENV === "development") {
    const user = await prisma.user.findFirst({ select: { id: true } });
    return user?.id ?? null;
  }

  return null;
}

/**
 * Verify user has owner or moderator role for a community.
 */
export async function canAdminCommunity(
  userId: string,
  communityId: string
): Promise<boolean> {
  const member = await prisma.member.findUnique({
    where: {
      userId_communityId: { userId, communityId },
    },
    select: { role: true },
  });
  if (!member) return false;
  return member.role === "owner" || member.role === "moderator";
}
