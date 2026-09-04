import Link from "next/link";

import { cn } from "@/lib/utils";

// Morphica wordmark — uppercase mono logotype matching the opencode.ai
// header, with a solid rectangular block as the logo mark. The block is a
// real element sized in em so it stays glued to the text's cap height in
// every context (header, auth, dashboard) instead of drifting like a
// baseline-aligned glyph does.
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <span
        aria-hidden
        className="inline-block h-[0.72em] w-[0.5em] bg-current"
      />
      <span className="font-bold uppercase leading-none tracking-[0.08em]">
        Morphica
      </span>
    </Link>
  );
}
