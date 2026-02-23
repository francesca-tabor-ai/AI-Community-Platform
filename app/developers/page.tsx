import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "API & Developers | AI Community Platform",
  description:
    "Build with the AI Community Platform API. Documentation, SDKs, and tools for developers integrating intelligent communities.",
};

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a22_1px,transparent_1px),linear-gradient(to_bottom,#0f172a22_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            API &{" "}
            <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              Developers
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Build with the AI Community Platform. Integrate communities, automate
            workflows, and extend functionality with our API.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/api-docs"
              className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400"
            >
              View API Docs
            </Link>
            <Link
              href="/marketplace"
              className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-200 transition-colors hover:border-teal-500/50 hover:text-teal-400"
            >
              App Marketplace
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-200 transition-colors hover:border-teal-500/50 hover:text-teal-400"
            >
              Get API Key
            </Link>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="border-y border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Build and Extend
          </h2>
          <p className="mt-6 max-w-3xl text-slate-400">
            The AI Community Platform API is a RESTful API that gives you full
            programmatic access to communities, members, content, and AI
            capabilities. Use it to build integrations, custom dashboards,
            automation, and more.
          </p>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            API Capabilities
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
                className="rounded-2xl border border-slate-700/50 bg-slate-800/20 p-6"
              >
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Quick Start
          </h2>
          <div className="mt-8 overflow-x-auto">
            <pre className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6 text-sm text-slate-300">
{`# Install the SDK (coming soon)
npm install @aicommunity/sdk

# Or use the REST API directly
curl -X GET https://api.yourplatform.com/v1/communities \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
            </pre>
          </div>
          <p className="mt-4 text-slate-400">
            API keys are available on Business and Enterprise plans.{" "}
            <Link href="/pricing" className="text-teal-400 hover:text-teal-300">
              View pricing
            </Link>
          </p>
        </div>
      </section>

      {/* Resources */}
      <section className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Developer Resources
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            {[
              { label: "API Reference", href: "/api-docs" },
              { label: "App Marketplace", href: "/marketplace" },
              { label: "Authentication Guide", href: "/help/account-security" },
              { label: "Webhooks", href: "/api-docs" },
              { label: "Rate Limits", href: "/api-docs" },
              { label: "Changelog", href: "/blog" },
              { label: "Status Page", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg border border-slate-600 px-5 py-2.5 text-slate-300 hover:border-teal-500/50 hover:text-teal-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-950 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Ready to build?
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            Get your API key and start integrating.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400"
            >
              Get API Key
            </Link>
            <a
              href="/contact"
              className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-200 transition-colors hover:border-teal-500/50 hover:text-teal-400"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
