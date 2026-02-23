"use client";

import { useEffect, useRef } from "react";
import { analytics } from "./client";

type PostViewOptions = {
  postId: string;
  creatorId: string;
  postTitle?: string;
  userId?: string | null;
};

/**
 * Hook to track post views with time-on-page and scroll depth.
 * Fires post_viewed on unmount or visibility change (tab close/away).
 */
export function usePostView(options: PostViewOptions) {
  const { postId, creatorId, postTitle, userId } = options;
  const startRef = useRef(Date.now());
  const maxScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const pct = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
      maxScrollRef.current = Math.max(maxScrollRef.current, pct);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const sendView = () => {
      const timeOnPage = Math.round((Date.now() - startRef.current) / 1000);
      analytics.postViewed({
        post_id: postId,
        creator_id: creatorId,
        post_title: postTitle,
        time_on_page_seconds: timeOnPage,
        scroll_depth_percentage: maxScrollRef.current,
        user_id: userId,
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendView();
      }
    };

    const handleBeforeUnload = () => {
      sendView();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sendView();
    };
  }, [postId, creatorId, postTitle, userId]);
}
