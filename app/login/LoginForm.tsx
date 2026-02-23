"use client";

import { useState } from "react";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

export default function LoginForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("submitting");
        // Placeholder - wire to your auth (e.g. NextAuth, Clerk)
        setTimeout(() => setStatus("idle"), 1000);
      }}
      className="space-y-6"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
          placeholder="you@company.com"
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-slate-300">
            Password
          </label>
          <a href="#" className="text-sm text-teal-400 hover:text-teal-300">
            Forgot password?
          </a>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          className={inputClass}
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-teal-500 py-3.5 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400 disabled:opacity-50"
      >
        {status === "submitting" ? "Signing in..." : "Log in"}
      </button>
    </form>
  );
}
