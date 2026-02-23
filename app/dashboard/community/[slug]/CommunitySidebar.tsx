"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Calendar,
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
    <nav className="sticky top-24 space-y-1 rounded-xl border border-slate-700/50 bg-slate-800/20 p-2">
      <Link
        href="/dashboard"
        className="mb-3 flex items-center gap-2 rounded-lg px-4 py-2 text-xs text-slate-500 hover:bg-slate-800/50 hover:text-slate-400"
      >
        ← All communities
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
                ? "bg-teal-500/20 text-teal-400"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
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
