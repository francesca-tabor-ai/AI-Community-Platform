"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Article = {
  id: string;
  slug: string;
  title: string;
  body: string;
  summary: string | null;
  status: string;
};

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [changeSummary, setChangeSummary] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/articles/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load article");
        return res.json();
      })
      .then((data) => {
        setArticle(data);
        setTitle(data.title);
        setBody(data.body);
        setStatus(data.status);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/articles/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          status,
          changeSummary: changeSummary.trim() || "Edited content",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update article");
      }
      setChangeSummary("");
      const updated = await res.json();
      setArticle(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update article");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-amber-800">{error}</p>
          <Link href="/articles" className="mt-4 inline-block text-sm text-violet-600 hover:underline">
            ← Back to Knowledge Base
          </Link>
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href={`/articles/${slug}`}
          className="text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          ← Back to Article
        </Link>
        <h1 className="mt-8 text-3xl font-bold text-slate-900">Edit Article</h1>
        <p className="mt-2 text-slate-600">
          Changes are saved as revisions. You can view revision history below.
        </p>

        <form onSubmit={handleSave} className="mt-10 space-y-6">
          {error && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 shadow-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              required
            />
          </div>
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-slate-700">
              Content
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={16}
              className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 shadow-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div>
            <label htmlFor="changeSummary" className="block text-sm font-medium text-slate-700">
              Change summary (optional)
            </label>
            <input
              id="changeSummary"
              type="text"
              value={changeSummary}
              onChange={(e) => setChangeSummary(e.target.value)}
              className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              placeholder="Brief description of changes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                  className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <span>Draft</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                  className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <span>Published</span>
              </label>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl gradient-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 active:scale-[0.98]"
            >
              {saving ? "Saving…" : "Save (creates revision)"}
            </button>
            <Link
              href={`/articles/${slug}`}
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>

        <section className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="text-lg font-semibold text-slate-900">Revision History</h2>
          <RevisionList slug={slug} />
        </section>
      </div>
    </div>
  );
}

function RevisionList({ slug }: { slug: string }) {
  const [revisions, setRevisions] = useState<Array<{ id: string; createdAt: string; changeSummary: string | null; author: { name: string | null } }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/articles/${slug}/revisions`)
      .then((res) => res.json())
      .then(setRevisions)
      .catch(() => [])
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="mt-4 text-sm text-slate-500">Loading…</p>;
  if (revisions.length === 0) return <p className="mt-4 text-sm text-slate-500">No revisions yet.</p>;

  return (
    <ul className="mt-4 space-y-3">
      {revisions.map((r) => (
        <li key={r.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <span>{r.changeSummary || "Edit"}</span>
          <span className="text-slate-500">
            {new Date(r.createdAt).toLocaleDateString()} by {r.author?.name || "Anonymous"}
          </span>
        </li>
      ))}
    </ul>
  );
}
