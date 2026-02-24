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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";

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
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {sub && <p className="text-xs text-slate-500">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
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
      <div className="space-y-8">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-5 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-amber-800">{error || "Failed to load community stats"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{stats.community.name}</h1>
        <p className="mt-1 text-slate-600">Overview and metrics</p>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-violet-500" />
            Quick stats
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
        <p className="mt-2 text-sm text-slate-600">
          {stats.newMembersThisWeek > 0 ? (
            <>
              <span className="text-violet-600">{stats.newMembersThisWeek}</span> new member
              {stats.newMembersThisWeek !== 1 ? "s" : ""} joined in the last 7 days.
            </>
          ) : (
            "No new members in the last 7 days."
          )}
        </p>
        </CardContent>
      </Card>
    </div>
  );
}
