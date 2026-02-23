import type { Metadata } from "next";
import { LazySection } from "../components/LazySection";

export const metadata: Metadata = {
  title: "Features | AI Community Platform",
  description:
    "Powerful features for intelligent communities: AI Assistant, Community Management, Knowledge Engine, Monetization, Automation, and more.",
};

function FeatureSection({
  id,
  badge,
  title,
  intro,
  features,
  benefits,
  cta,
}: {
  id: string;
  badge?: string;
  title: string;
  intro?: string;
  features?: string[];
  benefits?: string[];
  cta?: { href: string; text: string };
}) {
  return (
    <LazySection>
    <section id={id} className="border-t border-slate-200 py-20">
      <div className="mx-auto max-w-6xl px-6">
        {badge && (
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700">
            {badge}
          </span>
        )}
        <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
          {title}
        </h2>
        {intro && (
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">{intro}</p>
        )}
        {features && (
          <>
            <p className="mt-8 font-medium text-slate-700">Features:</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600">
                  <span className="text-violet-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </>
        )}
        {benefits && (
          <>
            <p className="mt-8 font-medium text-slate-700">Benefits:</p>
            <ul className="mt-3 space-y-2">
              {benefits.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600">
                  <span className="text-violet-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </>
        )}
        {cta && (
          <a
            href={cta.href}
            className="mt-8 inline-flex items-center gap-2 font-medium text-violet-600 transition-all duration-200 hover:text-violet-700 hover:gap-3"
          >
            {cta.text}
          </a>
        )}
      </div>
    </section>
    </LazySection>
  );
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_0.5px,transparent_0.5px),linear-gradient(to_bottom,#e2e8f0_0.5px,transparent_0.5px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Powerful features built for{" "}
            <span className="text-gradient-accent">
              intelligent communities
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Everything you need to create, manage, grow, and monetize communities
            — powered by AI from the ground up.
          </p>
          <a
            href="/signup"
            className="mt-8 inline-block rounded-xl gradient-accent px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-violet-500/30 active:scale-[0.98]"
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* Overview */}
      <LazySection delay={80}>
      <section className="border-y border-slate-200 bg-slate-50/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            One platform. Unlimited possibilities.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">
            The AI Community Platform combines community infrastructure,
            knowledge management, monetization, and AI automation into a single
            intelligent system.
          </p>
          <p className="mt-6 font-medium text-slate-700">
            Core feature categories:
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { name: "AI Assistant", id: "ai-assistant" },
              { name: "Community Management", id: "community-management" },
              { name: "Knowledge Engine", id: "knowledge-engine" },
              { name: "Monetization", id: "monetization" },
              { name: "Automation", id: "ai-automation" },
              {
                name: "Discovery and Recommendations",
                id: "discovery-recommendations",
              },
              { name: "Analytics and Insights", id: "analytics-insights" },
              { name: "Events and Learning", id: "events" },
            ].map(({ name, id }) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full border border-violet-200 bg-violet-50 px-5 py-2.5 text-sm font-medium text-violet-700 transition-all duration-200 hover:scale-[1.05] hover:border-violet-300 hover:bg-violet-100 active:scale-[0.97]"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </section>
      </LazySection>

      {/* AI Assistant */}
      <FeatureSection
        id="ai-assistant"
        badge="AI Assistant"
        title="Your Always-On Community Intelligence"
        intro="Provide instant answers and guidance to every member."
        features={[
          "Answer member questions automatically",
          "Explain content and concepts",
          "Guide users to relevant discussions",
          "Provide personalized recommendations",
          "Summarize posts and discussions",
        ]}
        benefits={[
          "Reduce support workload",
          "Improve member experience",
          "Increase engagement",
        ]}
        cta={{ href: "/help/ai-assistant-overview", text: "See AI Assistant in Action →" }}
      />

      {/* Community Management */}
      <FeatureSection
        id="community-management"
        badge="Community Management"
        title="Build and Manage Communities at Any Scale"
        intro="Create structured, organized, and scalable communities."
        features={[
          "Community creation and customization",
          "Spaces and channels",
          "Posts and discussions",
          "Comments and replies",
          "User profiles",
          "Roles and permissions",
          "Notifications and activity feeds",
        ]}
        benefits={[
          "Organized discussions",
          "Clear structure",
          "Easy scalability",
        ]}
      />

      {/* Knowledge Engine */}
      <FeatureSection
        id="knowledge-engine"
        badge="Knowledge Engine"
        title="Turn Community Content Into Intelligent Knowledge"
        intro="Your platform becomes a living, searchable knowledge base."
        features={[
          "AI-powered search",
          "Automatic summaries",
          "Structured knowledge discovery",
          "Knowledge recommendations",
          "Related content suggestions",
        ]}
        benefits={[
          "Knowledge never gets lost",
          "Faster learning and discovery",
          "Higher community value",
        ]}
      />

      {/* AI Automation */}
      <FeatureSection
        id="ai-automation"
        badge="AI Automation"
        title="Automate Community Operations"
        intro="Reduce manual work and scale efficiently."
        features={[
          "AI moderation",
          "Spam detection",
          "Automated onboarding",
          "AI content suggestions",
          "Engagement prompts",
        ]}
        benefits={[
          "Save time",
          "Reduce operational workload",
          "Improve community quality",
        ]}
      />

      {/* Monetization */}
      <FeatureSection
        id="monetization"
        badge="Monetization"
        title="Generate Revenue From Your Community"
        intro="Build sustainable, recurring revenue streams."
        features={[
          "Paid memberships",
          "Subscription tiers",
          "Paid courses",
          "Paid events",
          "Premium content access",
        ]}
        benefits={[
          "Monetize audience directly",
          "Build recurring revenue",
          "Create scalable business models",
        ]}
      />

      {/* Discovery and Recommendations */}
      <FeatureSection
        id="discovery-recommendations"
        badge="Discovery and Recommendations"
        title="Help Members Find What Matters Most"
        intro="AI delivers personalized discovery."
        features={[
          "Personalized content feed",
          "Community recommendations",
          "Member recommendations",
          "Event recommendations",
          "Topic recommendations",
        ]}
        benefits={[
          "Increase engagement",
          "Improve retention",
          "Enhance user experience",
        ]}
      />

      {/* Events */}
      <FeatureSection
        id="events"
        badge="Events"
        title="Create and Manage Events Seamlessly"
        intro="Run events directly inside your community."
        features={[
          "Event creation",
          "Event pages",
          "RSVPs",
          "Event discovery",
          "Event recommendations",
        ]}
        benefits={[
          "Increase engagement",
          "Strengthen community connections",
        ]}
      />

      {/* Analytics and Insights */}
      <FeatureSection
        id="analytics-insights"
        badge="Analytics and Insights"
        title="Understand and Grow Your Community"
        intro="Track performance and optimize growth."
        features={[
          "Member growth",
          "Engagement metrics",
          "Content performance",
          "Revenue analytics",
          "AI-driven insights",
        ]}
        benefits={[
          "Make data-driven decisions",
          "Optimize community growth",
        ]}
      />

      {/* Personalization */}
      <FeatureSection
        id="personalization"
        badge="Personalization"
        title="Deliver Personalized Experiences to Every Member"
        intro="AI adapts to each user."
        features={[
          "Personalized recommendations",
          "Personalized feeds",
          "Personalized onboarding",
          "Personalized content discovery",
        ]}
        benefits={[
          "Higher engagement",
          "Better user experience",
        ]}
      />

      {/* Security and Moderation */}
      <FeatureSection
        id="security-moderation"
        badge="Security and Moderation"
        title="Safe, Secure, and Trusted Communities"
        intro="Protect your community and members."
        features={[
          "Secure authentication",
          "Role-based access",
          "AI moderation",
          "Abuse detection",
          "Spam protection",
        ]}
      />

      {/* Platform Benefits Summary */}
      <LazySection delay={80}>
      <section className="border-t border-slate-200 bg-slate-50/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Why teams choose AI Community Platform
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "AI-native architecture",
              "Fully integrated ecosystem",
              "Built for scalability",
              "Monetization ready",
              "Enterprise-grade infrastructure",
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

      {/* CTA Section */}
      <LazySection delay={80}>
      <section className="border-t border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-950 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Ready to Build an Intelligent Community?
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            Launch your community in minutes.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/signup"
              className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-[1.02] hover:bg-teal-400 active:scale-[0.98]"
            >
              Get Started Free
            </a>
            <a
              href="/contact"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all duration-200 hover:scale-[1.02] hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98]"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </section>
      </LazySection>
    </div>
  );
}
