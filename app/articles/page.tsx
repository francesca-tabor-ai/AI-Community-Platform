"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  status: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    profile: { displayName: string | null } | null;
  };
  community: { id: string; name: string; slug: string } | null;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/articles?status=published")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load articles");
        return res.json();
      })
      .then(setArticles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-amber-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Knowledge Base
            </h1>
            <p className="mt-1 text-slate-600">
              Collaborative, AI-enhanced articles
            </p>
          </div>
          <Link
            href="/articles/new"
            className="shrink-0 rounded-xl gradient-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-violet-500/30 active:scale-[0.98]"
          >
            New Article
          </Link>
        </div>

        <div className="mt-12 space-y-6">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/articles/${a.slug}`}
              className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">{a.title}</h3>
              {a.summary && (
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{a.summary}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>{a.author?.profile?.displayName || a.author?.name || "Anonymous"}</span>
                <span>•</span>
                <span>{format(new Date(a.updatedAt), "MMM d, yyyy")}</span>
                {a.community && (
                  <>
                    <span>•</span>
                    <span>{a.community.name}</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="mt-12 rounded-2xl border border-slate-200 border-dashed bg-slate-50 p-12 text-center">
            <p className="text-slate-600">No articles yet.</p>
            <p className="mt-2 text-sm text-slate-500">
              Create the first knowledge article to get started.
            </p>
            <Link
              href="/articles/new"
              className="mt-6 inline-block rounded-xl gradient-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              New Article
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
