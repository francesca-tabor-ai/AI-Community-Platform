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
      <section id={id} className="border-t border-slate-200 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h2>
        <p className="mt-2 text-xl font-medium text-violet-600">{subtitle}</p>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">{description}</p>

        <p className="mt-8 font-medium text-slate-700">Perfect for:</p>
        <ul className="mt-3 flex flex-wrap gap-3">
          {perfectFor.map((item, i) => (
            <li
              key={i}
              className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition-all duration-200 hover:border-violet-300 hover:bg-violet-100 active:scale-[0.97]"
            >
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-8 font-medium text-slate-700">What you can do:</p>
        <ul className="mt-3 space-y-2">
          {whatYouCanDo.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-600">
              <span className="text-violet-500">✓</span> {item}
            </li>
          ))}
        </ul>

        <p className="mt-8 font-medium text-slate-700">Key benefits:</p>
        <ul className="mt-3 space-y-2">
          {keyBenefits.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-600">
              <span className="text-violet-500">✓</span> {item}
            </li>
          ))}
        </ul>

        <a
          href={cta.href}
          className="mt-8 inline-flex items-center gap-2 font-medium text-violet-600 transition-colors hover:text-violet-700 hover:gap-3"
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
    cta: { href: "/signup", text: "Start Your Creator Community →" },
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
    cta: { href: "/signup", text: "Build Your Startup Community →" },
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
    cta: { href: "/signup", text: "Launch Your Learning Community →" },
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
    cta: { href: "/signup", text: "Create Your Professional Community →" },
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
    cta: { href: "/signup", text: "Build Your Brand Community →" },
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
    cta: { href: "/contact", text: "Contact Enterprise Sales →" },
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
    cta: { href: "/signup", text: "Launch Your Event Community →" },
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
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_0.5px,transparent_0.5px),linear-gradient(to_bottom,#e2e8f0_0.5px,transparent_0.5px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Built for Every Type of{" "}
            <span className="text-gradient-accent">
              Community
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            From creators and startups to enterprises and educators, the AI
            Community Platform helps you build intelligent, scalable, and
            monetizable communities.
          </p>
          <a
            href="/signup"
            className="mt-8 inline-block rounded-xl bg-violet-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:bg-violet-600 hover:shadow-violet-500/30 active:scale-[0.98]"
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
            One platform. Endless possibilities.
          </h2>
          <p className="mt-6 max-w-3xl text-lg text-slate-600">
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
      <section className="border-t border-slate-200 bg-slate-50/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            AI makes every use case more powerful
          </h2>
          <p className="mt-4 text-lg text-slate-600">AI helps you:</p>
          <ul className="mt-6 space-y-3">
            {AI_BENEFITS.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600">
                <span className="text-violet-500">✓</span> {item}
              </li>
            ))}
          </ul>
          <a
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 font-medium text-violet-600 transition-colors hover:text-violet-700 hover:gap-3"
          >
            Get Started Free →
          </a>
        </div>
      </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection delay={80}>
      <section className="relative overflow-hidden border-t border-slate-200 py-24">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#334155_0%,#0f172a_100%)]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ready to build your intelligent community?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
            Start for free today.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/signup"
              className="rounded-xl bg-violet-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:bg-violet-600 hover:shadow-violet-500/40 active:scale-[0.98]"
            >
              Get Started Free
            </a>
            <a
              href="/contact"
              className="rounded-xl border border-slate-400 bg-slate-700/80 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-600/80 active:scale-[0.98]"
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
