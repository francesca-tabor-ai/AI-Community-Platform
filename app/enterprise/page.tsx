import type { Metadata } from "next";
import EnterpriseContactForm from "./EnterpriseContactForm";

export const metadata: Metadata = {
  title: "Enterprise | AI Community Platform",
  description:
    "Enterprise-grade community platform powered by AI. Build, manage, and scale intelligent communities with enterprise security, advanced automation, and dedicated support.",
};

function BenefitsSection({
  title,
  intro,
  items,
  closing,
}: {
  title: string;
  intro: string;
  items: string[];
  closing?: string;
}) {
  return (
    <section className="border-t border-slate-200 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
        <p className="mt-4 max-w-3xl text-slate-600">{intro}</p>
        <ul className="mt-6 space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-600">
              <span className="text-violet-500">✓</span> {item}
            </li>
          ))}
        </ul>
        {closing && (
          <p className="mt-6 font-medium text-violet-600">{closing}</p>
        )}
      </div>
    </section>
  );
}

function FeatureBlock({
  title,
  intro,
  items,
}: {
  title: string;
  intro: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{intro}</p>
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-slate-600">
            <span className="text-violet-500">•</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_0.5px,transparent_0.5px),linear-gradient(to_bottom,#e2e8f0_0.5px,transparent_0.5px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Enterprise-grade community platform{" "}
            <span className="text-gradient-accent">
              powered by AI
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Build, manage, and scale intelligent communities with enterprise
            security, advanced automation, and dedicated support.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#contact"
              className="rounded-xl gradient-accent px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30"
            >
              Contact Sales
            </a>
            <a
              href="/contact"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              Book Enterprise Demo
            </a>
          </div>
          <p className="mt-8 text-sm text-slate-500">
            Trusted by organizations scaling communities to millions of users.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="border-y border-slate-200 bg-slate-50/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Intelligent Community Infrastructure for Enterprises
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">
            The AI Community Platform provides enterprise organizations with
            powerful infrastructure to manage large-scale communities, internal
            networks, customer ecosystems, and knowledge systems.
          </p>
          <p className="mt-4 text-lg text-slate-600">
            AI automates operations, improves engagement, and transforms your
            community into a strategic asset.
          </p>
        </div>
      </section>

      {/* Enterprise Benefits */}
      <BenefitsSection
        title="Scale Without Operational Complexity"
        intro="Manage thousands or millions of users efficiently."
        items={[
          "Automate moderation and support with AI",
          "Reduce manual workload",
          "Improve user engagement and retention",
          "Centralize knowledge and communication",
          "Enable scalable growth",
        ]}
      />

      <BenefitsSection
        title="Transform Community Into an Intelligent Knowledge System"
        intro="Capture and organize institutional knowledge automatically."
        items={[
          "AI-powered knowledge discovery",
          "Automatic content organization",
          "Intelligent search",
          "Knowledge summaries",
        ]}
        closing="Ensure information is always accessible."
      />

      <BenefitsSection
        title="Improve Efficiency with AI Automation"
        intro="Reduce operational overhead. AI automates:"
        items={[
          "Moderation",
          "Support responses",
          "Content recommendations",
          "Member onboarding",
        ]}
        closing="Improve efficiency while reducing costs."
      />

      {/* Enterprise Features */}
      <section className="border-t border-slate-200 bg-slate-50/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Enterprise Features
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <FeatureBlock
              title="Enterprise-Grade Security"
              intro="Protect your organization and users."
              items={[
                "Single Sign-On (SSO)",
                "Role-based access control",
                "Secure authentication",
                "Data encryption",
                "Privacy protection",
              ]}
            />
            <FeatureBlock
              title="Dedicated Infrastructure"
              intro="Ensure reliability and performance."
              items={[
                "Dedicated hosting options",
                "High availability architecture",
                "Scalable infrastructure",
                "Performance optimization",
              ]}
            />
            <FeatureBlock
              title="Advanced Analytics and Insights"
              intro="Make data-driven decisions."
              items={[
                "Engagement metrics",
                "Growth analytics",
                "User activity insights",
                "AI-driven recommendations",
              ]}
            />
            <FeatureBlock
              title="Enterprise AI Assistant"
              intro="Provide intelligent support at scale."
              items={[
                "Answer user questions automatically",
                "Provide guidance and recommendations",
                "Assist internal teams",
                "Improve productivity",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Enterprise Use Cases */}
      <section className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Enterprise Use Cases
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Customer Communities",
                desc: "Improve customer engagement and retention.",
              },
              {
                title: "Internal Communities",
                desc: "Enable collaboration and knowledge sharing.",
              },
              {
                title: "Developer Communities",
                desc: "Support developers and technical ecosystems.",
              },
              {
                title: "Educational Institutions",
                desc: "Build intelligent learning communities.",
              },
              {
                title: "Partner and Ecosystem Communities",
                desc: "Connect partners and stakeholders.",
              },
            ].map((uc, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-violet-200 hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-900">{uc.title}</h3>
                <p className="mt-2 text-slate-600">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="border-t border-slate-200 bg-slate-50/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Integrate with Your Existing Systems
          </h2>
          <p className="mt-4 text-slate-600">
            Supported integrations:
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {[
              "Identity providers (SSO)",
              "CRM systems",
              "Payment providers",
              "Analytics tools",
              "Custom integrations via API",
            ].map((item, i) => (
              <li
                key={i}
                className="rounded-full border border-violet-200 bg-violet-50 px-5 py-2.5 text-sm font-medium text-violet-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Support and Services */}
      <section className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Dedicated Enterprise Support
          </h2>
          <p className="mt-4 text-slate-600">
            Enterprise customers receive:
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Dedicated account manager",
              "Priority support",
              "Onboarding assistance",
              "Implementation support",
              "Ongoing optimization guidance",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600">
                <span className="text-violet-500">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Performance and Reliability */}
      <section className="border-t border-slate-200 bg-slate-50/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Built for Scale and Reliability
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "99.9% uptime SLA",
              "Global infrastructure",
              "High performance architecture",
              "Enterprise-grade scalability",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                <span className="text-violet-500">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Built for Enterprise from Day One
          </h2>
          <p className="mt-6 max-w-3xl text-slate-600">
            Unlike traditional platforms, our AI-native architecture provides:
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Intelligent automation",
              "Scalable infrastructure",
              "Enterprise-grade security",
              "Continuous improvement through AI",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600">
                <span className="text-violet-500">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Section with Contact Form */}
      <section
        id="contact"
        className="border-t border-slate-200 bg-slate-50 py-24"
      >
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-4xl font-bold text-slate-900 sm:text-5xl">
            Ready to power your enterprise community?
          </h2>
          <p className="mt-6 text-center text-lg text-slate-600">
            Talk to our enterprise team.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="rounded-xl gradient-accent px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30"
            >
              Contact Sales
            </a>
            <a
              href="/contact"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              Book Enterprise Demo
            </a>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-16">
            <EnterpriseContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
