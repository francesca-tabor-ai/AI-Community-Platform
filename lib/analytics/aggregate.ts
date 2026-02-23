/**
 * Analytics aggregation helpers.
 * Builds dashboard data models from raw AnalyticsEvent records.
 */

import { prisma } from "@/lib/prisma";

type DateRange = { from: Date; to: Date };

function getDateRange(daysBack: number): DateRange {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - daysBack);
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);
  return { from, to };
}

export type CreatorDailySummary = {
  date: string;
  creator_id: string;
  total_views_day: number;
  total_comments_day: number;
  new_subscribers_day: number;
  total_subscribers_cumulative: number;
  estimated_revenue_day: number;
};

export async function getCreatorDailySummary(
  creatorId: string,
  daysBack = 30
): Promise<CreatorDailySummary[]> {
  const { from, to } = getDateRange(daysBack);

  const events = await prisma.analyticsEvent.findMany({
    where: {
      timestamp: { gte: from, lte: to },
      eventName: {
        in: ["post_viewed", "comment_submitted", "creator_subscribed", "payment_succeeded"],
      },
    },
  });

  const byDate = new Map<string, CreatorDailySummary>();

  for (const e of events) {
    const payload = e.payload as Record<string, unknown>;
    const creator = payload.creator_id as string | undefined;
    if (creator !== creatorId) continue;

    const d = new Date(e.timestamp);
    const dateKey = d.toISOString().slice(0, 10);

    if (!byDate.has(dateKey)) {
      byDate.set(dateKey, {
        date: dateKey,
        creator_id: creatorId,
        total_views_day: 0,
        total_comments_day: 0,
        new_subscribers_day: 0,
        total_subscribers_cumulative: 0,
        estimated_revenue_day: 0,
      });
    }
    const row = byDate.get(dateKey)!;

    if (e.eventName === "post_viewed") row.total_views_day += 1;
    if (e.eventName === "comment_submitted") row.total_comments_day += 1;
    if (e.eventName === "creator_subscribed") row.new_subscribers_day += 1;
    if (e.eventName === "payment_succeeded") {
      row.estimated_revenue_day += (payload.amount as number) ?? 0;
    }
  }

  const subsCount = await countSubscribersForCreator(creatorId);
  for (const row of byDate.values()) {
    row.total_subscribers_cumulative = subsCount;
  }

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

async function countSubscribersForCreator(creatorId: string): Promise<number> {
  const community = await prisma.community.findFirst({
    where: { ownerId: creatorId },
    select: { id: true },
  });
  if (!community) return 0;
  return prisma.member.count({ where: { communityId: community.id } });
}

export type PlatformDailyKpis = {
  date: string;
  total_users: number;
  mau: number;
  dau: number;
  posts_published_day: number;
  new_creators_day: number;
  new_subscribers_day: number;
  platform_revenue_day: number;
};

export async function getPlatformDailyKpis(
  daysBack = 30
): Promise<PlatformDailyKpis[]> {
  const { from, to } = getDateRange(daysBack);

  const events = await prisma.analyticsEvent.findMany({
    where: { timestamp: { gte: from, lte: to } },
  });

  const byDate = new Map<string, PlatformDailyKpis>();

  for (const e of events) {
    const d = new Date(e.timestamp);
    const dateKey = d.toISOString().slice(0, 10);

    if (!byDate.has(dateKey)) {
      byDate.set(dateKey, {
        date: dateKey,
        total_users: 0,
        mau: 0,
        dau: 0,
        posts_published_day: 0,
        new_creators_day: 0,
        new_subscribers_day: 0,
        platform_revenue_day: 0,
      });
    }
    const row = byDate.get(dateKey)!;
    const payload = e.payload as Record<string, unknown>;

    if (e.eventName === "user_registered") {
      if (payload.role === "creator") row.new_creators_day += 1;
    }
    if (e.eventName === "post_published") row.posts_published_day += 1;
    if (e.eventName === "creator_subscribed") row.new_subscribers_day += 1;
    if (e.eventName === "payment_succeeded") {
      const amount = payload.amount as number;
      row.platform_revenue_day += amount ?? 0;
    }
  }

  const totalUsers = await prisma.user.count();

  const dauByDate = new Map<string, Set<string>>();
  for (const e of events) {
    if (!e.userId) continue;
    const d = new Date(e.timestamp);
    const dateKey = d.toISOString().slice(0, 10);
    if (!dauByDate.has(dateKey)) dauByDate.set(dateKey, new Set());
    dauByDate.get(dateKey)!.add(e.userId);
  }

  for (const row of byDate.values()) {
    row.total_users = totalUsers;
    row.dau = dauByDate.get(row.date)?.size ?? 0;
    row.mau = 0;
  }

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export type PostPerformanceDaily = {
  date: string;
  post_id: string;
  post_title: string;
  creator_id: string;
  views_day: number;
  comments_day: number;
  avg_time_on_page_seconds: number;
};

export async function getPostPerformanceDaily(
  postId: string,
  daysBack = 30
): Promise<PostPerformanceDaily[]> {
  const { from, to } = getDateRange(daysBack);

  const events = await prisma.analyticsEvent.findMany({
    where: {
      timestamp: { gte: from, lte: to },
      eventName: { in: ["post_viewed", "comment_submitted"] },
    },
  });

  const byDate = new Map<string, PostPerformanceDaily>();
  const timeSamples = new Map<string, number[]>();

  for (const e of events) {
    const payload = e.payload as Record<string, unknown>;
    const pId = payload.post_id as string | undefined;
    if (pId !== postId) continue;

    const d = new Date(e.timestamp);
    const dateKey = d.toISOString().slice(0, 10);

    if (!byDate.has(dateKey)) {
      byDate.set(dateKey, {
        date: dateKey,
        post_id: postId,
        post_title: (payload.post_title as string) ?? "",
        creator_id: (payload.creator_id as string) ?? "",
        views_day: 0,
        comments_day: 0,
        avg_time_on_page_seconds: 0,
      });
    }
    const row = byDate.get(dateKey)!;

    if (e.eventName === "post_viewed") {
      row.views_day += 1;
      const t = payload.time_on_page_seconds as number | undefined;
      if (typeof t === "number") {
        if (!timeSamples.has(dateKey)) timeSamples.set(dateKey, []);
        timeSamples.get(dateKey)!.push(t);
      }
    }
    if (e.eventName === "comment_submitted") row.comments_day += 1;
  }

  for (const [dateKey, samples] of timeSamples) {
    const row = byDate.get(dateKey);
    if (row && samples.length) {
      row.avg_time_on_page_seconds =
        Math.round((samples.reduce((a, b) => a + b, 0) / samples.length) * 10) / 10;
    }
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { title: true, authorId: true },
  });
  if (post) {
    for (const row of byDate.values()) {
      row.post_title = post.title;
      row.creator_id = post.authorId;
    }
  }

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}
