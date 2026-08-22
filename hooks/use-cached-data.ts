"use client";

// Data fetching for the dashboard views, wrapped with the client cache plus
// automatic retry on transient failures.
//
// Why retry: right after a login (or a cold Neon/serverless start) the first
// fetch can fail even though the session is valid — and previously that meant
// a skeleton that never resolved until a manual refresh. Now a failed fetch
// retries with backoff (500ms, 1s, 2s, 4s, 8s) and only surfaces as an error
// once retries are exhausted, with a manual retry button available.
import { useCallback, useEffect, useState } from "react";

import { cachedFetch } from "@/lib/client-cache";

const MAX_RETRIES = 5;

export function useCachedData<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T | null>,
  deps: unknown[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const depsKey = deps.join("|");

  useEffect(() => {
    let cancelled = false;
    void cachedFetch<T>(key, ttlMs, fetcher).then((result) => {
      if (cancelled) return;
      if (result != null) {
        setData(result);
      } else {
        setFailed(true);
      }
    });
    return () => {
      cancelled = true;
    };
    // fetcher is recreated every render by callers; keying on its inputs is
    // what matters, so eslint's exhaustive-deps warning is intentionally
    // silenced here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ttlMs, attempt, depsKey]);

  // Backoff retry: only fires when the fetch failed, stops at MAX_RETRIES.
  // Resets `failed` before bumping `attempt` so the next fetch isn't flagged
  // as failed before it even runs.
  useEffect(() => {
    if (!failed || attempt >= MAX_RETRIES) return;
    const delay = Math.min(500 * 2 ** attempt, 8000);
    const t = setTimeout(() => {
      setFailed(false);
      setAttempt((a) => a + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [failed, attempt]);

  const retry = useCallback(() => {
    setAttempt(0);
    setFailed(false);
    setData(null);
  }, []);

  return { data, failed: failed && attempt >= MAX_RETRIES, retry };
}
