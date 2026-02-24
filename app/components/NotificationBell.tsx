"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Notification = {
  id: string;
  type: string;
  targetId: string;
  title: string | null;
  message: string | null;
  read: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = () => {
    fetch("/api/notifications?limit=10", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.notifications) setNotifications(data.notifications);
        if (typeof data?.unreadCount === "number") setUnreadCount(data.unreadCount);
      });
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH", credentials: "include" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    setLoading(true);
    await fetch("/api/notifications/read-all", { method: "PATCH", credentials: "include" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    setLoading(false);
  };

  const getLink = (n: Notification) => {
    if (n.type === "new_comment" || n.type === "new_post") return `/posts/${n.targetId}`;
    if (n.type === "member_join") return "/dashboard";
    return "/dashboard";
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="font-semibold text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={loading}
                  className="text-xs text-violet-600 hover:text-violet-700 disabled:opacity-50"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={getLink(n)}
                    onClick={() => {
                      if (!n.read) handleMarkRead(n.id);
                      setOpen(false);
                    }}
                    className={`block border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50 ${
                      !n.read ? "bg-violet-50/50" : ""
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900">
                      {n.title || "Notification"}
                    </p>
                    {n.message && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
                        {n.message}
                      </p>
                    )}
                    <span className="mt-1 text-xs text-slate-400">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
