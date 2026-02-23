import type { Metadata } from "next";
import { LazySection } from "../components/LazySection";

export const metadata: Metadata = {
  title: "Use Cases | AI Community Platform",
  description:
    "Built for every type of community—creators, startups, educators, enterprises, and more. Build intelligent, scalable, and monetizable communities.",
};

function UseCaseCard({
  id,
  title,
  subtitle,
  description,
  perfectFor,
  whatYouCanDo,
  keyBenefits,
  cta,
}: {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  perfectFor: string[];
  whatYouCanDo: string[];
  keyBenefits: string[];
  cta: { href: string; text: string };
}) {
  return (
    <LazySection>
    <section id={id} className="border-t border-slate-800/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <p className="mt-2 text-xl font-medium text-teal-400">{subtitle}</p>
        <p className="mt-4 max-w-3xl text-lg text-slate-400">{description}</p>

        <p className="mt-8 font-medium text-slate-300">Perfect for:</p>
        <ul className="mt-3 flex flex-wrap gap-3">
          {perfectFor.map((item, i) => (
            <li
              key={i}
              className="rounded-full border border-teal-500/30 bg-teal-500/5 px-4 py-2 text-sm text-teal-400 transition-all duration-200 hover:scale-[1.05] hover:border-teal-500/50 active:scale-[0.97]"
            >
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-8 font-medium text-slate-300">What you can do:</p>
        <ul className="mt-3 space-y-2">
          {whatYouCanDo.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-400">
              <span className="text-teal-500">✓</span> {item}
            </li>
          ))}
        </ul>

        <p className="mt-8 font-medium text-slate-300">Key benefits:</p>
        <ul className="mt-3 space-y-2">
          {keyBenefits.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-400">
              <span className="text-teal-500">✓</span> {item}
            </li>
          ))}
        </ul>

        <a
          href={cta.href}
          className="mt-8 inline-flex items-center gap-2 font-medium text-teal-400 transition-all duration-200 hover:text-teal-300 hover:gap-3"
        >
          {cta.text}
        </a>
      </div>
    </section>
    </LazySection>
  );
}

const USE_CASES = [
  {
    id: "creators",
    title: "Creators",
    subtitle: "Build and Monetize Your Audience",
    description:
      "Turn your audience into a thriving, revenue-generating community.",
    perfectFor: [
      "Writers",
      "YouTubers",
      "Influencers",
      "Coaches",
      "Newsletter creators",
    ],
    whatYouCanDo: [
      "Create exclusive communities",
      "Offer paid memberships",
      "Sell courses and premium content",
      "Engage directly with your audience",
      "Use AI to automate engagement",
    ],
    keyBenefits: [
      "Generate recurring revenue",
      "Increase audience loyalty",
      "Save time with AI automation",
    ],
    cta: { href: "#", text: "Start Your Creator Community →" },
  },
  {
    id: "startups",
    title: "Startups",
    subtitle: "Build and Engage Your User Community",
    description:
      "Create a space for users, customers, and supporters.",
    perfectFor: ["SaaS companies", "Tech startups", "Product teams"],
    whatYouCanDo: [
      "Build customer communities",
      "Provide support and documentation",
      "Collect feedback",
      "Share product updates",
    ],
    keyBenefits: [
      "Improve customer retention",
      "Reduce support workload",
      "Build brand loyalty",
    ],
    cta: { href: "#", text: "Build Your Startup Community →" },
  },
  {
    id: "educators",
    title: "Educators and Online Schools",
    subtitle: "Deliver Intelligent Learning Experiences",
    description: "Create structured learning communities powered by AI.",
    perfectFor: [
      "Online educators",
      "Course creators",
      "Schools and academies",
    ],
    whatYouCanDo: [
      "Create courses and lessons",
      "Provide AI tutoring and guidance",
      "Facilitate student discussions",
      "Offer paid learning programs",
    ],
    keyBenefits: [
      "Improve learning outcomes",
      "Scale education programs",
      "Monetize courses",
    ],
    cta: { href: "#", text: "Launch Your Learning Community →" },
  },
  {
    id: "professional",
    title: "Professional Communities",
    subtitle: "Connect Professionals and Enable Collaboration",
    description:
      "Build communities for networking, collaboration, and knowledge sharing.",
    perfectFor: [
      "Developer communities",
      "Industry groups",
      "Professional networks",
    ],
    whatYouCanDo: [
      "Facilitate discussions",
      "Share knowledge",
      "Host events",
      "Connect members",
    ],
    keyBenefits: [
      "Increase member engagement",
      "Enable collaboration",
      "Strengthen professional networks",
    ],
    cta: { href: "#", text: "Create Your Professional Community →" },
  },
  {
    id: "businesses",
    title: "Businesses and Brands",
    subtitle: "Build Customer Communities That Drive Growth",
    description: "Create communities for customers, partners, and teams.",
    perfectFor: ["Businesses", "Brands", "Customer communities"],
    whatYouCanDo: [
      "Provide customer support",
      "Share updates and content",
      "Build brand loyalty",
      "Engage customers directly",
    ],
    keyBenefits: [
      "Increase customer retention",
      "Improve customer experience",
      "Strengthen brand relationships",
    ],
    cta: { href: "#", text: "Build Your Brand Community →" },
  },
  {
    id: "enterprises",
    title: "Enterprises",
    subtitle: "Power Large-Scale Community Infrastructure",
    description:
      "Enterprise-grade platform with AI-powered automation.",
    perfectFor: ["Enterprises", "Organizations", "Universities"],
    whatYouCanDo: [
      "Manage large communities",
      "Provide structured knowledge systems",
      "Enable internal collaboration",
      "Automate community management",
    ],
    keyBenefits: [
      "Scale efficiently",
      "Reduce operational costs",
      "Improve organizational knowledge sharing",
    ],
    cta: { href: "#", text: "Contact Enterprise Sales →" },
  },
  {
    id: "events",
    title: "Events and Hackathons",
    subtitle: "Create and Manage Events with AI Assistance",
    description: "Run intelligent events and innovation programs.",
    perfectFor: ["Hackathons", "Conferences", "Community events"],
    whatYouCanDo: [
      "Create and manage events",
      "Enable participant collaboration",
      "Provide AI guidance",
      "Manage teams and submissions",
    ],
    keyBenefits: [
      "Increase event engagement",
      "Simplify event management",
      "Improve participant experience",
    ],
    cta: { href: "#", text: "Launch Your Event Community →" },
  },
];

const AI_BENEFITS = [
  "Automate community management",
  "Improve engagement",
  "Provide instant support",
  "Deliver personalized experiences",
  "Scale efficiently",
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a22_1px,transparent_1px),linear-gradient(to_bottom,#0f172a22_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Built for Every Type of{" "}
            <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              Community
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            From creators and startups to enterprises and educators, the AI
            Community Platform helps you build intelligent, scalable, and
            monetizable communities.
          </p>
          <a
            href="#"
            className="mt-8 inline-block rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-[1.02] hover:bg-teal-400 active:scale-[0.98]"
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* Overview */}
      <LazySection delay={80}>
      <section className="border-y border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            One platform. Endless possibilities.
          </h2>
          <p className="mt-6 max-w-3xl text-lg text-slate-400">
            Whether you&apos;re building a creator community, managing customers,
            running courses, or scaling an organization, our AI-native platform
            provides the tools and intelligence you need.
          </p>
        </div>
      </section>
      </LazySection>

      {/* Use Cases */}
      {USE_CASES.map((useCase) => (
        <UseCaseCard
          key={useCase.id}
          id={useCase.id}
          title={useCase.title}
          subtitle={useCase.subtitle}
          description={useCase.description}
          perfectFor={useCase.perfectFor}
          whatYouCanDo={useCase.whatYouCanDo}
          keyBenefits={useCase.keyBenefits}
          cta={useCase.cta}
        />
      ))}

      {/* AI Benefits Section */}
      <LazySection delay={80}>
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            AI makes every use case more powerful
          </h2>
          <p className="mt-4 text-lg text-slate-400">AI helps you:</p>
          <ul className="mt-6 space-y-3">
            {AI_BENEFITS.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-400">
                <span className="text-teal-500">✓</span> {item}
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 font-medium text-teal-400 transition-all duration-200 hover:text-teal-300 hover:gap-3"
          >
            Get Started Free →
          </a>
        </div>
      </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection delay={80}>
      <section className="border-t border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-950 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Ready to build your intelligent community?
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            Start for free today.
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
              Book a Demo
            </a>
          </div>
        </div>
      </section>
      </LazySection>
    </div>
  );
}
