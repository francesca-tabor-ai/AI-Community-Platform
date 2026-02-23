"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Calendar,
  Plus,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "", icon: LayoutDashboard },
  { label: "Members", href: "members", icon: Users },
  { label: "Spaces", href: "spaces", icon: FolderKanban },
  { label: "Posts", href: "posts", icon: FileText },
  { label: "Events", href: "events", icon: Calendar },
] as const;

export function CommunitySidebar({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/dashboard/community/${slug}`;

  return (
    <nav className="sticky top-24 space-y-1 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      <Link
        href="/dashboard"
        className="mb-3 flex items-center gap-2 rounded-lg px-4 py-2 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        ← All communities
      </Link>
      <Link
        href={`/dashboard/community/${slug}/posts/new`}
        className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-600"
      >
        <Plus className="h-4 w-4" />
        New Post
      </Link>
      {navItems.map(({ label, href, icon: Icon }) => {
        const url = href ? `${base}/${href}` : base;
        const isActive =
          pathname === url ||
          (href && pathname?.startsWith(url));

        return (
          <Link
            key={label}
            href={url}
            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-violet-100 text-violet-700"
                : "text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
