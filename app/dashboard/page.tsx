"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Activity = {
  id: string;
  type: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: { name: string | null; profile?: { displayName: string | null } | null };
};

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    Promise.all([
      fetch("/api/dashboard/communities", { credentials: "include", signal: controller.signal }),
      fetch("/api/activity?limit=10", { credentials: "include", signal: controller.signal }),
    ])
      .then(async ([commRes, activityRes]) => {
        if (commRes.status === 401) {
          window.location.href = "/login?callbackUrl=" + encodeURIComponent("/dashboard");
          return;
        }
        const commData = await commRes.json();
        if (Array.isArray(commData)) setCommunities(commData);

        if (activityRes.ok) {
          const { activities: actData } = await activityRes.json();
          setActivities(actData ?? []);
        }
      })
      .catch((err) =>
        setError(err.name === "AbortError" ? "Request timed out. Please try again." : err.message)
      )
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });
  }, []);

  const activityLabel = (a: Activity) => {
    const name = a.user?.profile?.displayName || a.user?.name || "Someone";
    if (a.type === "create_post")
      return (
        <>
          <strong>{name}</strong> created a post
          {a.metadata?.title && `: "${String(a.metadata.title).slice(0, 40)}..."`}
        </>
      );
    if (a.type === "comment") return <><strong>{name}</strong> commented on a post</>;
    if (a.type === "join_community")
      return <><strong>{name}</strong> joined a community</>;
    return <><strong>{name}</strong> did something</>;
  };

  const activityLink = (a: Activity) => {
    if (a.targetType === "post") return `/posts/${a.targetId}`;
    return "/dashboard";
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
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
          <code className="rounded bg-slate-200 px-1">npm run db:seed</code> and
          have memberships as owner or moderator.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-600"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Your communities</h1>
          <p className="mt-1 text-slate-600">
            Select a community to manage members, spaces, posts, and events.
          </p>
        </div>

        {communities.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 border-dashed bg-white p-12 text-center shadow-sm">
          <p className="text-slate-600">No communities to manage yet.</p>
          <p className="mt-2 text-sm text-slate-500">
            Communities you own or moderate will appear here. Create your first community to get started.
          </p>
          <Link
            href="/communities"
            className="mt-6 inline-block rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-violet-600 active:scale-[0.98]"
          >
            Explore communities
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {communities.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/community/${c.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
            >
              {c.imageUrl ? (
                <img
                  src={c.imageUrl}
                  alt=""
                  className="mb-4 h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-xl font-bold text-violet-600">
                  {c.name.charAt(0)}
                </div>
              )}
              <h2 className="font-semibold text-slate-900">{c.name}</h2>
              {c.description && (
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
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

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent activity</h2>
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((a) => (
              <li key={a.id}>
                <Link
                  href={activityLink(a)}
                  className="block rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600 transition-colors hover:border-violet-200 hover:bg-violet-50/50"
                >
                  {activityLabel(a)}
                  <span className="mt-1 block text-xs text-slate-400">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
