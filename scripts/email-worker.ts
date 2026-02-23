#!/usr/bin/env npx tsx
/**
 * Standalone Email Worker - processes queue in a loop.
 * Use for self-hosted deployments (Railway, EC2, etc.) where cron isn't available.
 * On Vercel, use the cron-triggered /api/email/worker endpoint instead.
 */

import "dotenv/config";
import { processEmailQueue } from "../lib/email/worker";

const POLL_INTERVAL_MS = 30_000; // 30 seconds

async function run() {
  console.log("[email-worker] Starting...");
  while (true) {
    try {
      const result = await processEmailQueue();
      if (result.processed > 0 || result.failed > 0 || result.dead > 0) {
        console.log(
          `[email-worker] Processed: ${result.processed}, Failed: ${result.failed}, Dead: ${result.dead}`
        );
      }
    } catch (err) {
      console.error("[email-worker] Error:", err);
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

run();
