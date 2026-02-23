"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";

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
      <div className="space-y-8">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-5 w-64" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      m.role === "owner"
                        ? "owner"
                        : m.role === "moderator"
                          ? "moderator"
                          : "secondary"
                    }
                  >
                    {m.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-400">
                  {format(new Date(m.joinedAt), "MMM d, yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
