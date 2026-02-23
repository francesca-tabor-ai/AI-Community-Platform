/**
 * Build fingerprint endpoint for deployment verification.
 * Hit /api/__build to see which commit/build is deployed.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    now: new Date().toISOString(),
    vercel: {
      url: process.env.VERCEL_URL,
      env: process.env.VERCEL_ENV,
      gitCommit: process.env.VERCEL_GIT_COMMIT_SHA,
      gitRef: process.env.VERCEL_GIT_COMMIT_REF,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
    },
  });
}
