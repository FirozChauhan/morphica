import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display uppercase leading-none tracking-tight",
        className,
      )}
    >
      Morphica
    </span>
  );
}
