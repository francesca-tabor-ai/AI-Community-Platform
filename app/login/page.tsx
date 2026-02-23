import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log In | AI Community Platform",
  description: "Log in to your AI Community Platform account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2.5 text-2xl font-bold text-slate-900 transition-colors hover:text-violet-600">
              <Image src="/logo.svg" alt="" width={36} height={36} className="shrink-0" />
              AI Community Platform
            </Link>
            <h1 className="mt-8 text-3xl font-bold text-slate-900">Welcome back</h1>
            <p className="mt-2 text-slate-600">
              Log in to access your communities
            </p>
          </div>
          <div className="mt-10">
            <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-slate-100" />}>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-8 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-violet-600 transition-colors hover:text-violet-700">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
