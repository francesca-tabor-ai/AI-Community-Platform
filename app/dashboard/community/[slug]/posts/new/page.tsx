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
            className="text-sm text-slate-500 hover:text-violet-600"
          >
            ← Back to posts
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">New Post</h1>
          <p className="mt-1 text-slate-600">Create a new post for your community</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Content
          </label>
          <RichTextEditor content={body} onChange={setBody} placeholder="Write your post..." />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={status === "saving" || status === "publishing"}
            className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-violet-400 hover:text-violet-600 active:scale-[0.98] disabled:opacity-50"
          >
            {status === "saving" ? "Saving…" : "Save Draft"}
          </button>
          <button
            onClick={openPublishModal}
            disabled={status === "saving" || status === "publishing"}
            className="rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-violet-600 active:scale-[0.98] disabled:opacity-50"
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
            className="w-full max-w-md rounded-2xl border border-slate-200/50 bg-slate-50 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900">Publish this post?</h3>
            <p className="mt-2 text-slate-600">
              Your post will be visible to community members. You can edit it later.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={status === "publishing"}
                className="flex-1 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-600 disabled:opacity-50"
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
