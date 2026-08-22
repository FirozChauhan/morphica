// lib/stats.ts
// The queries that power the Overview page: monthly totals and a
// requests-per-day series for the last 30 days.
import { and, eq, gte, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { usage } from "@/schema";

export type OverviewStats = {
  totalRequests: number;
  bytesOut: number;
  successRate: number;
  daily: { date: string; count: number }[];
};

function startOfDay(d: Date): Date {
  // Truncate to midnight (local time) so the "last 30 days" window is clean.
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

export async function getOverviewStats(userId: string): Promise<OverviewStats> {
  const now = new Date();
  // First of the current month (for the "this month" numbers) and the cutoff
  // for the chart (29 days back + today = 30 days).
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysAgo30 = startOfDay(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000));

  // Two independent queries — run them in parallel so we only pay the latency
  // of the slower one. Note: I avoid aggregate FILTER clauses here because the
  // Neon HTTP driver was finicky with them, so I use a CASE expression instead.
  const [month, daily] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)::int`,
        bytesOut: sql<number>`coalesce(sum(bytes_out), 0)::int`,
        success: sql<number>`coalesce(sum(case when status = 200 then 1 else 0 end), 0)::int`,
      })
      .from(usage)
      .where(and(eq(usage.userId, userId), gte(usage.createdAt, monthStart))),
    db
      .select({
        date: sql<string>`to_char(created_at, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(usage)
      .where(and(eq(usage.userId, userId), gte(usage.createdAt, daysAgo30)))
      .groupBy(sql`to_char(created_at, 'YYYY-MM-DD')`),
  ]);

  const m = month[0] ?? { total: 0, bytesOut: 0, success: 0 };

  // Turn the sparse query rows into a dense 30-element array, filling missing
  // days with zero so the chart always has a bar for every day.
  const byDate = new Map(daily.map((r) => [r.date, r.count]));
  const series: { date: string; count: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(daysAgo30.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, count: byDate.get(key) ?? 0 });
  }

  return {
    totalRequests: m.total,
    bytesOut: m.bytesOut,
    successRate: m.total > 0 ? Math.round((m.success / m.total) * 100) : 100,
    daily: series,
  };
}
