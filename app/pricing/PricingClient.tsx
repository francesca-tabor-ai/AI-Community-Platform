"use client";

import { useState } from "react";
import { LazySection } from "../components/LazySection";

const PLANS = {
  free: {
    name: "Free Plan",
    bestFor: "Getting started and small communities",
    monthly: 0,
    yearly: 0,
    features: [
      "Up to 100 members",
      "1 community",
      "Unlimited posts and discussions",
      "Basic AI assistant",
      "Basic search",
      "Community spaces and channels",
      "Basic analytics",
      "Email support",
    ],
    cta: "Get Started Free",
    ctaVariant: "primary" as const,
    popular: false,
  },
  pro: {
    name: "Pro Plan",
    bestFor: "Growing communities and creators",
    monthly: 29,
    yearly: 23,
    features: [
      "Everything in Free, plus:",
      "Up to 5,000 members",
      "Unlimited communities",
      "Advanced AI assistant",
      "AI content suggestions",
      "AI-powered recommendations",
      "Paid memberships and subscriptions",
      "Monetization tools",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    ctaVariant: "primary" as const,
    popular: true,
  },
  business: {
    name: "Business Plan",
    bestFor: "Scaling communities and organizations",
    monthly: 99,
    yearly: 79,
    features: [
      "Everything in Pro, plus:",
      "Unlimited members",
      "Advanced AI automation",
      "AI moderation",
      "Advanced personalization",
      "Events and course features",
      "API access",
      "Custom branding",
      "Advanced analytics dashboard",
    ],
    cta: "Start Business Trial",
    ctaVariant: "primary" as const,
    popular: false,
  },
  enterprise: {
    name: "Enterprise Plan",
    bestFor: "Large organizations and enterprises",
    monthly: null,
    yearly: null,
    features: [
      "Everything in Business, plus:",
      "Unlimited communities",
      "Dedicated infrastructure",
      "Advanced security controls",
      "SSO (Single Sign-On)",
      "Dedicated account manager",
      "SLA guarantees",
      "Custom integrations",
      "Enterprise onboarding support",
    ],
    cta: "Contact Sales",
    ctaVariant: "secondary" as const,
    popular: false,
  },
};

const COMPARISON = [
  { feature: "Communities", free: "1", pro: "Unlimited", business: "Unlimited", enterprise: "Unlimited" },
  { feature: "Members", free: "100", pro: "5,000", business: "Unlimited", enterprise: "Unlimited" },
  { feature: "AI Assistant", free: "Basic", pro: "Advanced", business: "Advanced", enterprise: "Advanced" },
  { feature: "AI Automation", free: "—", pro: "Partial", business: "Full", enterprise: "Full" },
  { feature: "Monetization", free: "—", pro: "Yes", business: "Yes", enterprise: "Yes" },
  { feature: "Analytics", free: "Basic", pro: "Advanced", business: "Advanced", enterprise: "Enterprise" },
  { feature: "API Access", free: "—", pro: "—", business: "Yes", enterprise: "Yes" },
  { feature: "SSO", free: "—", pro: "—", business: "—", enterprise: "Yes" },
  { feature: "Support", free: "Email", pro: "Priority", business: "Priority", enterprise: "Dedicated" },
];

const TRANSACTION_FEES = [
  { plan: "Free", fee: "5% platform fee" },
  { plan: "Pro", fee: "3% platform fee" },
  { plan: "Business", fee: "2% platform fee" },
  { plan: "Enterprise", fee: "Custom" },
];

const FAQ = [
  {
    q: "Can I start for free?",
    a: "Yes. The Free plan allows you to launch and grow your community with core features.",
  },
  {
    q: "Can I upgrade anytime?",
    a: "Yes. You can upgrade or downgrade at any time.",
  },
  {
    q: "Do you take a percentage of revenue?",
    a: "Yes, only when you monetize. Higher plans have lower fees.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Pro and Business plans include a free trial.",
  },
  {
    q: "Do you offer enterprise plans?",
    a: "Yes. Contact sales for custom pricing and features.",
  },
];

export default function PricingClient() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <>
      {/* Billing Toggle */}
      <section className="pb-8">
        <div className="flex justify-center">
          <div className="inline-flex rounded-xl border border-slate-700/50 bg-slate-800/30 p-1 transition-shadow duration-200 hover:border-slate-600/60">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-all duration-200 ease-out active:scale-[0.97] ${
                billingCycle === "monthly"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-all duration-200 ease-out active:scale-[0.97] ${
                billingCycle === "yearly"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Yearly <span className="text-teal-400">(Save 20%)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <LazySection>
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
              {(["free", "pro", "business", "enterprise"] as const).map((key) => {
                const plan = PLANS[key];
              const price =
                plan.monthly === null
                  ? "Custom"
                  : billingCycle === "yearly" && plan.yearly
                    ? `$${plan.yearly}`
                    : plan.monthly
                      ? `$${plan.monthly}`
                      : "Custom";
              const period =
                plan.monthly === null
                  ? "pricing"
                  : billingCycle === "yearly" && plan.yearly
                    ? "/mo, billed yearly"
                    : "/ month";

              return (
                <div
                  key={key}
                  className={`relative rounded-2xl border p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl ${
                    plan.popular
                      ? "border-teal-500/50 bg-teal-500/5 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20"
                      : "border-slate-700/50 bg-slate-800/20 hover:border-slate-600/60"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-500 px-4 py-1 text-xs font-semibold text-slate-950">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">Best for: {plan.bestFor}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{price}</span>
                    <span className="text-slate-500">{period}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                        <span className="mt-0.5 text-teal-500">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#"
                    className={`mt-8 block w-full rounded-xl py-3.5 text-center text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                      plan.ctaVariant === "primary"
                        ? "bg-teal-500 text-slate-950 hover:bg-teal-400"
                        : "border border-slate-600 text-slate-200 hover:border-teal-500/50 hover:text-teal-400"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </LazySection>

      {/* Feature Comparison Table */}
      <LazySection delay={80}>
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Feature Comparison
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="py-4 pr-4 text-left text-sm font-medium text-slate-400">
                    Feature
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-medium text-slate-400">
                    Free
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-medium text-slate-400">
                    Pro
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-medium text-slate-400">
                    Business
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-medium text-slate-400">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-800/50 transition-colors duration-150 last:border-0 hover:bg-slate-800/30"
                  >
                    <td className="py-4 pr-4 text-slate-300">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-slate-400">
                      {row.free}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-400">
                      {row.pro}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-400">
                      {row.business}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-400">
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      </LazySection>

      {/* Monetization Section */}
      <LazySection delay={120}>
      <section className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Only pay when you earn
          </h2>
          <p className="mt-4 text-slate-400">
            Transaction fee:
          </p>
          <ul className="mt-4 space-y-2">
            {TRANSACTION_FEES.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-400">
                <span className="text-teal-500">•</span>
                <span className="font-medium text-slate-300">{item.plan}:</span>
                {item.fee}
              </li>
            ))}
          </ul>
          <p className="mt-6 font-medium text-teal-400">No hidden fees.</p>
        </div>
      </section>
      </LazySection>

      {/* FAQ */}
      <LazySection delay={160}>
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <dl className="mt-10 space-y-8">
            {FAQ.map((item, i) => (
              <div key={i}>
                <dt className="text-lg font-medium text-white">{item.q}</dt>
                <dd className="mt-2 text-slate-400">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection delay={80}>
      <section className="border-t border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-950 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Start building your intelligent community today
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            Launch your community in minutes.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#"
              className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-[1.02] hover:bg-teal-400 active:scale-[0.98]"
            >
              Get Started Free
            </a>
            <a
              href="#"
              className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-200 transition-all duration-200 hover:scale-[1.02] hover:border-teal-500/50 hover:text-teal-400 active:scale-[0.98]"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>
      </LazySection>
    </>
  );
}
