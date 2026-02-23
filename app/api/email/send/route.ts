/**
 * Internal API to enqueue an email.
 * Called by Content Service, Subscription Service, etc.
 * Protected by API key or internal-only access.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enqueueEmail } from "@/lib/email/queue";
import type { EmailType } from "@/lib/email/types";

const EMAIL_TYPES: EmailType[] = [
  "new_post_notification",
  "welcome",
  "subscription_confirmation",
  "subscription_cancelled",
  "payment_failed",
  "event_reminder",
  "comment_reply",
  "mention",
];

const schema = z.object({
  email_type: z.enum(EMAIL_TYPES as unknown as [EmailType, ...EmailType[]]),
  recipient_email: z.string().email(),
  recipient_name: z.string().optional(),
  template_data: z.record(z.unknown()),
  metadata: z.record(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Internal API - require shared secret in production
    const authHeader = req.headers.get("authorization");
    const internalKey = process.env.EMAIL_INTERNAL_API_KEY;
    if (internalKey && authHeader !== `Bearer ${internalKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const id = await enqueueEmail(parsed.data);
    return NextResponse.json({ success: true, job_id: id });
  } catch (err) {
    console.error("[email/send] Error:", err);
    return NextResponse.json(
      { error: "Failed to enqueue email" },
      { status: 500 }
    );
  }
}
