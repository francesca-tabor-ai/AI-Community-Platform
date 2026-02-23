import type { Metadata } from "next";
import Link from "next/link";
import { LazySection } from "./components/LazySection";

export const metadata: Metadata = {
  title: "AI Community Platform | Build Intelligent Communities",
  description:
    "Build, grow, and monetize communities with the first AI-native platform. AI-powered management, engagement, and personalized experiences at scale.",
};

const FEATURES = [
  {
    title: "AI Assistant",
    desc: "Answer member questions, guide discovery, and automate support 24/7.",
    icon: "🤖",
  },
  {
    title: "Community Management",
    desc: "Spaces, channels, roles, and permissions—all in one place.",
    icon: "📋",
  },
  {
    title: "Knowledge Engine",
    desc: "Turn community content into a searchable, AI-powered knowledge base.",
    icon: "🔍",
  },
  {
    title: "Monetization",
    desc: "Paid memberships, courses, and events with built-in payments.",
    icon: "💰",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a22_1px,transparent_1px),linear-gradient(to_bottom,#0f172a22_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build Intelligent Communities{" "}
            <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            The first AI-native platform for communities. Create, grow, and
            monetize with AI that automates management, enhances engagement, and
            delivers personalized experiences at scale.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-[1.02] hover:bg-teal-400 active:scale-[0.98]"
            >
              Start Writing
            </Link>
            <Link
              href="/blog"
              className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-200 transition-all duration-200 hover:scale-[1.02] hover:border-teal-500/50 hover:text-teal-400 active:scale-[0.98]"
            >
              Explore Creators
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-200 transition-all duration-200 hover:scale-[1.02] hover:border-teal-500/50 hover:text-teal-400 active:scale-[0.98]"
            >
              Book a Demo
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            No credit card required. Start with up to 100 members free.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <LazySection>
        <section className="border-y border-slate-800/50 bg-slate-900/30 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
              Everything You Need to Build and Scale
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
              AI-native from the ground up—not bolted on.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-700/50 bg-slate-800/20 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-500/30"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <h3 className="mt-4 font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">{feature.desc}</p>
                  <Link
                    href="/features"
                    className="mt-4 inline-block text-sm font-medium text-teal-400 hover:text-teal-300"
                  >
                    Learn more →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Social Proof / Why Choose */}
      <LazySection delay={80}>
        <section className="border-t border-slate-800/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Why Teams Choose AI Community Platform
            </h2>
            <p className="mt-4 max-w-2xl text-slate-400">
              Built for creators, educators, startups, and enterprises.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "AI-native architecture—not AI bolted on",
                "60–80% reduction in manual moderation",
                "Built-in monetization and payments",
                "Enterprise-grade security and SSO",
                "Knowledge never gets lost",
                "Scale from 100 to millions",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 px-6 py-4 text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-600/60"
                >
                  <span className="text-teal-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </LazySection>

      {/* Use Cases Teaser */}
      <LazySection delay={80}>
        <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Built for Every Type of Community
            </h2>
            <p className="mt-4 max-w-2xl text-slate-400">
              Creators, educators, startups, enterprises—we support them all.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Creators",
                "Educators",
                "Startups",
                "Enterprises",
                "Professional networks",
                "Event organizers",
              ].map((item) => (
                <Link
                  key={item}
                  href="/use-cases"
                  className="rounded-full border border-teal-500/30 bg-teal-500/5 px-5 py-2.5 text-sm font-medium text-teal-400 transition-all duration-200 hover:scale-[1.05] hover:border-teal-500/50 hover:bg-teal-500/10"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA */}
      <LazySection delay={80}>
        <section className="border-t border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-950 py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Ready to Build Your Intelligent Community?
            </h2>
            <p className="mt-6 text-lg text-slate-400">
              Start for free. No credit card required.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-[1.02] hover:bg-teal-400 active:scale-[0.98]"
              >
                Get Started Free
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-200 transition-all duration-200 hover:scale-[1.02] hover:border-teal-500/50 hover:text-teal-400 active:scale-[0.98]"
              >
                Book a Demo
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-200 transition-all duration-200 hover:scale-[1.02] hover:border-teal-500/50 hover:text-teal-400 active:scale-[0.98]"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </LazySection>
    </div>
  );
}
