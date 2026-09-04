"use client";

// The Overview page. It's a client component that fetches /api/stats after
// mounting — the page shell renders instantly (skeleton → content) so clicking
// between dashboard tabs feels snappy, and cachedFetch keeps re-visits fast.
import { Activity, ArrowDownRight, Image } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDelayedSkeleton } from "@/hooks/use-delayed-skeleton";
import { useCachedData } from "@/hooks/use-cached-data";
import { formatBytes } from "@/lib/format";
import type { OverviewStats } from "@/lib/stats";

export function OverviewView() {
  const { data: stats, failed, retry } = useCachedData<OverviewStats>(
    "stats",
    60_000,
    () => fetch("/api/stats").then((r) => (r.ok ? r.json() : null)),
  );
  const showSkeleton = useDelayedSkeleton();

  if (failed) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-[1.375rem] leading-8 font-semibold">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Usage for the current month.
          </p>
        </div>
        <div className="border border-border bg-background py-16 text-center">
          <p className="text-sm font-medium">Couldn&apos;t load your stats</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while fetching your usage. Try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={retry}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!stats) {
    if (!showSkeleton) {
      return (
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Usage for the current month.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-[1.375rem] leading-8 font-semibold">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Usage for the current month.
          </p>
        </div>
        <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-background p-6">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="mt-2 h-8 w-32" />
            </div>
          ))}
        </div>
        <div className="border border-border bg-background p-6">
          <Skeleton className="h-44 w-full" />
        </div>
      </div>
    );
  }

  const max = Math.max(...stats.daily.map((d) => d.count), 1);

  return (
    <div className="animate-in space-y-8 fade-in-0 slide-in-from-bottom-3 zoom-in-95 duration-500 ease-out">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Usage for the current month.
        </p>
      </div>

      <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
        <StatCard
          label="Requests this month"
          value={stats.totalRequests.toLocaleString()}
          icon={Activity}
        />
        <StatCard
          label="Bytes processed"
          value={formatBytes(stats.bytesOut)}
          icon={Image}
        />
        <StatCard
          label="Success rate"
          value={`${stats.successRate}%`}
          icon={ArrowDownRight}
        />
      </div>

      <div className="border border-border bg-background">
        <div className="flex flex-row items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium">
            Requests per day
          </h2>
          <span className="text-xs text-muted-foreground">Last 30 days</span>
        </div>
        <div className="p-4">
          {stats.daily.some((d) => d.count > 0) ? (
            <div className="flex h-44 items-end gap-[3px]">
              {stats.daily.map((d) => (
                <div
                  key={d.date}
                  title={`${d.count} request${d.count === 1 ? "" : "s"}`}
                  className="flex-1 rounded-[2px] bg-foreground/70 transition-colors hover:bg-foreground"
                  style={{ height: `${Math.max((d.count / max) * 100, 2)}%` }}
                />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No usage yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-background p-6 transition-colors hover:bg-surface">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center text-muted-foreground">
          <Icon className="size-4" />
        </span>
        <figure className="text-xs text-muted-foreground">{label}</figure>
      </div>
      <p className="mt-3 text-3xl font-medium tracking-tight">{value}</p>
    </div>
  );
}
