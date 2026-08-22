// lib/client-cache.ts
// A tiny client-side cache with "stale-while-revalidate".
//
// Why I built this: the dashboard pages used to re-query Neon on every nav
// click, which made the UI feel laggy. Now the views ask this cache first —
// if there's a (still-fresh) copy, the page renders instantly and refreshes
// the cache in the background.
const cache = new Map<string, { data: unknown; expires: number }>();

export function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expires) {
    // Expired — drop it and treat as a miss.
    cache.delete(key);
    return undefined;
  }
  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttlMs: number) {
  cache.set(key, { data, expires: Date.now() + ttlMs });
}

export function clearCached(key: string) {
  cache.delete(key);
}

export function clearAllCached() {
  // Called on sign-out so one account's data never bleeds into another's
  // session on the same browser tab.
  cache.clear();
}

export async function cachedFetch<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T | null>,
): Promise<T | null> {
  const hit = getCached<T>(key);
  if (hit !== undefined) {
    // Serve the cached copy immediately, refresh the cache in the background.
    fetcher()
      .then((data) => {
        if (data != null) setCached(key, data, ttlMs);
      })
      .catch(() => {});
    return hit;
  }
  const data = await fetcher().catch(() => null);
  if (data != null) setCached(key, data, ttlMs);
  return data;
}
