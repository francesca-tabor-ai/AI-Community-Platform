import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | AI Community Platform",
  description: "Privacy Policy for the AI Community Platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <article className="mx-auto max-w-3xl px-6 py-24">
        <Link
          href="/"
          className="text-sm font-medium text-teal-400 hover:text-teal-300"
        >
          ← Back to Home
        </Link>
        <h1 className="mt-6 text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-4 text-slate-500">Last updated: February 2025</p>
        <div className="mt-10 space-y-6 text-slate-400">
          <p>
            We respect your privacy. AI Community Platform is designed with
            privacy and data protection in mind.
          </p>
          <p>
            We collect only what is necessary to provide our services. Your data
            is encrypted, stored securely, and we do not sell your information.
          </p>
          <p>
            For questions or to exercise your privacy rights, contact us at{" "}
            <a
              href="mailto:info@francescatabor.com"
              className="text-teal-400 hover:text-teal-300"
            >
              info@francescatabor.com
            </a>
          </p>
          <Link
            href="/contact"
            className="inline-block text-teal-400 hover:text-teal-300"
          >
            Contact us for full privacy policy →
          </Link>
        </div>
      </article>
    </div>
  );
}
