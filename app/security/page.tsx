import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security | AI Community Platform",
  description:
    "Enterprise-grade security you can trust. Your data, community, and users are protected by secure infrastructure, advanced access controls, and AI-powered protection.",
};

function SecuritySection({
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
    <section className="border-t border-slate-800/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <p className="mt-4 max-w-3xl text-slate-400">{intro}</p>
        <p className="mt-6 font-medium text-slate-300">Includes:</p>
        <ul className="mt-3 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-400">
              <span className="text-teal-500">✓</span> {item}
            </li>
          ))}
        </ul>
        {closing && (
          <p className="mt-6 font-medium text-teal-400">{closing}</p>
        )}
      </div>
    </section>
  );
}

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a22_1px,transparent_1px),linear-gradient(to_bottom,#0f172a22_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Enterprise-Grade Security{" "}
            <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              You Can Trust
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Your data, your community, and your users are protected by secure
            infrastructure, advanced access controls, and AI-powered protection.
          </p>
          <a
            href="/contact"
            className="mt-8 inline-block rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-400"
          >
            Contact Sales
          </a>
        </div>
      </section>

      {/* Overview */}
      <section className="border-y border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Security Built Into Every Layer
          </h2>
          <p className="mt-6 max-w-3xl text-lg text-slate-400">
            Security is a core foundation of the AI Community Platform. We use
            industry best practices, secure architecture, and continuous
            monitoring to protect your data and your community.
          </p>
          <p className="mt-4 text-slate-400">
            Our platform is designed to meet the security requirements of
            creators, businesses, and enterprises.
          </p>
        </div>
      </section>

      {/* Data Protection */}
      <SecuritySection
        title="Your Data Is Protected"
        intro="We protect your data using modern security standards. Protections include:"
        items={[
          "Encryption in transit (HTTPS / TLS)",
          "Encryption at rest",
          "Secure data storage",
          "Secure backups",
          "Access controls and isolation",
        ]}
        closing="Your data remains secure and protected at all times."
      />

      {/* Authentication and Access Control */}
      <SecuritySection
        title="Secure Authentication and Access Management"
        intro="Control who can access your platform and data. Features include:"
        items={[
          "Secure login system",
          "Role-based access control (RBAC)",
          "Multi-level permission system",
          "Single Sign-On (SSO) support (Enterprise)",
          "Session management and protection",
        ]}
        closing="You control access at every level."
      />

      {/* Infrastructure Security */}
      <SecuritySection
        title="Secure and Reliable Infrastructure"
        intro="Our infrastructure is designed for high security and reliability. Security measures include:"
        items={[
          "Cloud-based secure hosting",
          "Network isolation",
          "Firewall protection",
          "Continuous monitoring",
          "Intrusion detection systems",
        ]}
        closing="Infrastructure is designed for enterprise-scale protection."
      />

      {/* AI Safety and Moderation */}
      <SecuritySection
        title="AI-Powered Protection and Moderation"
        intro="AI helps protect your community. Capabilities include:"
        items={[
          "Spam detection",
          "Abuse detection",
          "Harmful content detection",
          "Automated moderation assistance",
        ]}
        closing="This helps maintain a safe and healthy community."
      />

      {/* Privacy Protection */}
      <SecuritySection
        title="Privacy Is a Core Priority"
        intro="We respect and protect user privacy. Privacy protections include:"
        items={[
          "Strict access controls",
          "Secure handling of personal data",
          "Minimal data access policies",
          "Privacy-focused system design",
        ]}
        closing="Your users' privacy is protected."
      />

      {/* Compliance */}
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Compliance and Best Practices
          </h2>
          <p className="mt-6 max-w-3xl text-slate-400">
            Our platform follows industry-standard security practices. Includes:
          </p>
          <ul className="mt-6 space-y-2">
            {[
              "GDPR-ready architecture",
              "Secure authentication systems",
              "Encryption standards compliance",
              "Secure development practices",
              "Enterprise compliance support available",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-400">
                <span className="text-teal-500">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Reliability and Availability */}
      <SecuritySection
        title="High Availability and Reliability"
        intro="Our platform is built for continuous availability. Includes:"
        items={[
          "99.9% uptime target",
          "Redundant systems",
          "Automatic failover protection",
          "Continuous monitoring",
        ]}
        closing="Your community stays online and accessible."
      />

      {/* Secure Development */}
      <SecuritySection
        title="Secure Development Practices"
        intro="Security is integrated into our development process. Includes:"
        items={[
          "Secure coding practices",
          "Regular security reviews",
          "Continuous system monitoring",
          "Rapid security updates",
        ]}
        closing="We continuously improve security."
      />

      {/* Customer Controls */}
      <SecuritySection
        title="You Stay in Control"
        intro="You maintain control over your community and data. Controls include:"
        items={[
          "User permission management",
          "Content moderation controls",
          "Privacy settings",
          "Community access controls",
        ]}
        closing="You define your community's security."
      />

      {/* Incident Response */}
      <section className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Rapid Response to Security Issues
          </h2>
          <p className="mt-6 max-w-3xl text-slate-400">
            We actively monitor systems and respond quickly to threats. Includes:
          </p>
          <ul className="mt-6 space-y-2">
            {[
              "Continuous monitoring",
              "Rapid incident response",
              "Security investigation procedures",
              "System recovery protocols",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-400">
                <span className="text-teal-500">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Trust and Transparency */}
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Built for Trust
          </h2>
          <p className="mt-6 max-w-3xl text-slate-400">
            We are committed to protecting your data and maintaining transparency.
          </p>
          <p className="mt-4 font-medium text-teal-400">
            Security is a continuous priority.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-950 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Secure Your Community With Confidence
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            Learn more about enterprise security and compliance.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/contact"
              className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-400"
            >
              Contact Sales
            </a>
            <a
              href="/contact"
              className="rounded-xl border border-slate-600 px-8 py-4 text-base font-semibold text-slate-200 transition-colors hover:border-teal-500/50 hover:text-teal-400"
            >
              Book Security Review
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
