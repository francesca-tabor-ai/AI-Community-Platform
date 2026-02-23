"use client";

import Link from "next/link";
import { useState } from "react";

const CATEGORIES = [
  { id: "all", label: "All Apps" },
  { id: "automation", label: "Automation" },
  { id: "analytics", label: "Analytics" },
  { id: "communication", label: "Communication" },
  { id: "ai-ml", label: "AI & ML" },
  { id: "productivity", label: "Productivity" },
  { id: "payments", label: "Payments" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

const APPS = [
  {
    id: "zapier",
    name: "Zapier",
    tagline: "Connect 6,000+ apps with no-code automation",
    description: "Automate workflows between your community and Zapier-supported apps. Sync new members to CRM, post to social, trigger Slack notifications, and more.",
    category: "automation" as CategoryId,
    icon: "⚡",
    featured: true,
    popular: true,
    href: "#",
  },
  {
    id: "make",
    name: "Make",
    tagline: "Visual automation for complex workflows",
    description: "Build sophisticated multi-step automations. Chain community events to databases, webhooks, and AI tools for advanced workflow orchestration.",
    category: "automation" as CategoryId,
    icon: "🔄",
    featured: true,
    popular: true,
    href: "#",
  },
  {
    id: "slack",
    name: "Slack",
    tagline: "Sync discussions and announcements",
    description: "Post community announcements to Slack channels. Mirror discussions, get notified of new posts, and keep your team in sync with community activity.",
    category: "communication" as CategoryId,
    icon: "💬",
    featured: true,
    popular: true,
    href: "#",
  },
  {
    id: "discord",
    name: "Discord",
    tagline: "Bridge communities seamlessly",
    description: "Two-way sync between your community and Discord. Share posts, mirror discussions, and bring both audiences together.",
    category: "communication" as CategoryId,
    icon: "🎮",
    featured: false,
    popular: true,
    href: "#",
  },
  {
    id: "notion",
    name: "Notion",
    tagline: "Knowledge base and wiki sync",
    description: "Automatically export community knowledge to Notion. Build living wikis, documentation, and FAQs from your discussions.",
    category: "productivity" as CategoryId,
    icon: "📝",
    featured: false,
    popular: true,
    href: "#",
  },
  {
    id: "airtable",
    name: "Airtable",
    tagline: "Community data in spreadsheets",
    description: "Sync members, posts, and events to Airtable. Build custom dashboards, CRMs, and reports with your community data.",
    category: "productivity" as CategoryId,
    icon: "📊",
    featured: false,
    popular: false,
    href: "#",
  },
  {
    id: "github",
    name: "GitHub",
    tagline: "Developer community integration",
    description: "Link discussions to repos, sync issue comments, and notify your community of releases. Built for developer communities.",
    category: "automation" as CategoryId,
    icon: "🐙",
    featured: false,
    popular: true,
    href: "#",
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    tagline: "Advanced traffic and funnel analytics",
    description: "Track community engagement, conversions, and user journeys. Connect GA4 for deeper insights beyond built-in analytics.",
    category: "analytics" as CategoryId,
    icon: "📈",
    featured: false,
    popular: true,
    href: "#",
  },
  {
    id: "segment",
    name: "Segment",
    tagline: "Unified customer data pipeline",
    description: "Send community events to Segment. Build a unified view of members across your product, community, and marketing stack.",
    category: "analytics" as CategoryId,
    icon: "🔗",
    featured: false,
    popular: false,
    href: "#",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    tagline: "Email campaigns from community data",
    description: "Sync new members to Mailchimp. Trigger campaigns based on engagement, run nurture sequences, and grow your newsletter.",
    category: "communication" as CategoryId,
    icon: "📧",
    featured: false,
    popular: true,
    href: "#",
  },
  {
    id: "typeform",
    name: "Typeform",
    tagline: "Surveys and feedback collection",
    description: "Embed Typeform surveys in your community. Collect feedback, run polls, onboard members, and gather structured data.",
    category: "productivity" as CategoryId,
    icon: "📋",
    featured: false,
    popular: false,
    href: "#",
  },
  {
    id: "calendly",
    name: "Calendly",
    tagline: "Event scheduling and 1:1s",
    description: "Let members book 1:1 calls with experts. Sync events to Calendly, manage availability, and automate scheduling.",
    category: "productivity" as CategoryId,
    icon: "📅",
    featured: false,
    popular: true,
    href: "#",
  },
  {
    id: "openai-actions",
    name: "OpenAI Actions",
    tagline: "Custom AI tools in your assistant",
    description: "Add custom tools to your community AI assistant. Connect APIs, databases, and external services for richer AI responses.",
    category: "ai-ml" as CategoryId,
    icon: "🤖",
    featured: true,
    popular: true,
    href: "#",
  },
  {
    id: "n8n",
    name: "n8n",
    tagline: "Self-hosted workflow automation",
    description: "Run automations on your own infrastructure. Connect community events to internal systems with full data ownership.",
    category: "automation" as CategoryId,
    icon: "🔧",
    featured: false,
    popular: false,
    href: "#",
  },
  {
    id: "webhook",
    name: "Custom Webhooks",
    tagline: "Send events to any endpoint",
    description: "Fire webhooks on new posts, members, comments, and events. Integrate with any system—internal tools, APIs, or serverless functions.",
    category: "automation" as CategoryId,
    icon: "🔌",
    featured: false,
    popular: true,
    href: "#",
  },
  {
    id: "stripe",
    name: "Stripe",
    tagline: "Advanced payment flows",
    description: "Custom payment integrations beyond built-in tiers. One-time purchases, custom pricing, and complex billing scenarios.",
    category: "payments" as CategoryId,
    icon: "💳",
    featured: false,
    popular: true,
    href: "#",
  },
];

function AppCard({
  app,
  compact = false,
}: {
  app: (typeof APPS)[number];
  compact?: boolean;
}) {
  return (
    <Link
      href={app.href}
      className="group relative flex flex-col rounded-2xl border border-slate-700/50 bg-slate-800/20 p-6 transition-all duration-200 hover:border-teal-500/40 hover:bg-slate-800/40 hover:shadow-lg hover:shadow-teal-500/5"
    >
      {app.popular && (
        <span className="absolute right-4 top-4 rounded-full bg-teal-500/20 px-2.5 py-0.5 text-xs font-medium text-teal-400">
          Popular
        </span>
      )}
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-900/50 text-2xl">
          {app.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white group-hover:text-teal-400">{app.name}</h3>
          <p className="mt-0.5 text-sm font-medium text-teal-400/90">{app.tagline}</p>
        </div>
      </div>
      {!compact && (
        <p className="mt-4 line-clamp-3 text-sm text-slate-400">{app.description}</p>
      )}
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-teal-400 opacity-0 transition-opacity group-hover:opacity-100">
        Install app →
      </span>
    </Link>
  );
}

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");

  const filteredApps =
    selectedCategory === "all"
      ? APPS
      : APPS.filter((app) => app.category === selectedCategory);

  const featuredApps = APPS.filter((app) => app.featured);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a22_1px,transparent_1px),linear-gradient(to_bottom,#0f172a22_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            App <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">Marketplace</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Extend your community with powerful integrations. Automate workflows, connect your stack, and build advanced experiences—no code required.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/marketplace/apply"
              className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400"
            >
              Build an App
            </Link>
            <a
              href="#apps"
              className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-200 transition-colors hover:border-teal-500/50 hover:text-teal-400"
            >
              Browse Apps
            </a>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="border-y border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Featured Integrations
          </h2>
          <p className="mt-2 text-slate-400">
            Most popular for advanced workflows
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      </section>

      {/* All Apps with Filter */}
      <section id="apps" className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            All Apps
          </h2>
          <p className="mt-2 text-slate-400">
            Browse by category to find the right integration
          </p>

          {/* Category Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-teal-500 text-slate-950"
                    : "border border-slate-600 text-slate-400 hover:border-teal-500/50 hover:text-teal-400"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* App Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>

          {filteredApps.length === 0 && (
            <p className="mt-12 text-center text-slate-500">
              No apps in this category yet.{" "}
              <Link href="/developers" className="text-teal-400 hover:text-teal-300">
                Build the first one
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Build CTA */}
      <section className="border-t border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-950 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Have an integration idea?
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            Build custom apps with our API. Publish to the marketplace and help thousands of communities.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/marketplace/apply"
              className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400"
            >
              Apply to Build an App
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-200 transition-colors hover:border-teal-500/50 hover:text-teal-400"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
