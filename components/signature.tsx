// A subtle signature watermark pinned to the bottom-right of every page.
// Rendered in the Aref Ruqaa font — right-to-left Urdu signature, on a small
// frosted pill so it stays readable over any content.
export function Signature() {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 select-none">
      <div
        dir="rtl"
        className="flex items-center border border-white/10 bg-black/50 px-6 py-2 pb-3 backdrop-blur-sm"
      >
        <span className="font-ruqaa text-2xl leading-none text-white">
          فیروز چوہان
        </span>
      </div>
    </div>
  );
}
