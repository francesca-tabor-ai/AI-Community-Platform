"use client";

import Link from "next/link";
import { useState } from "react";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-50";

const labelClass = "block text-sm font-medium text-slate-300";
const helperClass = "mt-1.5 text-xs text-slate-500";

const DEVELOPER_TYPES = [
  { value: "individual", label: "Individual developer" },
  { value: "company", label: "Company or organization" },
] as const;

const APP_CATEGORIES = [
  { value: "automation", label: "Automation & Workflows" },
  { value: "analytics", label: "Analytics & Insights" },
  { value: "communication", label: "Communication" },
  { value: "ai-ml", label: "AI & Machine Learning" },
  { value: "productivity", label: "Productivity" },
  { value: "payments", label: "Payments & Monetization" },
  { value: "security", label: "Security & Compliance" },
  { value: "other", label: "Other" },
] as const;

const INTEGRATION_TYPES = [
  { value: "public", label: "Public app — listed in the marketplace for all communities" },
  { value: "private", label: "Private app — for internal use or specific customers only" },
  { value: "both", label: "Both — public listing with optional private installations" },
] as const;

const TECHNICAL_APPROACHES = [
  { value: "api", label: "REST API" },
  { value: "webhooks", label: "Webhooks (event subscriptions)" },
  { value: "oauth", label: "OAuth / Connected accounts" },
  { value: "api-webhooks", label: "API + Webhooks" },
  { value: "embed", label: "Embedded app / iframe" },
  { value: "other", label: "Other (describe below)" },
] as const;

const LAUNCH_TIMELINES = [
  { value: "already-live", label: "Already live elsewhere" },
  { value: "0-4-weeks", label: "Within 4 weeks" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "exploring", label: "Still exploring / no timeline yet" },
] as const;

export default function BuildAppForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      // Contact & Company
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      developerType: formData.get("developerType"),
      companyName: formData.get("companyName") || undefined,
      website: formData.get("website") || undefined,
      country: formData.get("country") || undefined,
      // App overview
      appName: formData.get("appName"),
      tagline: formData.get("tagline") || undefined,
      description: formData.get("description"),
      category: formData.get("category"),
      integrationType: formData.get("integrationType"),
      // Technical
      technicalApproach: formData.get("technicalApproach"),
      technicalApproachOther: formData.get("technicalApproachOther") || undefined,
      documentationUrl: formData.get("documentationUrl") || undefined,
      demoUrl: formData.get("demoUrl") || undefined,
      launchTimeline: formData.get("launchTimeline"),
      // Agreement
      agreeTerms: formData.get("agreeTerms") === "on",
      // Optional
      howDidYouHear: formData.get("howDidYouHear") || undefined,
    };

    try {
      const res = await fetch("/api/marketplace-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/20 text-3xl text-teal-400">
          ✓
        </div>
        <h3 className="mt-6 text-xl font-semibold text-white">Application received</h3>
        <p className="mt-3 max-w-md mx-auto text-slate-400">
          Thanks for your interest in building on the AI Community Platform. Our team will review your application
          and get back to you within 5–7 business days.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          We&apos;ll send next steps to the email you provided.
        </p>
        <Link
          href="/marketplace"
          className="mt-8 inline-block rounded-xl bg-teal-500 px-6 py-3 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-16">
      {/* Section 1: Contact & Company */}
      <section>
        <div className="mb-8">
          <span className="inline-flex items-center justify-center rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-400">
            Step 1
          </span>
          <h2 className="mt-3 text-2xl font-bold text-white">
            Contact & Company
          </h2>
          <p className="mt-1 text-slate-400">
            Tell us who you are and how to reach you.
          </p>
        </div>
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={labelClass}>First name</label>
              <input id="firstName" name="firstName" type="text" required className={inputClass} placeholder="Jane" />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Last name</label>
              <input id="lastName" name="lastName" type="text" required className={inputClass} placeholder="Doe" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Work email</label>
            <input id="email" name="email" type="email" required className={inputClass} placeholder="jane@company.com" />
            <p className={helperClass}>We&apos;ll use this for all correspondence about your application.</p>
          </div>
          <div>
            <label className={labelClass}>Developer type</label>
            <div className="mt-3 flex flex-wrap gap-4">
              {DEVELOPER_TYPES.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="developerType"
                    value={opt.value}
                    required
                    className="h-4 w-4 border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500"
                  />
                  <span className="text-slate-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="companyName" className={labelClass}>Company or organization name</label>
            <input id="companyName" name="companyName" type="text" className={inputClass} placeholder="Acme Inc." />
            <p className={helperClass}>Leave blank if you&apos;re applying as an individual.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="website" className={labelClass}>Website</label>
              <input id="website" name="website" type="url" className={inputClass} placeholder="https://yourproduct.com" />
            </div>
            <div>
              <label htmlFor="country" className={labelClass}>Country</label>
              <input id="country" name="country" type="text" className={inputClass} placeholder="United States" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: App Overview */}
      <section className="border-t border-slate-800/50 pt-16">
        <div className="mb-8">
          <span className="inline-flex items-center justify-center rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-400">
            Step 2
          </span>
          <h2 className="mt-3 text-2xl font-bold text-white">
            App overview
          </h2>
          <p className="mt-1 text-slate-400">
            Describe your app and how it helps communities.
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="appName" className={labelClass}>App name</label>
            <input id="appName" name="appName" type="text" required className={inputClass} placeholder="My Community Tool" />
          </div>
          <div>
            <label htmlFor="tagline" className={labelClass}>Tagline</label>
            <input id="tagline" name="tagline" type="text" className={inputClass} placeholder="One-line description of your app" />
            <p className={helperClass}>Short, descriptive. Shown in marketplace listings.</p>
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              className={inputClass}
              placeholder="Explain what your app does, who it's for, and how it integrates with communities..."
            />
            <p className={helperClass}>Help us understand the value proposition and use case. Include key features if relevant.</p>
          </div>
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <select id="category" name="category" required className={inputClass}>
              <option value="">Select a category</option>
              {APP_CATEGORIES.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Distribution type</label>
            <div className="mt-3 space-y-3">
              {INTEGRATION_TYPES.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="integrationType"
                    value={opt.value}
                    required
                    className="mt-1 h-4 w-4 border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500"
                  />
                  <span className="text-slate-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Technical Details */}
      <section className="border-t border-slate-800/50 pt-16">
        <div className="mb-8">
          <span className="inline-flex items-center justify-center rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-400">
            Step 3
          </span>
          <h2 className="mt-3 text-2xl font-bold text-white">
            Technical details
          </h2>
          <p className="mt-1 text-slate-400">
            How will your app integrate with our platform?
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Technical approach</label>
            <select id="technicalApproach" name="technicalApproach" required className={inputClass}>
              <option value="">Select integration method</option>
              {TECHNICAL_APPROACHES.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div id="technicalApproachOther-wrap">
            <label htmlFor="technicalApproachOther" className={labelClass}>Additional technical details</label>
            <textarea
              id="technicalApproachOther"
              name="technicalApproachOther"
              rows={3}
              className={inputClass}
              placeholder="If you selected 'Other', or want to add details about OAuth scopes, API usage, etc..."
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="documentationUrl" className={labelClass}>Documentation URL</label>
              <input id="documentationUrl" name="documentationUrl" type="url" className={inputClass} placeholder="https://docs.yourapp.com" />
            </div>
            <div>
              <label htmlFor="demoUrl" className={labelClass}>Demo or preview URL</label>
              <input id="demoUrl" name="demoUrl" type="url" className={inputClass} placeholder="https://demo.yourapp.com" />
              <p className={helperClass}>Optional. Helps speed up review.</p>
            </div>
          </div>
          <div>
            <label htmlFor="launchTimeline" className={labelClass}>Expected launch timeline</label>
            <select id="launchTimeline" name="launchTimeline" required className={inputClass}>
              <option value="">Select timeline</option>
              {LAUNCH_TIMELINES.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Section 4: Agreement */}
      <section className="border-t border-slate-800/50 pt-16">
        <div className="mb-8">
          <span className="inline-flex items-center justify-center rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-400">
            Step 4
          </span>
          <h2 className="mt-3 text-2xl font-bold text-white">
            Agreement
          </h2>
          <p className="mt-1 text-slate-400">
            Review and accept our marketplace terms.
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="howDidYouHear" className={labelClass}>How did you hear about us?</label>
            <select id="howDidYouHear" name="howDidYouHear" className={inputClass}>
              <option value="">Select an option</option>
              <option value="search">Search / Google</option>
              <option value="social">Social media</option>
              <option value="referral">Referral</option>
              <option value="blog">Blog or article</option>
              <option value="event">Event or conference</option>
              <option value="other">Other</option>
            </select>
          </div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="agreeTerms"
              required
              className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500"
            />
            <span className="text-slate-300">
              I agree to the{" "}
              <Link href="/contact" className="text-teal-400 underline hover:text-teal-300">
                Marketplace Partner Agreement
              </Link>{" "}
              and{" "}
              <Link href="/contact" className="text-teal-400 underline hover:text-teal-300">
                Developer Terms of Service
              </Link>
              . I confirm that my app will comply with security best practices, privacy requirements, and platform guidelines.
            </span>
          </label>
        </div>
      </section>

      {status === "error" && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-slate-800/50 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Applications are typically reviewed within 5–7 business days. Questions?{" "}
          <Link href="/contact" className="text-teal-400 hover:text-teal-300">Contact us</Link>.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400 disabled:opacity-50"
        >
          {status === "submitting" ? "Submitting..." : "Submit application"}
        </button>
      </div>
    </form>
  );
}
