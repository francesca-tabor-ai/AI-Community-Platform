"use client";

import { useState } from "react";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("submitting");
        // Placeholder - wire to your backend/API
        setTimeout(() => setStatus("success"), 1000);
      }}
      className="space-y-6"
    >
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
          Inquiry Type
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          required
          className={inputClass}
        >
          <option value="">Select inquiry type</option>
          <option value="sales">Sales inquiry</option>
          <option value="demo">Demo request</option>
          <option value="support">Support</option>
          <option value="enterprise">Enterprise inquiry</option>
          <option value="partnership">Partnership</option>
          <option value="general">General question</option>
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
          We typically respond within 24 hours.
        </p>
      </div>
    </form>
  );
}
