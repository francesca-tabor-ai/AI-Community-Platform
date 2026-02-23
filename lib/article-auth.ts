import { auth } from "@/auth";
import { getCommunityDashboardUserId } from "./community-auth";

/**
 * Get the current user ID for article operations.
 * Uses NextAuth session when available, falls back to community dashboard for dev.
 */
export async function getArticleUserId(): Promise<string | null> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  return getCommunityDashboardUserId();
}
