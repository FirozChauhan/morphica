"use client";

// The Overview page. It's a client component that fetches /api/stats after
// mounting — the page shell renders instantly (skeleton → content) so clicking
// between dashboard tabs feels snappy, and cachedFetch keeps re-visits fast.
import { useEffect, useState } from "react";
import { Activity, ArrowDownRight, Image } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDelayedSkeleton } from "@/hooks/use-delayed-skeleton";
import { cachedFetch } from "@/lib/client-cache";
import { formatBytes } from "@/lib/format";
import type { OverviewStats } from "@/lib/stats";

export function OverviewView() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const showSkeleton = useDelayedSkeleton();

  useEffect(() => {
    void cachedFetch<OverviewStats>("stats", 60_000, () =>
      fetch("/api/stats").then((r) => (r.ok ? r.json() : null)),
    ).then(setStats);
  }, []);

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
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Usage for the current month.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="mt-2 h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-44 w-full" />
          </CardContent>
        </Card>
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

      <div className="grid gap-4 sm:grid-cols-3">
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

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Requests per day
          </CardTitle>
          <span className="text-xs text-muted-foreground">Last 30 days</span>
        </CardHeader>
        <CardContent>
          {stats.daily.some((d) => d.count > 0) ? (
            <div className="flex h-44 items-end gap-[3px]">
              {stats.daily.map((d) => (
                <div
                  key={d.date}
                  title={`${d.count} request${d.count === 1 ? "" : "s"}`}
                  className="flex-1 rounded-sm bg-brand/60 transition-colors hover:bg-brand"
                  style={{ height: `${Math.max((d.count / max) * 100, 2)}%` }}
                />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No usage yet.
            </p>
          )}
        </CardContent>
      </Card>
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
    <Card className="transition-colors hover:border-foreground/20">
      <CardHeader className="flex-row items-center gap-2">
        <span className="flex size-7 items-center justify-center bg-brand/10 text-brand">
          <Icon className="size-4" />
        </span>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
