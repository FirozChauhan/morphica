// app/api/usage/route.ts
// Serves the Usage page: one page of recent calls plus a requests-per-day
// series for the line chart.
//
//   GET /api/usage?page=1
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, gte, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { apiKeys, usage } from "@/schema";

export const runtime = "nodejs";

const PAGE_SIZE = 20;

export async function GET(request: Request) {
  const session = await auth();
  if (!session.userId) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const page = Math.max(
    1,
    Number.isFinite(Number(url.searchParams.get("page")))
      ? Number(url.searchParams.get("page"))
      : 1,
  );

  // Start of the 30-day window (UTC midnight, 29 days back).
  const daysAgo30 = new Date();
  daysAgo30.setUTCHours(0, 0, 0, 0);
  daysAgo30.setUTCDate(daysAgo30.getUTCDate() - 29);

  // Three independent queries, run in parallel: total count (for pagination),
  // the page of rows (joined to key names), and the daily series (for the
  // chart).
  const [totalRow, rows, daily] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(usage)
      .where(eq(usage.userId, session.userId)),
    db
      .select({
        id: usage.id,
        op: usage.op,
        status: usage.status,
        bytesIn: usage.bytesIn,
        bytesOut: usage.bytesOut,
        durationMs: usage.durationMs,
        createdAt: usage.createdAt,
        keyName: apiKeys.name, // join so the table can show which key was used
      })
      .from(usage)
      .innerJoin(apiKeys, eq(usage.apiKeyId, apiKeys.id))
      .where(eq(usage.userId, session.userId))
      .orderBy(desc(usage.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({
        date: sql<string>`to_char(created_at, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(usage)
      .where(and(eq(usage.userId, session.userId), gte(usage.createdAt, daysAgo30)))
      .groupBy(sql`to_char(created_at, 'YYYY-MM-DD')`),
  ]);

  const total = totalRow[0]?.count ?? 0;

  // Fill the sparse rows into a dense 30-day series (missing days = 0).
  const byDate = new Map(daily.map((r) => [r.date, r.count]));
  const series: { date: string; count: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(daysAgo30.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, count: byDate.get(key) ?? 0 });
  }

  return Response.json({
    rows,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    daily: series,
  });
}
