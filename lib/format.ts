// lib/format.ts
// Tiny display helpers so bytes and dates render consistently across the UI.

export function formatBytes(bytes: number): string {
  // Show human-readable sizes: 512 B, 12.4 KB, 3.2 MB, etc.
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function formatDate(value: Date | string): string {
  // e.g. "Aug 21, 2026"
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: Date | string): string {
  // e.g. "Aug 21, 9:04 AM"
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
