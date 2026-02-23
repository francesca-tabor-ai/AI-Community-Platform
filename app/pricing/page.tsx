import type { Metadata } from "next";
import dynamic from "next/dynamic";

const PricingClient = dynamic(() => import("./PricingClient"), {
  loading: () => (
    <div className="flex min-h-[400px] items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a22_1px,transparent_1px),linear-gradient(to_bottom,#0f172a22_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
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
