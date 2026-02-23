import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const CONTACT_EMAIL = "info@francescatabor.com";

const applySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  developerType: z.enum(["individual", "company"]),
  companyName: z.string().optional(),
  website: z.string().optional(),
  country: z.string().optional(),
  appName: z.string().min(1, "App name is required"),
  tagline: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  integrationType: z.enum(["public", "private", "both"]),
  technicalApproach: z.string().min(1, "Technical approach is required"),
  technicalApproachOther: z.string().optional(),
  documentationUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  launchTimeline: z.string().min(1, "Launch timeline is required"),
  agreeTerms: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
  howDidYouHear: z.string().optional(),
});

const CATEGORY_LABELS: Record<string, string> = {
  automation: "Automation & Workflows",
  analytics: "Analytics & Insights",
  communication: "Communication",
  "ai-ml": "AI & Machine Learning",
  productivity: "Productivity",
  payments: "Payments & Monetization",
  security: "Security & Compliance",
  other: "Other",
};

const INTEGRATION_LABELS: Record<string, string> = {
  public: "Public app (marketplace listing)",
  private: "Private app (internal/specific customers)",
  both: "Both public and private",
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
}

function row(label: string, value: string | undefined): string {
  if (!value) return "";
  return `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 180px;">${escapeHtml(label)}</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(value)}</td></tr>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = applySchema.safeParse(body);

    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? "Invalid form data";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const d = parsed.data;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Application service is not configured." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "AI Community Platform <onboarding@resend.dev>";

    const html = `
      <div style="font-family: sans-serif; max-width: 620px; margin: 0 auto;">
        <h2 style="color: #0f172a;">New App Marketplace Application</h2>
        <p style="color: #64748b; margin-bottom: 24px;">
          <strong>${escapeHtml(d.appName)}</strong> — ${escapeHtml(d.firstName)} ${escapeHtml(d.lastName)}
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          ${row("Name", `${d.firstName} ${d.lastName}`)}
          ${row("Email", d.email)}
          ${row("Developer type", d.developerType === "company" ? "Company" : "Individual")}
          ${row("Company", d.companyName)}
          ${row("Website", d.website)}
          ${row("Country", d.country)}
        </table>

        <h3 style="color: #0f172a; margin-top: 28px;">App Overview</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${row("App name", d.appName)}
          ${row("Tagline", d.tagline)}
          ${row("Category", CATEGORY_LABELS[d.category] ?? d.category)}
          ${row("Distribution", INTEGRATION_LABELS[d.integrationType] ?? d.integrationType)}
        </table>
        
        <div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 8px;">
          <p style="color: #64748b; margin: 0 0 8px 0;">Description:</p>
          <p style="white-space: pre-wrap; margin: 0; color: #0f172a;">${escapeHtml(d.description)}</p>
        </div>

        <h3 style="color: #0f172a; margin-top: 28px;">Technical Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${row("Technical approach", d.technicalApproach)}
          ${row("Documentation URL", d.documentationUrl)}
          ${row("Demo URL", d.demoUrl)}
          ${row("Launch timeline", d.launchTimeline)}
        </table>
        ${d.technicalApproachOther ? `
        <div style="margin-top: 12px; padding: 12px; background: #f1f5f9; border-radius: 6px;">
          <p style="margin: 0; font-size: 14px; color: #475569;">${escapeHtml(d.technicalApproachOther)}</p>
        </div>
        ` : ""}

        ${d.howDidYouHear ? `<p style="margin-top: 20px; color: #64748b; font-size: 13px;">How they heard about us: ${escapeHtml(d.howDidYouHear)}</p>` : ""}
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [CONTACT_EMAIL],
      replyTo: d.email,
      subject: `[App Marketplace] New application: ${d.appName}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to submit application" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Marketplace apply API error:", err);
    return NextResponse.json(
      { error: "Failed to process your application" },
      { status: 500 }
    );
  }
}
