"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/app/components/RichTextEditor";

export default function NewPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "publishing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/community/${slug}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save draft");
      }
      const post = await res.json();
      setStatus("idle");
      router.push(`/dashboard/community/${slug}/posts`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setStatus("error");
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setStatus("publishing");
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/community/${slug}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body, status: "published" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to publish");
      }
      const post = await res.json();
      setStatus("idle");
      setShowPublishModal(false);
      router.push(`/dashboard/community/${slug}/posts`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish");
      setStatus("error");
    }
  };

  const openPublishModal = () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError(null);
    setShowPublishModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href={`/dashboard/community/${slug}/posts`}
            className="text-sm text-slate-400 hover:text-teal-400"
          >
            ← Back to posts
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-white">New Post</h1>
          <p className="mt-1 text-slate-400">Create a new post for your community</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-amber-200">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-300">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-full rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Content
          </label>
          <RichTextEditor content={body} onChange={setBody} placeholder="Write your post..." />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={status === "saving" || status === "publishing"}
            className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-teal-500/50 hover:text-teal-400 active:scale-[0.98] disabled:opacity-50"
          >
            {status === "saving" ? "Saving…" : "Save Draft"}
          </button>
          <button
            onClick={openPublishModal}
            disabled={status === "saving" || status === "publishing"}
            className="rounded-xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:bg-teal-400 active:scale-[0.98] disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      {showPublishModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowPublishModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-900 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white">Publish this post?</h3>
            <p className="mt-2 text-slate-400">
              Your post will be visible to community members. You can edit it later.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={status === "publishing"}
                className="flex-1 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-teal-400 disabled:opacity-50"
              >
                {status === "publishing" ? "Publishing…" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
