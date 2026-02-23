/**
 * Email Service Provider (ESP) client wrapper.
 * Uses Resend as the ESP. Abstracts send logic for potential multi-ESP support.
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "AI Community Platform <onboarding@resend.dev>";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  /** Optional: Resend supports text-only for some templates */
  text?: string;
}

export interface SendResult {
  success: boolean;
  id?: string;
  error?: string;
}

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(RESEND_API_KEY);
  return _resend;
}

export async function sendEmail(params: SendEmailParams): Promise<SendResult> {
  const resend = getResend();
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY is not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      reply_to: params.replyTo,
      text: params.text,
    });

    if (error) {
      return { success: false, error: error.message, id: data?.id };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

export function getUnsubscribeUrl(email: string): string {
  return `${APP_URL}/api/email/unsubscribe?email=${encodeURIComponent(email)}`;
}

export function getAppUrl(): string {
  return APP_URL;
}
