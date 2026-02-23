import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | AI Community Platform",
  description:
    "Building the future of intelligent communities. We're creating the world's first AI-native platform for communities, knowledge, and collaboration at global scale.",
};

function ContentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-slate-800/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <div className="mt-6 max-w-3xl space-y-4 text-lg text-slate-400">
          {children}
        </div>
      </div>
    </section>
  );
}

const VALUES = [
  {
    name: "Innovation",
    desc: "We push the boundaries of what's possible.",
  },
  {
    name: "Simplicity",
    desc: "We make powerful technology easy to use.",
  },
  {
    name: "Trust",
    desc: "Security and privacy are core priorities.",
  },
  {
    name: "Impact",
    desc: "We build technology that creates meaningful value.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a22_1px,transparent_1px),linear-gradient(to_bottom,#0f172a22_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Building the Future of{" "}
            <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              Intelligent Communities
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            We&apos;re creating the world&apos;s first AI-native platform designed
            to power communities, knowledge, and collaboration at global scale.
          </p>
        </div>
      </section>

      {/* Mission */}
      <ContentSection title="Our Mission">
        <p>
          Our mission is to enable individuals, creators, and organizations to
          build intelligent communities that grow, learn, and operate with the
          help of artificial intelligence.
        </p>
        <p>
          We believe communities are the foundation of learning, innovation, and
          human progress — and AI can make them dramatically more powerful.
        </p>
      </ContentSection>

      {/* Vision */}
      <ContentSection title="Our Vision">
        <p>We envision a future where every community is intelligent.</p>
        <ul className="space-y-2">
          <li className="flex items-center gap-3">
            <span className="text-teal-500">•</span> Where knowledge is
            instantly accessible.
          </li>
          <li className="flex items-center gap-3">
            <span className="text-teal-500">•</span> Where engagement is
            effortless.
          </li>
          <li className="flex items-center gap-3">
            <span className="text-teal-500">•</span> Where communities grow and
            sustain themselves with AI assistance.
          </li>
        </ul>
        <p>
          Our goal is to become the infrastructure layer powering the next
          generation of digital communities.
        </p>
      </ContentSection>

      {/* The Problem */}
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Communities Today Are Limited
          </h2>
          <p className="mt-6 max-w-3xl text-lg text-slate-400">
            Most community platforms provide infrastructure, but not intelligence.
          </p>
          <p className="mt-4 text-slate-400">
            Community owners face constant challenges:
          </p>
          <ul className="mt-4 space-y-2">
            {[
              "Manual moderation and management",
              "Low engagement and retention",
              "Fragmented knowledge",
              "Limited scalability",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-400">
                <span className="text-amber-500">•</span> {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-slate-400">
            Communities require constant effort to operate.
          </p>
          <p className="mt-2 font-medium text-teal-400">
            This limits their potential.
          </p>
        </div>
      </section>

      {/* Our Solution */}
      <section className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            AI-Native From the Ground Up
          </h2>
          <p className="mt-6 max-w-3xl text-lg text-slate-400">
            We built the AI Community Platform from scratch with AI at its core.
          </p>
          <p className="mt-4 text-slate-400">
            Instead of simply hosting communities, our platform actively helps
            them operate, grow, and improve.
          </p>
          <p className="mt-4 text-slate-400">AI assists with:</p>
          <ul className="mt-4 space-y-2">
            {[
              "Answering questions",
              "Organizing knowledge",
              "Automating moderation",
              "Improving engagement",
              "Providing personalized experiences",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-400">
                <span className="text-teal-500">✓</span> {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 font-medium text-teal-400">
            Communities become intelligent systems.
          </p>
        </div>
      </section>

      {/* Our Beliefs */}
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Our Core Beliefs
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Communities are the future of the internet",
                desc: "Communities enable collaboration, learning, and innovation.",
              },
              {
                title: "AI will transform how communities operate",
                desc: "AI can automate operations and improve experiences.",
              },
              {
                title: "Knowledge should be accessible and structured",
                desc: "Information should be easy to find and understand.",
              },
              {
                title: "Technology should amplify human potential",
                desc: "Our goal is to help people build, learn, and grow faster.",
              },
            ].map((belief, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-700/50 bg-slate-800/20 p-6"
              >
                <h3 className="font-semibold text-white">{belief.title}</h3>
                <p className="mt-2 text-slate-400">{belief.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We're Building */}
      <section className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Intelligent Infrastructure for Communities
          </h2>
          <p className="mt-6 max-w-3xl text-slate-400">
            We are building a platform that enables:
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Intelligent community management",
              "AI-powered knowledge systems",
              "Scalable creator ecosystems",
              "AI-driven engagement and discovery",
              "Monetization and business models",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-400">
                <span className="text-teal-500">✓</span> {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 font-medium text-teal-400">
            Our platform becomes the operating system for communities.
          </p>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Supporting Communities Worldwide
          </h2>
          <p className="mt-6 text-slate-400">
            Our platform is designed for:
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "Creators",
              "Educators",
              "Startups",
              "Businesses",
              "Developers",
              "Enterprises",
              "Organizations",
            ].map((item, i) => (
              <span
                key={i}
                className="rounded-full border border-teal-500/30 bg-teal-500/5 px-5 py-2.5 text-sm font-medium text-teal-400"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-8 text-slate-400">
            Anyone building a community can benefit.
          </p>
        </div>
      </section>

      {/* Long-Term Vision */}
      <section className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Building the Future of AI-Powered Communities
          </h2>
          <p className="mt-6 max-w-3xl text-slate-400">
            We are creating a platform where:
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Communities manage themselves",
              "Knowledge organizes itself",
              "AI assists every member",
              "Communities grow intelligently",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-400">
                <span className="text-teal-500">✓</span> {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-slate-400">
            This represents a fundamental evolution in how communities operate.
          </p>
        </div>
      </section>

      {/* Company Values */}
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Our Values
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-700/50 bg-slate-800/20 p-6"
              >
                <h3 className="text-lg font-semibold text-teal-400">
                  {value.name}
                </h3>
                <p className="mt-2 text-slate-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section (Placeholder) */}
      <section className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Our Team
          </h2>
          <p className="mt-6 max-w-3xl text-slate-400">
            We are a team of engineers, designers, and builders focused on
            creating the future of intelligent communities.
          </p>
          <p className="mt-4 rounded-2xl border border-dashed border-slate-600 bg-slate-800/20 px-6 py-12 text-center text-slate-500">
            (Add team member profiles here)
          </p>
        </div>
      </section>

      {/* Join Us */}
      <section className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Join Us in Building the Future
          </h2>
          <p className="mt-6 max-w-3xl text-lg text-slate-400">
            We&apos;re just getting started.
          </p>
          <p className="mt-4 text-slate-400">
            Whether you&apos;re a creator, organization, or innovator, we invite
            you to build with us.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-950 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Start building your intelligent community today
          </h2>
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
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
