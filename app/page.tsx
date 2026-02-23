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
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_0.5px,transparent_0.5px),linear-gradient(to_bottom,#e2e8f0_0.5px,transparent_0.5px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Build intelligent communities{" "}
            <span className="text-gradient-accent">
              powered by AI
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            The first AI-native platform for communities. Create, grow, and
            monetize with AI that automates management, enhances engagement, and
            delivers personalized experiences at scale.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="gradient-accent rounded-xl px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-violet-500/30 active:scale-[0.98]"
            >
              Start Writing
            </Link>
            <Link
              href="/blog"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all duration-200 hover:scale-[1.02] hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98]"
            >
              Explore Creators
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all duration-200 hover:scale-[1.02] hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98]"
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
        <section className="border-y border-slate-200 bg-slate-50/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">
              Everything you need to build and scale
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
              AI-native from the ground up—not bolted on.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <h3 className="mt-4 font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {feature.desc}
                  </p>
                  <Link
                    href="/features"
                    className="mt-4 inline-block text-sm font-medium text-violet-600 transition-colors hover:text-violet-700"
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
        <section className="border-t border-slate-200 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Why teams choose AI Community Platform
            </h2>
            <p className="mt-4 max-w-2xl text-slate-600">
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
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <span className="text-violet-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </LazySection>

      {/* Use Cases Teaser */}
      <LazySection delay={80}>
        <section className="border-t border-slate-200 bg-slate-50/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Built for every type of community
            </h2>
            <p className="mt-4 max-w-2xl text-slate-600">
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
                  className="rounded-full border border-violet-200 bg-violet-50 px-5 py-2.5 text-sm font-medium text-violet-700 transition-all duration-200 hover:scale-[1.05] hover:border-violet-300 hover:bg-violet-100"
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
        <section className="border-t border-slate-200 bg-slate-50 py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
              Ready to build your intelligent community?
            </h2>
            <p className="mt-6 text-lg text-slate-600">
              Start for free. No credit card required.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="gradient-accent rounded-xl px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-violet-500/30 active:scale-[0.98]"
              >
                Get Started Free
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all duration-200 hover:scale-[1.02] hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98]"
              >
                Book a Demo
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all duration-200 hover:scale-[1.02] hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98]"
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
