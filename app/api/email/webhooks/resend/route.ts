/**
 * Resend webhook handler - processes bounces and complaints for list hygiene.
 * Configure in Resend Dashboard: https://resend.com/webhooks
 * Events: email.bounced, email.complained, email.delivered
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ResendWebhookPayload {
  type: "email.bounced" | "email.complained" | "email.delivered";
  created_at: string;
  data: {
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
    bounce?: { type: string; subType?: string; message?: string };
    [key: string]: unknown;
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as ResendWebhookPayload;

    if (!payload.type || !payload.data) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const emails = Array.isArray(payload.data.to)
      ? payload.data.to
      : typeof payload.data.to === "string"
        ? [payload.data.to]
        : [];

    for (const rawEmail of emails) {
      const email = extractEmail(rawEmail);
      if (!email) continue;

      const feedbackType = mapEventToFeedbackType(payload.type);
      if (!feedbackType) continue;

      await prisma.emailFeedback.create({
        data: {
          email: email.toLowerCase(),
          type: feedbackType,
          espEventId: payload.data.email_id ?? null,
          rawPayload: payload as object,
        },
      });

      // List hygiene: hard bounces and complaints → add to unsubscribe
      if (
        payload.type === "email.bounced" ||
        payload.type === "email.complained"
      ) {
        const isHardBounce =
          payload.type === "email.bounced" &&
          payload.data.bounce?.type === "Permanent";

        if (payload.type === "email.complained" || isHardBounce) {
          await prisma.emailUnsubscribe.upsert({
            where: { email: email.toLowerCase() },
            create: {
              email: email.toLowerCase(),
              reason:
                payload.type === "email.complained"
                  ? "spam_complaint"
                  : "hard_bounce",
            },
            update: {}, // Idempotent
          });
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[email/webhooks/resend] Error:", err);
    return NextResponse.json({ received: true }, { status: 200 });
    // Always return 200 to prevent Resend from retrying
  }
}

function extractEmail(to: string): string | null {
  if (!to || typeof to !== "string") return null;
  const match = to.match(/<([^>]+)>/);
  return match ? match[1].trim() : to.trim();
}

function mapEventToFeedbackType(
  type: string
): "bounce" | "complaint" | "delivered" | null {
  switch (type) {
    case "email.bounced":
      return "bounce";
    case "email.complained":
      return "complaint";
    case "email.delivered":
      return "delivered";
    default:
      return null;
  }
}
