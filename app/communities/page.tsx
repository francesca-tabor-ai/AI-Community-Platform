"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Community = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  visibility: string;
  isMember: boolean;
  _count: { members: number; spaces: number; posts: number };
};

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const url = new URL("/api/communities", window.location.origin);
    if (search) url.searchParams.set("q", search);

    fetch(url, { credentials: "include", signal: controller.signal })
      .then((res) => {
        if (res.status === 401) {
          window.location.href = `/login?callbackUrl=${encodeURIComponent("/communities")}`;
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setCommunities(data);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setSearch((prev) => prev);
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Discover communities</h1>
            <p className="mt-1 text-slate-600">
              Find and join communities that match your interests
            </p>
          </div>
          <Link
            href="/communities/new"
            className="inline-flex items-center justify-center rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-600"
          >
            Create community
          </Link>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200"
          />
        </form>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          </div>
        ) : communities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600">
              {search ? "No communities match your search." : "No public communities yet."}
            </p>
            {!search && (
              <Link
                href="/communities/new"
                className="mt-4 inline-block text-violet-600 font-medium hover:text-violet-700"
              >
                Create the first community
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((c) => (
              <Link
                key={c.id}
                href={`/communities/${c.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
              >
                {c.imageUrl ? (
                  <img
                    src={c.imageUrl}
                    alt=""
                    className="mb-4 h-14 w-14 rounded-xl object-cover"
                  />
                ) : (
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 text-2xl font-bold text-violet-600">
                    {c.name.charAt(0)}
                  </div>
                )}
                <h2 className="font-semibold text-slate-900 group-hover:text-violet-600">
                  {c.name}
                </h2>
                {c.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {c.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                  <span>{c._count.members} members</span>
                  <span>{c._count.spaces} spaces</span>
                  <span>{c._count.posts} posts</span>
                  {c.isMember && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-violet-700">
                      Member
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
