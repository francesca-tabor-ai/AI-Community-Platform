import type { Metadata } from "next";

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
    <section id={id} className="border-t border-slate-800/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        {badge && (
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-400">
            {badge}
          </span>
        )}
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          {title}
        </h2>
        {intro && (
          <p className="mt-4 max-w-3xl text-lg text-slate-400">{intro}</p>
        )}
        {features && (
          <>
            <p className="mt-8 font-medium text-slate-300">Features:</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-400">
                  <span className="text-teal-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </>
        )}
        {benefits && (
          <>
            <p className="mt-8 font-medium text-slate-300">Benefits:</p>
            <ul className="mt-3 space-y-2">
              {benefits.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-400">
                  <span className="text-teal-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </>
        )}
        {cta && (
          <a
            href={cta.href}
            className="mt-8 inline-flex items-center gap-2 font-medium text-teal-400 transition-colors hover:text-teal-300"
          >
            {cta.text}
          </a>
        )}
      </div>
    </section>
  );
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a22_1px,transparent_1px),linear-gradient(to_bottom,#0f172a22_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Powerful Features Built for{" "}
            <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              Intelligent Communities
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Everything you need to create, manage, grow, and monetize communities
            — powered by AI from the ground up.
          </p>
          <a
            href="#"
            className="mt-8 inline-block rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-400"
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* Overview */}
      <section className="border-y border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            One platform. Unlimited possibilities.
          </h2>
          <p className="mt-6 max-w-3xl text-lg text-slate-400">
            The AI Community Platform combines community infrastructure,
            knowledge management, monetization, and AI automation into a single
            intelligent system.
          </p>
          <p className="mt-6 font-medium text-slate-300">
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
                className="rounded-full border border-teal-500/30 bg-teal-500/5 px-5 py-2.5 text-sm font-medium text-teal-400 transition-colors hover:bg-teal-500/10"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </section>

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
        cta={{ href: "#", text: "See AI Assistant in Action →" }}
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
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
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
                className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 px-6 py-4 text-slate-300"
              >
                <span className="text-teal-500">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Section */}
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
              href="#"
              className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-400"
            >
              Get Started Free
            </a>
            <a
              href="#"
              className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-200 transition-colors hover:border-teal-500/50 hover:text-teal-400"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
