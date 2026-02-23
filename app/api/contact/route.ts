import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const CONTACT_EMAIL = "info@francescatabor.com";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  company: z.string().optional(),
  role: z.string().optional(),
  inquiryType: z.enum([
    "customer-support",
    "bug-report",
    "sales",
    "demo",
    "enterprise",
    "partnership",
    "general",
  ]),
  communitySize: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Email service is not configured. Please add RESEND_API_KEY to your environment." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "AI Community Platform <onboarding@resend.dev>";

    const inquiryLabels: Record<string, string> = {
      "customer-support": "Customer Support Request",
      "bug-report": "Bug Report",
      sales: "Sales Inquiry",
      demo: "Demo Request",
      enterprise: "Enterprise Inquiry",
      partnership: "Partnership",
      general: "General Question",
    };

    const subject = `[${inquiryLabels[data.inquiryType]}] From ${data.firstName} ${data.lastName}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a;">New Contact Form Submission</h2>
        <p style="color: #64748b; margin-bottom: 24px;">Request type: <strong>${inquiryLabels[data.inquiryType]}</strong></p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.firstName} ${data.lastName}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          ${data.company ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Company</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.company}</td></tr>` : ""}
          ${data.role ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Role</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.role}</td></tr>` : ""}
          ${data.communitySize ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Community Size</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.communitySize}</td></tr>` : ""}
        </table>
        
        <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px;">
          <p style="color: #64748b; margin: 0 0 8px 0;">Message:</p>
          <p style="white-space: pre-wrap; margin: 0; color: #0f172a;">${escapeHtml(data.message)}</p>
        </div>
      </div>
    `;

    const { data: sendData, error } = await resend.emails.send({
      from: fromEmail,
      to: [CONTACT_EMAIL],
      replyTo: data.email,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: sendData?.id });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
