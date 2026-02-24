"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CommunitySettingsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [community, setCommunity] = useState<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    visibility: string;
    isOwner?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  useEffect(() => {
    fetch(`/api/communities/${slug}`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 403 || res.status === 404) return null;
        return res.json();
      })
      .then((data) => {
        if (data) {
          setCommunity(data);
          setName(data.name);
          setDescription(data.description ?? "");
          setVisibility(data.visibility ?? "public");
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/communities/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, visibility }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Failed to update");
    } else {
      setCommunity(data);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!community || !community.isOwner) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-xl font-bold text-slate-900">Access denied</h1>
        <p className="mt-2 text-slate-600">Only community owners can access settings.</p>
        <Link href={`/communities/${slug}`} className="mt-6 inline-block text-violet-600 hover:text-violet-700">
          Back to community
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-xl px-6 py-12">
        <Link
          href={`/communities/${slug}`}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to community
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Community settings</h1>
        <p className="mt-1 text-slate-600">Manage your community</p>

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200"
            />
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
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Visibility</label>
            <div className="mt-2 flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={() => setVisibility("public")}
                />
                Public
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={() => setVisibility("private")}
                />
                Private
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-600 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
