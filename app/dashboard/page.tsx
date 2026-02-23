"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Community = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  visibility: string;
  _count: { members: number; spaces: number; posts: number };
};

export default function DashboardPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/communities")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load communities");
        return res.json();
      })
      .then(setCommunities)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
        <h2 className="font-semibold text-amber-200">Unable to load communities</h2>
        <p className="mt-2 text-sm text-slate-400">{error}</p>
        <p className="mt-4 text-sm text-slate-500">
          Make sure you&apos;ve run{" "}
          <code className="rounded bg-slate-800 px-1">npm run db:seed</code> and
          have memberships as owner or moderator.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-teal-400"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Your communities</h1>
        <p className="mt-1 text-slate-400">
          Select a community to manage members, spaces, posts, and events.
        </p>
      </div>

      {communities.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/50 border-dashed bg-slate-800/20 p-12 text-center">
          <p className="text-slate-400">No communities to manage yet.</p>
          <p className="mt-2 text-sm text-slate-500">
            Communities you own or moderate will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/community/${c.slug}`}
              className="rounded-2xl border border-slate-700/50 bg-slate-800/20 p-6 transition-all hover:-translate-y-0.5 hover:border-teal-500/30 hover:bg-slate-800/40"
            >
              {c.imageUrl ? (
                <img
                  src={c.imageUrl}
                  alt=""
                  className="mb-4 h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/20 text-xl font-bold text-teal-400">
                  {c.name.charAt(0)}
                </div>
              )}
              <h2 className="font-semibold text-white">{c.name}</h2>
              {c.description && (
                <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                  {c.description}
                </p>
              )}
              <div className="mt-4 flex gap-4 text-xs text-slate-500">
                <span>{c._count.members} members</span>
                <span>{c._count.spaces} spaces</span>
                <span>{c._count.posts} posts</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
