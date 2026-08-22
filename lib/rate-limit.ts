// lib/rate-limit.ts
// A simple in-memory sliding-window rate limiter.
//
// IMPORTANT: this is an in-memory Map, so on Vercel it's per-instance. A
// motivated attacker could exhaust one instance's memory and hit another.
// That's acceptable for a demo endpoint, but for production I'd pair this
// with Vercel's WAF rules for a proper defence-in-depth.
const buckets = new Map<string, number[]>();
const MAX_ENTRIES = 10_000;

export function isRateLimited(
  key: string,            // e.g. "demo:1.2.3.4"
  limit: number,          // max requests allowed
  windowMs: number,       // time window in milliseconds
): boolean {
  const now = Date.now();
  // Keep only timestamps that are still inside the window.
  const hits = (buckets.get(key) ?? []).filter(
    (t) => now - t < windowMs,
  );

  if (hits.length >= limit) {
    buckets.set(key, hits);
    return true; // rate limited
  }

  hits.push(now);
  buckets.set(key, hits);

  // Prevent unbounded memory growth by evicting the oldest entry when the
  // map gets too big. (This is a belt-and-braces measure; in practice it
  // will never fire because the demo endpoint is low-traffic.)
  if (buckets.size > MAX_ENTRIES) {
    const oldest = buckets.entries().next().value as [string, number[]];
    buckets.delete(oldest[0]);
  }

  return false;
}