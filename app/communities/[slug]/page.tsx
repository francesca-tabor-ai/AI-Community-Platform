"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Community = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  visibility: string;
  isMember: boolean;
  spaces: Array<{ id: string; name: string; slug: string; type: string }>;
  _count: { members: number; posts: number };
  owner: { id: string; name: string | null; image: string | null };
};

type Post = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  space: { slug: string; name: string };
};

export default function CommunityPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [community, setCommunity] = useState<Community | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetch(`/api/communities/${slug}`, { credentials: "include", signal: controller.signal }),
      fetch(`/api/communities/${slug}/posts?limit=5`, { credentials: "include", signal: controller.signal }),
    ])
      .then(async ([commRes, postsRes]) => {
        if (commRes.status === 401) {
          window.location.href = `/login?callbackUrl=${encodeURIComponent(`/communities/${slug}`)}`;
          return;
        }
        if (commRes.status === 403 || commRes.status === 404) {
          setCommunity(null);
          return;
        }
        const commData = await commRes.json();
        setCommunity(commData);

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setRecentPosts(postsData.posts ?? postsData ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [slug]);

  const handleJoin = async () => {
    if (!community || community.isMember) return;
    setJoining(true);
    try {
      const res = await fetch(`/api/communities/${slug}/join`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setCommunity((c) => (c ? { ...c, isMember: true } : c));
      }
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Community not found</h1>
        <p className="mt-2 text-slate-600">This community may be private or doesn&apos;t exist.</p>
        <Link
          href="/communities"
          className="mt-6 inline-block text-violet-600 font-medium hover:text-violet-700"
        >
          Browse communities
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-6">
              {community.imageUrl ? (
                <img
                  src={community.imageUrl}
                  alt=""
                  className="h-20 w-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100 text-3xl font-bold text-violet-600">
                  {community.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{community.name}</h1>
                {community.description && (
                  <p className="mt-1 text-slate-600">{community.description}</p>
                )}
                <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                  <span>{community._count.members} members</span>
                  <span>{community._count.posts} posts</span>
                </div>
              </div>
            </div>
            {!community.isMember ? (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-600 disabled:opacity-50"
              >
                {joining ? "Joining..." : "Join community"}
              </button>
            ) : (
              <Link
                href={`/communities/${slug}/spaces/general`}
                className="rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-600"
              >
                Enter community
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">Spaces</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {community.spaces.map((space) => (
                <Link
                  key={space.id}
                  href={`/communities/${slug}/spaces/${space.slug}`}
                  className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-violet-200 hover:bg-violet-50/50"
                >
                  <span className="font-medium text-slate-900">#{space.name}</span>
                  <p className="mt-1 text-sm text-slate-500">{space.type}</p>
                </Link>
              ))}
            </div>
            {community.spaces.length === 0 && community.isMember && (
              <p className="text-sm text-slate-500">No spaces yet. Admins can create spaces.</p>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent posts</h2>
            {recentPosts.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No posts yet</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {recentPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/posts/${post.id}`}
                      className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-violet-200"
                    >
                      <span className="font-medium text-slate-900">{post.title}</span>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {post.body.replace(/<[^>]*>/g, "").slice(0, 120)}...
                      </p>
                      <span className="mt-2 text-xs text-slate-400">
                        #{post.space.name} · {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
