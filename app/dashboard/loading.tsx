import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-1 h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="flex-row items-center gap-2">
              <div className="size-7 rounded bg-muted" />
              <CardTitle>
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-44 w-full animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    </div>
  );
}