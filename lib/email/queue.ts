/**
 * Email queue client - database-backed message queue.
 * Enqueues email jobs for asynchronous processing by the Email Worker Service.
 * Design supports future swap to SQS/RabbitMQ via adapter pattern.
 */

import { prisma } from "@/lib/prisma";
import type { EmailMessage, EmailType } from "./types";

const DEFAULT_MAX_ATTEMPTS = 7;

export interface EnqueueOptions {
  /** Delay sending until this time (ISO string or Date) */
  scheduledAt?: Date;
  /** Override default max retry attempts */
  maxAttempts?: number;
}

/**
 * Enqueue an email for delivery.
 * Returns immediately; the Email Worker processes jobs asynchronously.
 */
export async function enqueueEmail(
  message: EmailMessage,
  options: EnqueueOptions = {}
): Promise<string> {
  const { scheduledAt = new Date(), maxAttempts = DEFAULT_MAX_ATTEMPTS } = options;

  const job = await prisma.emailJob.create({
    data: {
      emailType: message.email_type,
      recipientEmail: message.recipient_email,
      recipientName: message.recipient_name ?? null,
      templateData: message.template_data as object,
      metadata: (message.metadata ?? {}) as object,
      status: "pending",
      maxAttempts,
      scheduledAt,
    },
  });

  return job.id;
}

/**
 * Enqueue multiple emails in a batch (e.g., new post to all subscribers).
 */
export async function enqueueEmailBatch(
  messages: EmailMessage[],
  options: EnqueueOptions = {}
): Promise<string[]> {
  const { scheduledAt = new Date(), maxAttempts = DEFAULT_MAX_ATTEMPTS } = options;

  const jobs = await prisma.$transaction(
    messages.map((message) =>
      prisma.emailJob.create({
        data: {
          emailType: message.email_type,
          recipientEmail: message.recipient_email,
          recipientName: message.recipient_name ?? null,
          templateData: message.template_data as object,
          metadata: (message.metadata ?? {}) as object,
          status: "pending",
          maxAttempts,
          scheduledAt,
        },
      })
    )
  );

  return jobs.map((j) => j.id);
}

/**
 * Helper: enqueue new_post_notification
 */
export async function enqueueNewPostNotification(
  recipientEmail: string,
  recipientName: string | null,
  data: { creator_name: string; post_title: string; post_url: string; community_name?: string },
  metadata?: { user_id?: string; post_id?: string }
): Promise<string> {
  return enqueueEmail(
    {
      email_type: "new_post_notification",
      recipient_email: recipientEmail,
      recipient_name: recipientName ?? undefined,
      template_data: data,
      metadata,
    },
    { maxAttempts: 7 }
  );
}

/**
 * Helper: enqueue welcome email
 */
export async function enqueueWelcome(
  recipientEmail: string,
  recipientName: string,
  data: { user_name: string; login_url?: string }
): Promise<string> {
  return enqueueEmail({
    email_type: "welcome",
    recipient_email: recipientEmail,
    recipient_name: recipientName,
    template_data: data,
  });
}
