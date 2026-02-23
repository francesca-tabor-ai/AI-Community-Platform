"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create article");
      }
      const article = await res.json();
      router.push(`/articles/${article.slug}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/articles"
          className="text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          ← Back to Knowledge Base
        </Link>
        <h1 className="mt-8 text-3xl font-bold text-slate-900">New Article</h1>
        <p className="mt-2 text-slate-600">Create a new knowledge article.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
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
              placeholder="Article title"
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
              placeholder="Article content (Markdown supported)"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl gradient-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 active:scale-[0.98]"
            >
              {saving ? "Creating…" : "Create Article"}
            </button>
            <Link
              href="/articles"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
