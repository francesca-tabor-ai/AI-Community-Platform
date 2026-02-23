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
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_0.5px,transparent_0.5px),linear-gradient(to_bottom,#e2e8f0_0.5px,transparent_0.5px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Get in <span className="text-gradient-accent">Touch</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Have questions? Want a demo? Our team is here to help you build and
            scale your intelligent community.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="border-y border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Choose the Best Way to Reach Us
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACT_OPTIONS.map((option, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-violet-200 hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-900">{option.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{option.desc}</p>
                <a
                  href={option.href}
                  className="mt-4 inline-block text-sm font-medium text-violet-600 transition-colors hover:text-violet-700"
                >
                  {option.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="form" className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Send Us a Message
          </h2>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Enterprise Contact */}
      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Enterprise and Large Organizations
          </h2>
          <p className="mt-6 max-w-3xl text-slate-600">
            If you&apos;re building a large-scale community or need enterprise
            features, our team can help.
          </p>
          <p className="mt-4 font-medium text-slate-700">
            Enterprise support includes:
          </p>
          <ul className="mt-4 space-y-2">
            {[
              "Custom onboarding",
              "Dedicated account management",
              "Enterprise security support",
              "Custom integrations",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600">
                <span className="text-violet-500">✓</span> {item}
              </li>
            ))}
          </ul>
          <a
            href="/enterprise#contact"
            className="mt-6 inline-block rounded-xl bg-violet-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-violet-600"
          >
            Contact Enterprise Sales
          </a>
        </div>
      </section>

      {/* Demo Section */}
      <section className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Request a Live Demo
          </h2>
          <p className="mt-6 max-w-3xl text-slate-600">
            See how the AI Community Platform can power your community.
          </p>
          <p className="mt-4 font-medium text-slate-700">Demo includes:</p>
          <ul className="mt-4 space-y-2">
            {[
              "Platform walkthrough",
              "Feature overview",
              "AI assistant demonstration",
              "Q&A session",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600">
                <span className="text-violet-500">✓</span> {item}
              </li>
            ))}
          </ul>
          <a
            href="/contact#form"
            className="mt-6 inline-block rounded-xl bg-violet-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-violet-600"
          >
            Book a Demo
          </a>
        </div>
      </section>

      {/* Support Section */}
      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Need Help?
          </h2>
          <p className="mt-6 text-slate-600">
            Visit our Help Center or contact support.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="/help"
              className="rounded-xl bg-violet-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-violet-600"
            >
              Visit Help Center
            </a>
            <a
              href="#form"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

      {/* Additional Contact Information */}
      <section className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Email Us
          </h2>
          <p className="mt-2 text-slate-600">
            All inquiries—customer support, bug reports, sales, and general questions—go to:
          </p>
          <a
            href="mailto:info@francescatabor.com"
            className="mt-4 inline-block text-lg font-medium text-violet-600 transition-colors hover:text-violet-700"
          >
            info@francescatabor.com
          </a>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Common Questions
          </h2>
          <dl className="mt-8 space-y-6">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <dt className="font-medium text-slate-900">{item.q}</dt>
                <dd className="mt-1 text-slate-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Ready to Build Your Intelligent Community?
          </h2>
          <p className="mt-6 text-lg text-slate-600">
            Start for free or talk to our team.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/signup"
              className="rounded-xl bg-violet-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-colors hover:bg-violet-600"
            >
              Get Started Free
            </a>
            <a
              href="/contact"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
