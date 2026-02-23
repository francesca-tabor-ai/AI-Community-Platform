import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "API & Developers | AI Community Platform",
  description:
    "Build with the AI Community Platform API. Documentation, SDKs, and tools for developers integrating intelligent communities.",
};

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_0.5px,transparent_0.5px),linear-gradient(to_bottom,#e2e8f0_0.5px,transparent_0.5px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            API &{" "}
            <span className="text-gradient-accent">
              developers
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Build with the AI Community Platform. Integrate communities, automate
            workflows, and extend functionality with our API.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/api-docs"
              className="rounded-xl gradient-accent px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30"
            >
              View API Docs
            </Link>
            <Link
              href="/marketplace"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              App Marketplace
            </Link>
            <Link
              href="/marketplace/apply"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              Build an App
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              Get API Key
            </Link>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="border-y border-slate-200 bg-slate-50/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Build and extend
          </h2>
          <p className="mt-6 max-w-3xl text-slate-600">
            The AI Community Platform API is a RESTful API that gives you full
            programmatic access to communities, members, content, and AI
            capabilities. Use it to build integrations, custom dashboards,
            automation, and more.
          </p>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            API capabilities
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Community Management",
                desc: "Create and manage communities, spaces, channels, and members programmatically.",
              },
              {
                title: "Content & Posts",
                desc: "Publish, update, and moderate content via API.",
              },
              {
                title: "Members & Auth",
                desc: "Manage members, roles, permissions, and authentication flows.",
              },
              {
                title: "AI Integration",
                desc: "Trigger AI assistant queries, moderation, and recommendations.",
              },
              {
                title: "Analytics",
                desc: "Retrieve engagement metrics, growth data, and insights.",
              },
              {
                title: "Webhooks",
                desc: "Subscribe to events and receive real-time notifications.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="border-t border-slate-200 bg-slate-50/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Quick start
          </h2>
          <div className="mt-8 overflow-x-auto">
            <pre className="rounded-xl border border-slate-200 bg-slate-900 p-6 text-sm text-slate-300">
{`# Install the SDK (coming soon)
npm install @aicommunity/sdk

# Or use the REST API directly
curl -X GET https://api.yourplatform.com/v1/communities \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
            </pre>
          </div>
          <p className="mt-4 text-slate-600">
            API keys are available on Business and Enterprise plans.{" "}
            <Link href="/pricing" className="font-medium text-violet-600 transition-colors hover:text-violet-700">
              View pricing
            </Link>
          </p>
        </div>
      </section>

      {/* Resources */}
      <section className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Developer resources
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            {[
              { label: "API Reference", href: "/api-docs" },
              { label: "App Marketplace", href: "/marketplace" },
              { label: "Build an App", href: "/marketplace/apply" },
              { label: "Authentication Guide", href: "/help/account-security" },
              { label: "Webhooks", href: "/api-docs" },
              { label: "Rate Limits", href: "/api-docs" },
              { label: "Changelog", href: "/blog" },
              { label: "Status Page", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-2.5 text-slate-700 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Ready to build?
          </h2>
          <p className="mt-6 text-lg text-slate-600">
            Get your API key and start integrating.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl gradient-accent px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30"
            >
              Get API Key
            </Link>
            <a
              href="/contact"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
