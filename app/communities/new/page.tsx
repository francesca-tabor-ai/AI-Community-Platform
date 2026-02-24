"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200";

export default function NewCommunityPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const res = await fetch("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
        visibility,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus("idle");
      setError(data.error ?? "Failed to create community");
      return;
    }

    router.push(`/communities/${data.slug}`);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-xl px-6 py-12">
        <Link
          href="/communities"
          className="mb-6 inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to communities
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Create a community</h1>
        <p className="mt-1 text-slate-600">
          Set up your community and invite members
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Community name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputClass}
              placeholder="My Awesome Community"
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
              URL slug
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputClass}
              placeholder="my-awesome-community"
            />
            <p className="mt-1 text-xs text-slate-500">
              Used in the URL: /communities/{slug || "..."}
            </p>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="What is this community about?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Visibility
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={() => setVisibility("public")}
                  className="text-violet-500"
                />
                <span className="text-sm">Public – Anyone can discover and join</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={() => setVisibility("private")}
                  className="text-violet-500"
                />
                <span className="text-sm">Private – Invite only</span>
              </label>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-600 disabled:opacity-50"
            >
              {status === "submitting" ? "Creating..." : "Create community"}
            </button>
            <Link
              href="/communities"
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
