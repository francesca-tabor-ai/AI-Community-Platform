import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800/50 bg-slate-950/95 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xl font-bold text-white hover:text-teal-400 transition-colors"
          >
            Community Dashboard
          </Link>
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
