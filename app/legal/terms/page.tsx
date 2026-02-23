import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | AI Community Platform",
  description: "Terms of Service for the AI Community Platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <article className="mx-auto max-w-3xl px-6 py-24">
        <Link
          href="/"
          className="text-sm font-medium text-violet-600 transition-colors hover:text-violet-700"
        >
          ← Back to Home
        </Link>
        <h1 className="mt-6 text-4xl font-bold text-slate-900">Terms of Service</h1>
        <p className="mt-4 text-slate-600">Last updated: February 2025</p>
        <div className="mt-10 space-y-6 text-slate-600">
          <p className="leading-relaxed">
            Welcome to AI Community Platform. By using our platform, you agree to
            these Terms of Service.
          </p>
          <p className="leading-relaxed">
            Please contact us at{" "}
            <a
              href="mailto:info@francescatabor.com"
              className="font-medium text-violet-600 transition-colors hover:text-violet-700"
            >
              info@francescatabor.com
            </a>{" "}
            for the full terms of service or if you have any questions.
          </p>
          <Link
            href="/contact"
            className="inline-block font-medium text-violet-600 transition-colors hover:text-violet-700"
          >
            Contact us for full terms →
          </Link>
        </div>
      </article>
    </div>
  );
}
