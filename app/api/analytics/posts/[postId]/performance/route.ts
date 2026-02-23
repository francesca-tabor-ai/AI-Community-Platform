import { NextResponse } from "next/server";
import { getPostPerformanceDaily } from "@/lib/analytics/aggregate";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const { searchParams } = new URL(_req.url);
  const days = Math.min(parseInt(searchParams.get("days") ?? "30", 10), 365);

  const data = await getPostPerformanceDaily(postId, days);
  return NextResponse.json(data);
}
