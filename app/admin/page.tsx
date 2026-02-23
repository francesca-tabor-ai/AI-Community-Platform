import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin | AI Community Platform",
  description: "Platform administration",
  robots: "noindex, nofollow",
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const secret = process.env.ADMIN_SECRET;

  // If no secret configured, show setup message
  if (!secret) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-slate-100">
        <div className="mx-auto max-w-lg rounded-xl border border-amber-500/30 bg-amber-500/5 p-8">
          <h1 className="text-xl font-bold text-amber-400">Admin Not Configured</h1>
          <p className="mt-4 text-slate-400">
            Set ADMIN_SECRET in your environment variables to enable the admin
            dashboard.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Example: ADMIN_SECRET=your-secure-random-string
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login form
  if (!token || token !== secret) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <AdminClient mode="login" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminClient mode="dashboard" />
    </div>
  );
}
