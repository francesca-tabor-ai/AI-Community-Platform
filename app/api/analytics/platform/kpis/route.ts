import { NextResponse } from "next/server";
import { getPlatformDailyKpis } from "@/lib/analytics/aggregate";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const days = Math.min(parseInt(searchParams.get("days") ?? "30", 10), 365);

  const data = await getPlatformDailyKpis(days);
  return NextResponse.json(data);
}
