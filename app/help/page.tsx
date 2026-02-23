import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center | AI Community Platform",
  description:
    "Get help with the AI Community Platform. Guides, tutorials, and support for building and managing intelligent communities.",
};

const CATEGORIES = [
  {
    title: "Getting Started",
    description: "Set up your first community and invite members",
    articles: [
      { title: "Creating your first community", slug: "creating-first-community" },
      { title: "Inviting members", slug: "inviting-members" },
      { title: "Setting up spaces and channels", slug: "spaces-and-channels" },
      { title: "Customizing your community", slug: "customizing-community" },
    ],
  },
  {
    title: "AI Assistant & Features",
    description: "Use AI to automate and enhance your community",
    articles: [
      { title: "AI Assistant overview", slug: "ai-assistant-overview" },
      { title: "Configuring AI responses", slug: "configuring-ai" },
      { title: "Knowledge discovery and search", slug: "knowledge-search" },
      { title: "Automated moderation", slug: "automated-moderation" },
    ],
  },
  {
    title: "Monetization",
    description: "Paid memberships, courses, and events",
    articles: [
      { title: "Setting up paid memberships", slug: "paid-memberships" },
      { title: "Creating and selling courses", slug: "courses" },
      { title: "Managing events", slug: "events" },
      { title: "Payments and payouts", slug: "payments-payouts" },
    ],
  },
  {
    title: "Community Management",
    description: "Roles, permissions, and moderation",
    articles: [
      { title: "Roles and permissions", slug: "roles-permissions" },
      { title: "Moderation tools", slug: "moderation-tools" },
      { title: "Analytics and insights", slug: "analytics" },
      { title: "Exporting data", slug: "exporting-data" },
    ],
  },
  {
    title: "Security & Account",
    description: "Account settings, security, and compliance",
    articles: [
      { title: "Account security", slug: "account-security" },
      { title: "SSO and enterprise auth", slug: "sso-enterprise" },
      { title: "Privacy and compliance", slug: "privacy-compliance" },
      { title: "API keys and integrations", slug: "api-keys" },
    ],
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a22_1px,transparent_1px),linear-gradient(to_bottom,#0f172a22_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Help Center
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Guides, tutorials, and support for building and managing intelligent
            communities.
          </p>
          <form className="mx-auto mt-10 max-w-xl">
            <div className="relative">
              <input
                type="search"
                placeholder="Search for help..."
                className="w-full rounded-xl border border-slate-600 bg-slate-800/50 py-3.5 pl-5 pr-12 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {CATEGORIES.map((category) => (
              <div
                key={category.title}
                className="rounded-2xl border border-slate-700/50 bg-slate-800/20 p-8"
              >
                <h2 className="text-xl font-bold text-white">{category.title}</h2>
                <p className="mt-2 text-slate-400">{category.description}</p>
                <ul className="mt-6 space-y-3">
                  {category.articles.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={`/help/${article.slug}`}
                        className="text-teal-400 hover:text-teal-300"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            Still need help?
          </h2>
          <p className="mt-4 text-slate-400">
            Our support team is here to assist you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
