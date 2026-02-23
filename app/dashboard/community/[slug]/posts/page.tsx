"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";

type Post = {
  id: string;
  title: string;
  body: string;
  type: string;
  status: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    email: string | null;
    profile: { displayName: string | null } | null;
  };
  space: { id: string; name: string; slug: string };
};

export default function CommunityPostsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/dashboard/community/${slug}/posts`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load posts");
        return res.json();
      })
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-amber-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Posts</h1>
          <p className="mt-1 text-slate-400">All posts in this community</p>
        </div>
        <Link
          href={`/dashboard/community/${slug}/posts/new`}
          className="shrink-0 rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-violet-600 active:scale-[0.98]"
        >
          New Post
        </Link>
      </div>

      <div className="space-y-4">
        {posts.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">{p.body}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>{p.space.name}</span>
                  <span>•</span>
                  <span>
                    {p.author.profile?.displayName || p.author.name || "Anonymous"}
                  </span>
                  <span>•</span>
                  <span>{format(new Date(p.createdAt), "MMM d, yyyy")}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      p.status === "published"
                        ? "bg-violet-100 text-violet-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="text-slate-500">{p.type}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="rounded-2xl border border-slate-200 border-dashed bg-white p-12 text-center shadow-sm">
          <p className="text-slate-400">No posts yet. Start writing your first post!</p>
          <p className="mt-2 text-sm text-slate-500">
            Create a post to share with your community members.
          </p>
          <Link
            href={`/dashboard/community/${slug}/posts/new`}
            className="mt-6 inline-block rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-violet-600 active:scale-[0.98]"
          >
            New Post
          </Link>
        </div>
      )}
    </div>
  );
}
