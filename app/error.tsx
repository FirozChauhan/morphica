"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="text-xs text-muted-foreground">Error</p>
      <h1 className="text-lg font-semibold text-foreground">
        Something went wrong
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {error.digest ? `Reference: ${error.digest}` : "An unexpected error occurred."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 inline-flex h-10 cursor-pointer items-center rounded-[4px] bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        Try again
      </button>
    </main>
  );
}
