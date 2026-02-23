import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | AI Community Platform",
  description: "Terms of Service for the AI Community Platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <article className="mx-auto max-w-3xl px-6 py-24">
        <Link
          href="/"
          className="text-sm font-medium text-teal-400 hover:text-teal-300"
        >
          ← Back to Home
        </Link>
        <h1 className="mt-6 text-4xl font-bold text-white">Terms of Service</h1>
        <p className="mt-4 text-slate-500">Last updated: February 2025</p>
        <div className="mt-10 space-y-6 text-slate-400">
          <p>
            Welcome to AI Community Platform. By using our platform, you agree to
            these Terms of Service.
          </p>
          <p>
            Please contact us at{" "}
            <a
              href="mailto:info@francescatabor.com"
              className="text-teal-400 hover:text-teal-300"
            >
              info@francescatabor.com
            </a>{" "}
            for the full terms of service or if you have any questions.
          </p>
          <Link
            href="/contact"
            className="inline-block text-teal-400 hover:text-teal-300"
          >
            Contact us for full terms →
          </Link>
        </div>
      </article>
    </div>
  );
}
