"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Space = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: string;
  _count: { posts: number };
};

const typeLabels: Record<string, string> = {
  general: "General",
  announcements: "Announcements",
  questions: "Q&A",
};

export default function CommunitySpacesPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/dashboard/community/${slug}/spaces`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load spaces");
        return res.json();
      })
      .then(setSpaces)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
        <p className="text-amber-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Spaces</h1>
        <p className="mt-1 text-slate-400">
          Channels and discussion spaces within this community
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {spaces.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-slate-700/50 bg-slate-800/20 p-6 transition-all hover:border-slate-600/60"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white">{s.name}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  {typeLabels[s.type] ?? s.type}
                </p>
                {s.description && (
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                    {s.description}
                  </p>
                )}
              </div>
              <span className="rounded-lg bg-slate-700/50 px-3 py-1 text-sm text-slate-400">
                {s._count.posts} posts
              </span>
            </div>
          </div>
        ))}
      </div>

      {spaces.length === 0 && (
        <div className="rounded-2xl border border-slate-700/50 border-dashed bg-slate-800/20 p-12 text-center">
          <p className="text-slate-400">No spaces yet.</p>
        </div>
      )}
    </div>
  );
}
