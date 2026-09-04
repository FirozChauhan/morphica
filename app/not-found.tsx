import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="text-xs text-muted-foreground">404</p>
      <h1 className="text-lg font-semibold text-foreground">
        This page does not exist
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you are looking for was moved, removed, or never existed.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex h-10 items-center rounded-[4px] bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        Back to home
      </Link>
    </main>
  );
}
