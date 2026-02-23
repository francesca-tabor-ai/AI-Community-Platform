import type { Metadata } from "next";
import dynamic from "next/dynamic";

const PricingClient = dynamic(() => import("./PricingClient"), {
  loading: () => (
    <div className="flex min-h-[400px] items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Pricing | AI Community Platform",
  description:
    "Simple, transparent pricing. Start for free. Upgrade as your community grows. No credit card required.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_0.5px,transparent_0.5px),linear-gradient(to_bottom,#e2e8f0_0.5px,transparent_0.5px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Simple, transparent{" "}
            <span className="text-gradient-accent">
              pricing
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Start for free. Upgrade as your community grows.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            No credit card required for free plan.
          </p>
        </div>
      </section>

      <PricingClient />
    </div>
  );
}
