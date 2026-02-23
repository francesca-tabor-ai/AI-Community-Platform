"use client";

import { useState } from "react";

export default function EnterpriseContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim() || "";
    const [firstName, ...lastParts] = name.split(/\s+/);
    const lastName = lastParts.join(" ") || firstName;

    const payload = {
      firstName,
      lastName,
      email: formData.get("email"),
      company: formData.get("company") || undefined,
      role: formData.get("role") || undefined,
      inquiryType: "enterprise",
      communitySize: formData.get("communitySize") || undefined,
      message: formData.get("message") || "Enterprise inquiry",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <form
      className="mt-10 grid gap-6 sm:grid-cols-2"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200"
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-slate-700">
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          required
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200"
          placeholder="Your company"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-700">
          Role
        </label>
        <input
          id="role"
          name="role"
          type="text"
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200"
          placeholder="Your role"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="community-size" className="block text-sm font-medium text-slate-700">
          Community Size
        </label>
        <select
          id="community-size"
          name="communitySize"
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200"
        >
          <option value="">Select community size</option>
          <option value="1-1000">1 – 1,000</option>
          <option value="1000-10000">1,000 – 10,000</option>
          <option value="10000-50000">10,000 – 50,000</option>
          <option value="50000-100000">50,000 – 100,000</option>
          <option value="100000+">100,000+</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="block text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200"
          placeholder="Tell us about your community needs..."
        />
      </div>
      {status === "error" && (
        <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </div>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-xl bg-violet-500 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-violet-600 disabled:opacity-50"
        >
          {status === "submitting"
            ? "Submitting..."
            : status === "success"
              ? "Thank you! We'll be in touch."
              : "Contact Sales"}
        </button>
      </div>
    </form>
  );
}
