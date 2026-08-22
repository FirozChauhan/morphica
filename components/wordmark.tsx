import Link from "next/link";

import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/">
      <span
        className={cn(
          "font-display uppercase leading-none tracking-tight",
          className,
        )}
      >
        Morphica
      </span>
    </Link>
  );
}
