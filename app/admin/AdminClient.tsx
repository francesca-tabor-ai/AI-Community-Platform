"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Submission = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  role: string | null;
  inquiryType: string;
  communitySize: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

type Stats = {
  users: number;
  communities: number;
  contactSubmissions: number;
  unreadSubmissions: number;
  submissionsLast24h: number;
};

const INQUIRY_LABELS: Record<string, string> = {
  "customer-support": "Customer Support",
  "bug-report": "Bug Report",
  sales: "Sales",
  demo: "Demo Request",
  enterprise: "Enterprise",
  partnership: "Partnership",
  general: "General",
};

export default function AdminClient({
  mode,
}: {
  mode: "login" | "dashboard";
}) {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(
    null
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const [dataError, setDataError] = useState<string | null>(null);

  const fetchStats = async () => {
    setDataError(null);
    const res = await fetch("/api/admin/stats");
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    } else {
      const err = await res.json().catch(() => ({}));
      setDataError(err.error || "Failed to load stats. Ensure DATABASE_URL is configured.");
    }
  };

  const fetchSubmissions = async () => {
    setLoadingData(true);
    setDataError(null);
    try {
      const url = `/api/admin/submissions?limit=50${filterUnread ? "&unread=true" : ""}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions);
        setUnreadCount(data.unreadCount);
      } else {
        const err = await res.json().catch(() => ({}));
        setDataError(err.error || "Failed to load submissions.");
      }
    } finally {
      setLoadingData(false);
    }
  };

  const markAsRead = async (id: string) => {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    if (res.ok) {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, read: true } : s))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission((s) => (s ? { ...s, read: true } : null));
      }
      if (stats) {
        setStats({ ...stats, unreadSubmissions: Math.max(0, stats.unreadSubmissions - 1) });
      }
    }
  };

  const handleLogout = () => {
    document.cookie =
      "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.refresh();
  };

  useEffect(() => {
    if (mode === "dashboard") {
      fetchStats();
      fetchSubmissions();
    }
  }, [mode, filterUnread]);

  if (mode === "login") {
    return (
      <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-800/30 p-8">
        <h1 className="text-2xl font-bold text-white">Admin Login</h1>
        <p className="mt-2 text-slate-400">
          Enter your admin key to access the dashboard.
        </p>
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="key"
              className="block text-sm font-medium text-slate-300"
            >
              Admin Key
            </label>
            <input
              id="key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Enter admin secret"
              required
            />
          </div>
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-slate-950 hover:bg-teal-400 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-800/50 bg-slate-950/95 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-slate-800/50 hover:text-white"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Data error */}
        {dataError && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-amber-200">
            {dataError} Run <code className="rounded bg-slate-800 px-1">npm run db:push</code> after setting DATABASE_URL.
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Users" value={stats.users} />
            <StatCard label="Communities" value={stats.communities} />
            <StatCard label="Contact Submissions" value={stats.contactSubmissions} />
            <StatCard
              label="Unread"
              value={stats.unreadSubmissions}
              highlight={stats.unreadSubmissions > 0}
            />
            <StatCard label="Last 24h" value={stats.submissionsLast24h} />
          </div>
        )}

        {/* Submissions */}
        <section className="rounded-2xl border border-slate-700/50 bg-slate-800/20">
          <div className="flex items-center justify-between border-b border-slate-700/50 px-6 py-4">
            <h2 className="font-semibold text-white">Contact Submissions</h2>
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={filterUnread}
                onChange={(e) => setFilterUnread(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500"
              />
              Unread only
            </label>
          </div>
          <div className="flex min-h-[400px]">
            <div className="w-1/2 overflow-y-auto border-r border-slate-700/50">
              {loadingData ? (
                <div className="flex items-center justify-center p-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                </div>
              ) : submissions.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No submissions yet.
                </div>
              ) : (
                <ul className="divide-y divide-slate-700/50">
                  {submissions.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => {
                          setSelectedSubmission(s);
                          if (!s.read) markAsRead(s.id);
                        }}
                        className={`w-full px-6 py-4 text-left transition-colors hover:bg-slate-800/50 ${
                          selectedSubmission?.id === s.id
                            ? "bg-slate-800/70"
                            : ""
                        } ${!s.read ? "bg-teal-500/5" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-white">
                              {s.firstName} {s.lastName}
                            </p>
                            <p className="truncate text-sm text-slate-400">
                              {s.email}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {INQUIRY_LABELS[s.inquiryType] || s.inquiryType} •{" "}
                              {new Date(s.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {!s.read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="w-1/2 p-6">
              {selectedSubmission ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {selectedSubmission.firstName}{" "}
                        {selectedSubmission.lastName}
                      </h3>
                      <a
                        href={`mailto:${selectedSubmission.email}`}
                        className="text-teal-400 hover:text-teal-300"
                      >
                        {selectedSubmission.email}
                      </a>
                      <p className="mt-1 text-sm text-slate-500">
                        {INQUIRY_LABELS[selectedSubmission.inquiryType]} •{" "}
                        {new Date(selectedSubmission.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!selectedSubmission.read && (
                      <button
                        onClick={() => markAsRead(selectedSubmission.id)}
                        className="rounded-lg border border-slate-600 px-3 py-1 text-xs text-slate-400 hover:bg-slate-800"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  {(selectedSubmission.company ||
                    selectedSubmission.role ||
                    selectedSubmission.communitySize) && (
                    <div className="text-sm text-slate-400">
                      {selectedSubmission.company && (
                        <p>Company: {selectedSubmission.company}</p>
                      )}
                      {selectedSubmission.role && (
                        <p>Role: {selectedSubmission.role}</p>
                      )}
                      {selectedSubmission.communitySize && (
                        <p>Community size: {selectedSubmission.communitySize}</p>
                      )}
                    </div>
                  )}
                  <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-4">
                    <p className="whitespace-pre-wrap text-slate-300">
                      {selectedSubmission.message}
                    </p>
                  </div>
                  <a
                    href={`mailto:${selectedSubmission.email}?subject=Re: Your inquiry`}
                    className="inline-block rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-teal-400"
                  >
                    Reply via email
                  </a>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  Select a submission to view details
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quick links */}
        <div className="mt-8 rounded-xl border border-slate-700/50 bg-slate-800/20 p-6">
          <h3 className="font-medium text-white">Admin Resources</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href="https://resend.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300"
              >
                Resend Dashboard
              </a>
              <span className="text-slate-500"> — Contact form emails</span>
            </li>
            <li>
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300"
              >
                Stripe Dashboard
              </a>
              <span className="text-slate-500"> — Payments</span>
            </li>
            <li>
              <span className="text-slate-400">Prisma Studio</span>
              <span className="text-slate-500">
                {" "}
                — Run <code className="rounded bg-slate-800 px-1">npm run db:studio</code> for database access
              </span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-6 ${
        highlight
          ? "border-teal-500/30 bg-teal-500/5"
          : "border-slate-700/50 bg-slate-800/20"
      }`}
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
