"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";

type Member = {
  id: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    email: string | null;
    name: string | null;
    image: string | null;
    profile: { displayName: string | null } | null;
  };
};

const roleColors: Record<string, string> = {
  owner: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  moderator: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  member: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function CommunityMembersPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/dashboard/community/${slug}/members`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load members");
        return res.json();
      })
      .then(setMembers)
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
        <h1 className="text-3xl font-bold text-white">Members</h1>
        <p className="mt-1 text-slate-400">{members.length} members in this community</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Member</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-slate-700/30 transition-colors hover:bg-slate-800/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {m.user.image ? (
                        <img
                          src={m.user.image}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/20 text-sm font-medium text-teal-400">
                          {(m.user.profile?.displayName || m.user.name || m.user.email || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">
                          {m.user.profile?.displayName || m.user.name || "Unknown"}
                        </p>
                        {m.user.email && (
                          <p className="text-sm text-slate-500">{m.user.email}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        roleColors[m.role] ?? roleColors.member
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {format(new Date(m.joinedAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
