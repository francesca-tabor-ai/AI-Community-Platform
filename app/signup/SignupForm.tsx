"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200";

export default function SignupForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("submitting");
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setStatus("idle");
          setError(data.error ?? "Failed to create account");
          return;
        }

        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setStatus("idle");
          setError("Account created. Please log in.");
          router.push("/login");
          return;
        }

        router.push(callbackUrl);
        router.refresh();
      }}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={inputClass}
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
          placeholder="••••••••"
        />
        <p className="mt-1 text-xs text-slate-600">
          At least 8 characters
        </p>
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-violet-500 py-3.5 text-base font-semibold text-white transition-colors hover:bg-violet-600 disabled:opacity-50"
      >
        {status === "submitting" ? "Creating account..." : "Create account"}
      </button>
      <p className="text-center text-xs text-slate-600">
        By signing up, you agree to our{" "}
        <a href="/legal/terms" className="font-medium text-violet-600 transition-colors hover:text-violet-700">Terms</a>
        {" "}and{" "}
        <a href="/legal/privacy" className="font-medium text-violet-600 transition-colors hover:text-violet-700">Privacy Policy</a>.
      </p>
    </form>
  );
}
