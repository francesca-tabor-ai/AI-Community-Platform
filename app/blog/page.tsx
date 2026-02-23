import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | AI Community Platform",
  description:
    "Insights, updates, and best practices for building intelligent communities. Learn how to grow, engage, and monetize with AI.",
};

const POSTS = [
  {
    slug: "introducing-ai-community-platform",
    title: "Introducing the AI Community Platform",
    excerpt:
      "We're building the first AI-native platform designed to power communities at scale. Here's why we started and where we're headed.",
    date: "2024-02-15",
    category: "Product",
  },
  {
    slug: "how-ai-transforms-community-engagement",
    title: "How AI Transforms Community Engagement",
    excerpt:
      "Discover how AI can automate moderation, personalize content, and keep members engaged—without the manual effort.",
    date: "2024-02-10",
    category: "Best Practices",
  },
  {
    slug: "monetizing-your-community",
    title: "Monetizing Your Community: A Complete Guide",
    excerpt:
      "From paid memberships to courses and events, learn the strategies top creators use to build sustainable revenue from their communities.",
    date: "2024-02-05",
    category: "Monetization",
  },
  {
    slug: "enterprise-community-security",
    title: "Enterprise-Grade Security for Communities",
    excerpt:
      "What enterprises need to know about securing large-scale communities: SSO, RBAC, encryption, and compliance.",
    date: "2024-01-28",
    category: "Security",
  },
  {
    slug: "ai-assistant-best-practices",
    title: "AI Assistant Best Practices for Community Support",
    excerpt:
      "Reduce support load and improve member experience with AI-powered answers, recommendations, and automated assistance.",
    date: "2024-01-20",
    category: "AI",
  },
  {
    slug: "scaling-from-100-to-10000-members",
    title: "Scaling from 100 to 10,000+ Members",
    excerpt:
      "Lessons from communities that grew 100x: structure, engagement strategies, and when to automate.",
    date: "2024-01-12",
    category: "Growth",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a22_1px,transparent_1px),linear-gradient(to_bottom,#0f172a22_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Blog
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Insights, updates, and best practices for building intelligent
            communities.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-12">
            {POSTS.map((post) => (
              <article
                key={post.slug}
                className="group border-b border-slate-800/50 pb-12 last:border-0 last:pb-0"
              >
                <span className="text-sm font-medium text-teal-400">
                  {post.category}
                </span>
                <h2 className="mt-2 text-2xl font-bold text-white transition-colors group-hover:text-teal-400 sm:text-3xl">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-2 text-slate-500">{post.date}</p>
                <p className="mt-4 text-slate-400">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            Ready to build your intelligent community?
          </h2>
          <a
            href="/"
            className="mt-6 inline-block rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400"
          >
            Get Started Free
          </a>
        </div>
      </section>
    </div>
  );
}
