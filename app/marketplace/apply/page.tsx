import type { Metadata } from "next";
import Link from "next/link";
import BuildAppForm from "../BuildAppForm";

export const metadata: Metadata = {
  title: "Build an App | App Marketplace | AI Community Platform",
  description:
    "Apply to build and publish apps on the AI Community Platform. Join our marketplace and extend communities with powerful integrations.",
};

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 pt-24 pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.06),transparent_50%)]" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-violet-600"
          >
            ← Back to Marketplace
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Build an App
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">
            Apply to publish your integration on the AI Community Platform marketplace. Our team reviews
            all applications to ensure quality and security for our communities.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
              <span className="font-medium text-violet-600">~5 min</span>
              <span className="text-slate-500">to complete</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
              <span className="font-medium text-violet-600">5–7 days</span>
              <span className="text-slate-500">review time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-6">
          <BuildAppForm />
        </div>
      </section>
    </div>
  );
}
