"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

type PendingRevision = {
  id: string;
  body: string;
  changeSummary: string | null;
  createdAt: string;
  article: {
    id: string;
    slug: string;
    title: string;
    community: { name: string; slug: string } | null;
  };
  author: {
    id: string;
    name: string | null;
    profile: { displayName: string | null } | null;
  };
};

export default function ModerationPage() {
  const [revisions, setRevisions] = useState<PendingRevision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const loadRevisions = () => {
    setLoading(true);
    fetch("/api/moderation/revisions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load revisions");
        return res.json();
      })
      .then(setRevisions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRevisions();
  }, []);

  const approveRevision = async (articleSlug: string, revisionId: string) => {
    setApprovingId(revisionId);
    try {
      const res = await fetch(
        `/api/articles/${articleSlug}/revisions/${revisionId}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Failed to approve");
      loadRevisions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Moderation Queue</h1>
        <p className="mt-1 text-slate-600">
          Pending article revisions awaiting approval
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {revisions.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Link
                  href={`/articles/${r.article.slug}`}
                  className="font-semibold text-slate-900 hover:text-violet-600"
                >
                  {r.article.title}
                </Link>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>
                    by {r.author.profile?.displayName || r.author.name || "Anonymous"}
                  </span>
                  <span>•</span>
                  <span>{format(new Date(r.createdAt), "MMM d, yyyy HH:mm")}</span>
                  {r.article.community && (
                    <>
                      <span>•</span>
                      <span>{r.article.community.name}</span>
                    </>
                  )}
                </div>
                {r.changeSummary && (
                  <p className="mt-2 text-sm text-slate-600">{r.changeSummary}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-3">
                <Link
                  href={`/articles/${r.article.slug}/edit`}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => approveRevision(r.article.slug, r.id)}
                  disabled={approvingId === r.id}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
                >
                  {approvingId === r.id ? "Approving…" : "Approve"}
                </button>
              </div>
            </div>
            <div className="mt-4 max-h-32 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
              <pre className="whitespace-pre-wrap font-sans">{r.body.slice(0, 500)}{r.body.length > 500 ? "…" : ""}</pre>
            </div>
          </div>
        ))}
      </div>

      {revisions.length === 0 && !error && (
        <div className="rounded-2xl border border-slate-200 border-dashed bg-white p-12 text-center shadow-sm">
          <p className="text-slate-600">No pending revisions.</p>
          <p className="mt-2 text-sm text-slate-500">
            Revisions will appear here when communities require approval for article edits.
          </p>
        </div>
      )}
    </div>
  );
}
