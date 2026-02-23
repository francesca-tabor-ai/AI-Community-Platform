"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Users,
  FolderKanban,
  FileText,
  Calendar,
  TrendingUp,
} from "lucide-react";

type Stats = {
  community: { id: string; name: string; slug: string };
  memberCount: number;
  spaceCount: number;
  postCount: number;
  eventCount: number;
  newMembersThisWeek: number;
};

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/20 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export default function CommunityOverviewPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/dashboard/community/${slug}/stats`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load stats");
        return res.json();
      })
      .then(setStats)
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

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
        <p className="text-amber-200">{error || "Failed to load community stats"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{stats.community.name}</h1>
        <p className="mt-1 text-slate-400">Overview and metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Members"
          value={stats.memberCount}
          icon={Users}
          sub={stats.newMembersThisWeek > 0 ? `+${stats.newMembersThisWeek} this week` : undefined}
        />
        <StatCard label="Spaces" value={stats.spaceCount} icon={FolderKanban} />
        <StatCard label="Published posts" value={stats.postCount} icon={FileText} />
        <StatCard label="Events" value={stats.eventCount} icon={Calendar} />
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/20 p-6">
        <h2 className="flex items-center gap-2 font-semibold text-white">
          <TrendingUp className="h-5 w-5 text-teal-400" />
          Quick stats
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          {stats.newMembersThisWeek > 0 ? (
            <>
              <span className="text-teal-400">{stats.newMembersThisWeek}</span> new member
              {stats.newMembersThisWeek !== 1 ? "s" : ""} joined in the last 7 days.
            </>
          ) : (
            "No new members in the last 7 days."
          )}
        </p>
      </div>
    </div>
  );
}
