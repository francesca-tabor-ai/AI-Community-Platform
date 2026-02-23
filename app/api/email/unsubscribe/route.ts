/**
 * One-click unsubscribe (CAN-SPAM/GDPR compliance).
 * GET /api/email/unsubscribe?email=user@example.com
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email || !isValidEmail(email)) {
    return NextResponse.redirect(new URL("/?unsubscribe=invalid", req.url));
  }

  try {
    await prisma.emailUnsubscribe.upsert({
      where: { email: email.toLowerCase() },
      create: { email: email.toLowerCase() },
      update: {}, // Idempotent
    });
  } catch (err) {
    console.error("[email/unsubscribe] Error:", err);
    return NextResponse.redirect(new URL("/?unsubscribe=error", req.url));
  }

  return NextResponse.redirect(new URL("/?unsubscribe=success", req.url));
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
