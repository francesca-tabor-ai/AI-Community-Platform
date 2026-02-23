import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log In | AI Community Platform",
  description: "Log in to your AI Community Platform account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center">
            <Link href="/" className="text-2xl font-bold text-white">
              AI Community Platform
            </Link>
            <h1 className="mt-8 text-3xl font-bold text-white">Welcome back</h1>
            <p className="mt-2 text-slate-400">
              Log in to access your communities
            </p>
          </div>
          <div className="mt-10">
            <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-slate-800/50" />}>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-teal-400 hover:text-teal-300">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
