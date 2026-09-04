// A small dependency-free SVG line chart for the Usage page. I hand-rolled it
// rather than pulling in a chart library — for a single 30-point series a
// plain <svg> is plenty and keeps the bundle small.
export function LineChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const width = 600;
  const height = 160;
  const pad = 10;
  const max = Math.max(...data.map((d) => d.count), 1);
  const n = data.length;

  const stepX = n > 1 ? (width - pad * 2) / (n - 1) : 0;
  const points = data.map((d, i) => [
    pad + i * stepX,
    height - pad - (d.count / max) * (height - pad * 2),
  ]);

  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  const area = `M ${points[0][0].toFixed(2)},${height - pad} ${line.slice(
    1,
  )} L ${points[points.length - 1][0].toFixed(2)},${height - pad} Z`;

  const first = data[0]?.date ?? "";
  const last = data[data.length - 1]?.date ?? "";

  return (
    <div className="rounded-md border border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Requests per day</p>
        <span className="text-xs text-muted-foreground">
          {first} → {last}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-3 h-40 w-full"
        preserveAspectRatio="none"
      >
        <path d={area} className="fill-brand/10" />
        <path
          d={line}
          className="stroke-brand"
          fill="none"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
