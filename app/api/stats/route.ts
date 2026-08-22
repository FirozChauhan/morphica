// app/api/stats/route.ts
// Serves the Overview page's data. Thin wrapper around getOverviewStats —
// the heavy lifting lives in lib/stats.ts.
import { auth } from "@clerk/nextjs/server";

import { getOverviewStats } from "@/lib/stats";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session.userId) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const stats = await getOverviewStats(session.userId);
  return Response.json(stats);
}
