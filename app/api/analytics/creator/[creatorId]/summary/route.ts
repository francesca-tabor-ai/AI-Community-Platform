import { NextResponse } from "next/server";
import { getCreatorDailySummary } from "@/lib/analytics/aggregate";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ creatorId: string }> }
) {
  const { creatorId } = await params;
  const { searchParams } = new URL(_req.url);
  const days = Math.min(parseInt(searchParams.get("days") ?? "30", 10), 365);

  const data = await getCreatorDailySummary(creatorId, days);
  return NextResponse.json(data);
}
