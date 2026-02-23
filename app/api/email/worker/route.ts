/**
 * Email worker trigger endpoint.
 * Call via cron (e.g. Vercel Cron: *\/1 * * * * for every minute)
 * or external scheduler. Requires CRON_SECRET for auth.
 */

import { NextRequest, NextResponse } from "next/server";
import { processEmailQueue } from "@/lib/email/worker";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for batch processing

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processEmailQueue();
    return NextResponse.json({
      success: true,
      processed: result.processed,
      failed: result.failed,
      dead: result.dead,
    });
  } catch (err) {
    console.error("[email/worker] Error:", err);
    return NextResponse.json(
      { error: "Worker failed", details: String(err) },
      { status: 500 }
    );
  }
}
