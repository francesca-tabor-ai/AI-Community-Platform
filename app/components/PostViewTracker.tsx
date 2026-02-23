"use client";

import { usePostView } from "@/lib/analytics";

type Props = {
  postId: string;
  creatorId: string;
  postTitle?: string;
  userId?: string | null;
  children: React.ReactNode;
};

/**
 * Wraps content to track post views with time-on-page and scroll depth.
 * Use around article content on post detail pages.
 */
export function PostViewTracker({ postId, creatorId, postTitle, userId, children }: Props) {
  usePostView({ postId, creatorId, postTitle, userId });
  return <>{children}</>;
}
