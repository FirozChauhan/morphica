"use client";

// The Usage page: a requests-per-day line chart on top, then the paginated
// table of recent calls. Data loads client-side from /api/usage (cached) so
// navigation stays instant.
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart } from "@/components/dashboard/line-chart";
import { cachedFetch } from "@/lib/client-cache";
import { formatBytes, formatDateTime } from "@/lib/format";
import { useDelayedSkeleton } from "@/hooks/use-delayed-skeleton";

type UsageRow = {
  id: number;
  op: string;
  status: number;
  bytesIn: number;
  bytesOut: number;
  durationMs: number;
  createdAt: string;
  keyName: string;
};

type UsageResponse = {
  rows: UsageRow[];
  total: number;
  page: number;
  totalPages: number;
  daily: { date: string; count: number }[];
};

export function UsageView() {
  const [data, setData] = useState<UsageResponse | null>(null);
  const [page, setPage] = useState(1);
  const showSkeleton = useDelayedSkeleton();

  useEffect(() => {
    void cachedFetch<UsageResponse>(`usage:${page}`, 30_000, () =>
      fetch(`/api/usage?page=${page}`).then((r) => (r.ok ? r.json() : null)),
    ).then(setData);
  }, [page]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Usage</h1>
        <p className="mt-1 text-sm text-muted-foreground">Recent API calls.</p>
      </div>

      {!data ? (
        showSkeleton ? (
          <div className="overflow-hidden border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["Time", "Op", "Status", "Bytes in", "Bytes out", "Duration", "Key"].map(
                    (h) => (
                      <TableHead
                        key={h}
                        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        {h}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j} className="py-3">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="overflow-hidden border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["Time", "Op", "Status", "Bytes in", "Bytes out", "Duration", "Key"].map(
                    (h) => (
                      <TableHead
                        key={h}
                        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        {h}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody />
            </Table>
          </div>
        )
      ) : data.rows.length === 0 && !data.daily.some((d) => d.count > 0) ? (
        <div className="border bg-card py-16 text-center">
          <p className="text-sm font-medium">No usage yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Calls made with your API keys will show up here.
          </p>
        </div>
      ) : (
        <div className="animate-in space-y-8 fade-in-0 slide-in-from-bottom-3 zoom-in-95 duration-500 ease-out">
          {data.daily.some((d) => d.count > 0) && (
            <LineChart data={data.daily} />
          )}
          <div className="overflow-hidden border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Time
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Op
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Bytes in
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Bytes out
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Duration
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Key
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    <TableCell className="py-3 text-muted-foreground">
                      {formatDateTime(row.createdAt)}
                    </TableCell>
                    <TableCell className="py-3">
                      <code className="bg-muted px-1.5 py-0.5 text-xs">
                        {row.op}
                      </code>
                    </TableCell>
                    <TableCell className="py-3">
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="py-3 text-right text-muted-foreground">
                      {formatBytes(row.bytesIn)}
                    </TableCell>
                    <TableCell className="py-3 text-right text-muted-foreground">
                      {formatBytes(row.bytesOut)}
                    </TableCell>
                    <TableCell className="py-3 text-right text-muted-foreground">
                      {row.durationMs} ms
                    </TableCell>
                    <TableCell className="py-3 text-muted-foreground">
                      {row.keyName}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-start gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Page {data.page} of {data.totalPages} · {data.total} calls
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: number }) {
  if (status === 200) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        <span className="text-sm">{status}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <span className="size-1.5 rounded-full bg-destructive/70" />
      <span className="text-sm">{status}</span>
    </span>
  );
}
