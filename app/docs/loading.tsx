export default function DocsLoading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-52 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-full max-w-96 animate-pulse rounded bg-muted" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="h-24 w-full animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
