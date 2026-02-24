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
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-amber-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Spaces</h1>
        <p className="mt-1 text-slate-600">
          Channels and discussion spaces within this community
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {spaces.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-violet-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{s.name}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {typeLabels[s.type] ?? s.type}
                </p>
                {s.description && (
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                    {s.description}
                  </p>
                )}
              </div>
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-600">
                {s._count.posts} posts
              </span>
            </div>
          </div>
        ))}
      </div>

      {spaces.length === 0 && (
        <div className="rounded-2xl border border-slate-200 border-dashed bg-white p-12 text-center">
          <p className="text-slate-500">No spaces yet.</p>
        </div>
      )}
    </div>
  );
}
