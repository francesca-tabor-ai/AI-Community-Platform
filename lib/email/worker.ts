/**
 * Email Worker Service - consumes email jobs from the queue.
 * Implements retry strategy: immediate retries (3x), exponential backoff, DLQ after max attempts.
 */

import { prisma } from "@/lib/prisma";
import { sendEmail } from "./esp";
import { renderEmail } from "./templates";

const BATCH_SIZE = 25;
const IMMEDIATE_RETRIES = 3;
const INITIAL_BACKOFF_MS = 5 * 60 * 1000; // 5 min
const MAX_BACKOFF_MS = 60 * 60 * 1000; // 1 hour

function getBackoffDelay(attempts: number): number {
  const delay = Math.min(INITIAL_BACKOFF_MS * Math.pow(2, attempts - 1), MAX_BACKOFF_MS);
  return Math.floor(delay * (0.9 + Math.random() * 0.2)); // jitter ±10%
}

export interface ProcessResult {
  processed: number;
  failed: number;
  dead: number;
}

/**
 * Process a batch of pending email jobs.
 * Call this from a cron job or standalone worker.
 */
export async function processEmailQueue(): Promise<ProcessResult> {
  const result: ProcessResult = { processed: 0, failed: 0, dead: 0 };

  const jobs = await prisma.emailJob.findMany({
    where: {
      status: { in: ["pending", "failed"] },
      scheduledAt: { lte: new Date() },
    },
    orderBy: { scheduledAt: "asc" },
    take: BATCH_SIZE,
  });

  for (const job of jobs) {
    if (job.attempts >= job.maxAttempts) {
      await prisma.emailJob.update({
        where: { id: job.id },
        data: { status: "dead", completedAt: new Date() },
      });
      result.dead++;
      continue;
    }

    // Mark as processing
    await prisma.emailJob.update({
      where: { id: job.id },
      data: { status: "processing", startedAt: new Date() },
    });

    let success = false;
    let lastError: string | null = null;

    // Immediate retries (up to 3 attempts within this run)
    for (let i = 0; i < IMMEDIATE_RETRIES && !success; i++) {
      const sendResult = await trySendEmail(job);
      if (sendResult.success) {
        success = true;
        break;
      }
      lastError = sendResult.error || "Unknown error";
      if (i < IMMEDIATE_RETRIES - 1) {
        await sleep(500 * (i + 1)); // 500ms, 1s, 1.5s
      }
    }

    if (success) {
      await prisma.emailJob.update({
        where: { id: job.id },
        data: { status: "completed", completedAt: new Date(), attempts: job.attempts + 1 },
      });
      result.processed++;
    } else {
      const newAttempts = job.attempts + 1;
      const isDead = newAttempts >= job.maxAttempts;

      if (isDead) {
        await prisma.emailJob.update({
          where: { id: job.id },
          data: {
            status: "dead",
            attempts: newAttempts,
            lastError,
            completedAt: new Date(),
          },
        });
        result.dead++;
      } else {
        const backoffMs = getBackoffDelay(newAttempts);
        const nextScheduledAt = new Date(Date.now() + backoffMs);

        await prisma.emailJob.update({
          where: { id: job.id },
          data: {
            status: "failed",
            attempts: newAttempts,
            lastError,
            scheduledAt: nextScheduledAt,
            startedAt: null,
          },
        });
        result.failed++;
      }
    }
  }

  return result;
}

async function trySendEmail(job: {
  emailType: string;
  recipientEmail: string;
  recipientName: string | null;
  templateData: object;
  metadata: object | null;
}): Promise<{ success: boolean; error?: string }> {
  // Check unsubscribe list
  const unsubscribed = await prisma.emailUnsubscribe.findUnique({
    where: { email: job.recipientEmail.toLowerCase() },
  });
  if (unsubscribed) {
    return { success: true }; // Treat as success - we're respecting unsubscribe
  }

  const { subject, html } = renderEmail(
    job.emailType as import("./types").EmailType,
    job.templateData as Record<string, unknown>,
    {
      recipientEmail: job.recipientEmail,
      recipientName: job.recipientName ?? undefined,
    }
  );

  const result = await sendEmail({
    to: job.recipientEmail,
    subject,
    html,
  });

  return result.success ? { success: true } : { success: false, error: result.error };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
