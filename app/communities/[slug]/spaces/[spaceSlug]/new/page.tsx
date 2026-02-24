"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/app/components/RichTextEditor";

export default function NewPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const spaceSlug = params.spaceSlug as string;
  const [communityId, setCommunityId] = useState<string | null>(null);
  const [spaceId, setSpaceId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/communities/${slug}/spaces`, { credentials: "include" })
      .then((res) => res.json())
      .then((spaces: Array<{ id: string; slug: string }>) => {
        const space = spaces.find((s) => s.slug === spaceSlug);
        if (space) {
          setSpaceId(space.id);
        }
      });

    fetch(`/api/communities/${slug}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) setCommunityId(data.id);
      });
  }, [slug, spaceSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !communityId || !spaceId) {
      setError("Please fill in the title");
      return;
    }
    setStatus("submitting");
    setError(null);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        communityId,
        spaceId,
        title: title.trim(),
        body,
        status: "published",
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus("idle");
      setError(data.error ?? "Failed to create post");
      return;
    }

    router.push(`/posts/${data.id}`);
    router.refresh();
  };

  if (!communityId || !spaceId) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href={`/communities/${slug}/spaces/${spaceSlug}`}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to #{spaceSlug}
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">New post</h1>
        <p className="mt-1 text-slate-600">Share with the community</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200"
              placeholder="What's on your mind?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Content</label>
            <RichTextEditor content={body} onChange={setBody} placeholder="Write your post..." />
          </div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-600 disabled:opacity-50"
          >
            {status === "submitting" ? "Publishing..." : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}
