"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Post = {
  id: string;
  title: string;
  body: string;
  status: string;
  createdAt: string;
  author: { name: string | null; image: string | null };
};

export default function SpacePage() {
  const params = useParams();
  const slug = params.slug as string;
  const spaceSlug = params.spaceSlug as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [space, setSpace] = useState<{ name: string; description: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/communities/${slug}/spaces/${spaceSlug}/posts`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = `/login?callbackUrl=${encodeURIComponent(`/communities/${slug}/spaces/${spaceSlug}`)}`;
          return;
        }
        const data = await res.json();
        setPosts(data.posts ?? []);
        setSpace(data.space ?? { name: spaceSlug, description: null });
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [slug, spaceSlug]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Link
            href={`/communities/${slug}`}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            ← Back to community
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            #{space?.name ?? spaceSlug}
          </h1>
          {space?.description && (
            <p className="mt-1 text-slate-600">{space.description}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600">No posts in this space yet.</p>
            <Link
              href={`/communities/${slug}/spaces/${spaceSlug}/new`}
              className="mt-4 inline-block text-violet-600 font-medium hover:text-violet-700"
            >
              Create the first post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              href={`/communities/${slug}/spaces/${spaceSlug}/new`}
              className="block rounded-xl border border-dashed border-violet-200 bg-violet-50/50 p-4 text-center text-sm font-medium text-violet-600 hover:bg-violet-50"
            >
              + New post
            </Link>
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-violet-200"
              >
                <h2 className="font-semibold text-slate-900">{post.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                  {post.body.replace(/<[^>]*>/g, "").slice(0, 200)}
                  {post.body.length > 200 ? "..." : ""}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <span>{post.author?.name ?? "Anonymous"}</span>
                  <span>·</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
