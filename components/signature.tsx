// A subtle signature watermark pinned to the bottom-right of every page.
// Rendered in the Aref Ruqaa font — right-to-left Urdu signature, on a small
// frosted pill so it stays readable over any content.
export function Signature() {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 select-none">
      <div
        dir="rtl"
        className="flex items-center rounded-[4px] border border-border bg-background/80 px-3 py-1 pb-2 backdrop-blur-sm"
      >
        <span className="font-ruqaa text-[0.95rem] leading-none text-muted-foreground">
          فیروز چوہان
        </span>
      </div>
    </div>
  );
}
