"use client";

// A tiny UX polish: don't show the skeleton immediately — wait a short delay
// (150ms by default). If the data arrives before the delay fires, the
// skeleton never appears and the user sees a smooth, flicker-free transition.
import { useEffect, useState } from "react";

export function useDelayedSkeleton(delayMs = 150): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  return show;
}
