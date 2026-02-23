import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | AI Community Platform",
  description: "Create your AI Community Platform account. Start building intelligent communities for free.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2.5 text-2xl font-bold text-slate-900 transition-colors hover:text-violet-600">
              <Image src="/logo.svg" alt="" width={36} height={36} className="shrink-0" />
              AI Community Platform
            </Link>
            <h1 className="mt-8 text-3xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-2 text-slate-600">
              Start building intelligent communities for free
            </p>
          </div>
          <div className="mt-10">
            <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-slate-100" />}>
              <SignupForm />
            </Suspense>
          </div>
          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-violet-600 transition-colors hover:text-violet-700">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
