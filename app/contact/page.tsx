import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | AI Community Platform",
  description:
    "Get in touch with our team. Have questions? Want a demo? We're here to help you build and scale your intelligent community.",
};

const CONTACT_OPTIONS = [
  {
    title: "Customer Support",
    desc: "Get help with your account, technical questions, or platform usage.",
    cta: "Contact Support",
    href: "#form",
  },
  {
    title: "Bug Reports",
    desc: "Found an issue? Let us know so we can fix it.",
    cta: "Report a Bug",
    href: "#form",
  },
  {
    title: "Sales Inquiries",
    desc: "Learn how the AI Community Platform can support your organization.",
    cta: "Contact Sales",
    href: "#form",
  },
  {
    title: "Request a Demo",
    desc: "See how the platform works with a personalized walkthrough.",
    cta: "Book a Demo",
    href: "#form",
  },
];

const FAQ_ITEMS = [
  {
    q: "How quickly will I get a response?",
    a: "We typically respond within 24 hours.",
  },
  {
    q: "Can I request a demo?",
    a: "Yes. Book a demo anytime.",
  },
  {
    q: "Do you offer enterprise plans?",
    a: "Yes. Contact sales for details.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a22_1px,transparent_1px),linear-gradient(to_bottom,#0f172a22_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Get in <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Have questions? Want a demo? Our team is here to help you build and
            scale your intelligent community.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="border-y border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
            Choose the Best Way to Reach Us
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACT_OPTIONS.map((option, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-700/50 bg-slate-800/20 p-6 transition-colors hover:border-teal-500/30"
              >
                <h3 className="font-semibold text-white">{option.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{option.desc}</p>
                <a
                  href={option.href}
                  className="mt-4 inline-block text-sm font-medium text-teal-400 hover:text-teal-300"
                >
                  {option.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="form" className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Send Us a Message
          </h2>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Enterprise Contact */}
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Enterprise and Large Organizations
          </h2>
          <p className="mt-6 max-w-3xl text-slate-400">
            If you&apos;re building a large-scale community or need enterprise
            features, our team can help.
          </p>
          <p className="mt-4 font-medium text-slate-300">
            Enterprise support includes:
          </p>
          <ul className="mt-4 space-y-2">
            {[
              "Custom onboarding",
              "Dedicated account management",
              "Enterprise security support",
              "Custom integrations",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-400">
                <span className="text-teal-500">✓</span> {item}
              </li>
            ))}
          </ul>
          <a
            href="/enterprise#contact"
            className="mt-6 inline-block rounded-xl bg-teal-500 px-6 py-3 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400"
          >
            Contact Enterprise Sales
          </a>
        </div>
      </section>

      {/* Demo Section */}
      <section className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Request a Live Demo
          </h2>
          <p className="mt-6 max-w-3xl text-slate-400">
            See how the AI Community Platform can power your community.
          </p>
          <p className="mt-4 font-medium text-slate-300">Demo includes:</p>
          <ul className="mt-4 space-y-2">
            {[
              "Platform walkthrough",
              "Feature overview",
              "AI assistant demonstration",
              "Q&A session",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-400">
                <span className="text-teal-500">✓</span> {item}
              </li>
            ))}
          </ul>
          <a
            href="/contact#form"
            className="mt-6 inline-block rounded-xl bg-teal-500 px-6 py-3 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400"
          >
            Book a Demo
          </a>
        </div>
      </section>

      {/* Support Section */}
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Need Help?
          </h2>
          <p className="mt-6 text-slate-400">
            Visit our Help Center or contact support.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="/help"
              className="rounded-xl bg-teal-500 px-6 py-3 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400"
            >
              Visit Help Center
            </a>
            <a
              href="#form"
              className="rounded-xl border border-slate-600 px-6 py-3 text-base font-semibold text-slate-200 transition-colors hover:border-teal-500/50 hover:text-teal-400"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

      {/* Additional Contact Information */}
      <section className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Email Us
          </h2>
          <p className="mt-2 text-slate-400">
            All inquiries—customer support, bug reports, sales, and general questions—go to:
          </p>
          <a
            href="mailto:info@francescatabor.com"
            className="mt-4 inline-block text-lg font-medium text-teal-400 hover:text-teal-300"
          >
            info@francescatabor.com
          </a>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="border-t border-slate-800/50 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Common Questions
          </h2>
          <dl className="mt-8 space-y-6">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <dt className="font-medium text-white">{item.q}</dt>
                <dd className="mt-1 text-slate-400">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-950 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Ready to Build Your Intelligent Community?
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            Start for free or talk to our team.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/signup"
              className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-400"
            >
              Get Started Free
            </a>
            <a
              href="/contact"
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
