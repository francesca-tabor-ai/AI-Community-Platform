"use client";

import { useState } from "react";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

export default function SignupForm() {
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
        <label htmlFor="name" className="block text-sm font-medium text-slate-300">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className={inputClass}
          placeholder="Your name"
        />
      </div>
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
        <label htmlFor="password" className="block text-sm font-medium text-slate-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className={inputClass}
          placeholder="••••••••"
        />
        <p className="mt-1 text-xs text-slate-500">
          At least 8 characters
        </p>
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-teal-500 py-3.5 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400 disabled:opacity-50"
      >
        {status === "submitting" ? "Creating account..." : "Create account"}
      </button>
      <p className="text-center text-xs text-slate-500">
        By signing up, you agree to our{" "}
        <a href="/legal/terms" className="text-teal-400 hover:text-teal-300">Terms</a>
        {" "}and{" "}
        <a href="/legal/privacy" className="text-teal-400 hover:text-teal-300">Privacy Policy</a>.
      </p>
    </form>
  );
}
