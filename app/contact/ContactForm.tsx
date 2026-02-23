"use client";

import { useState } from "react";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

const INQUIRY_TYPES = [
  { value: "customer-support", label: "Customer Support Request" },
  { value: "bug-report", label: "Bug Report" },
  { value: "sales", label: "Sales Inquiry" },
  { value: "demo", label: "Demo Request" },
  { value: "enterprise", label: "Enterprise Inquiry" },
  { value: "partnership", label: "Partnership" },
  { value: "general", label: "General Question" },
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      company: formData.get("company") || undefined,
      role: formData.get("role") || undefined,
      inquiryType: formData.get("inquiryType"),
      communitySize: formData.get("communitySize") || undefined,
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-300">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            className={inputClass}
            placeholder="First name"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-slate-300">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            className={inputClass}
            placeholder="Last name"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-300">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
          placeholder="you@company.com"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-slate-300">
            Company Name <span className="text-slate-500">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className={inputClass}
            placeholder="Your company"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-300">
            Role <span className="text-slate-500">(optional)</span>
          </label>
          <input
            id="role"
            name="role"
            type="text"
            className={inputClass}
            placeholder="Your role"
          />
        </div>
      </div>
      <div>
        <label htmlFor="inquiryType" className="block text-sm font-medium text-slate-300">
          Request Type
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          required
          className={inputClass}
        >
          <option value="">Select request type</option>
          {INQUIRY_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="communitySize" className="block text-sm font-medium text-slate-300">
          Community Size <span className="text-slate-500">(optional)</span>
        </label>
        <select id="communitySize" name="communitySize" className={inputClass}>
          <option value="">Select community size</option>
          <option value="just-started">Just getting started</option>
          <option value="1-100">1–100 members</option>
          <option value="100-1000">100–1,000 members</option>
          <option value="1000-10000">1,000–10,000 members</option>
          <option value="10000+">10,000+ members</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-300">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={inputClass}
          placeholder="How can we help?"
        />
      </div>
      {status === "error" && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {errorMessage}
        </div>
      )}
      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-slate-950 transition-all hover:bg-teal-400 disabled:opacity-50"
        >
          {status === "submitting"
            ? "Sending..."
            : status === "success"
              ? "Message sent! We'll be in touch."
              : "Send Message"}
        </button>
        <p className="mt-4 text-sm text-slate-500">
          All submissions are sent to info@francescatabor.com. We typically respond within 24 hours.
        </p>
      </div>
    </form>
  );
}
