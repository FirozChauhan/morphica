import { Wordmark } from "@/components/wordmark";

export function AuthHeader({ action }: { action?: React.ReactNode }) {
  return (
    <div className="bg-black shadow-[0_10px_30px_-6px_color-mix(in_srgb,var(--brand)_25%,transparent)]">
      <div className="mx-auto flex w-full items-center justify-between px-4 py-4 md:max-w-[80vw] md:px-6 md:py-6">
        <Wordmark className="cursor-pointer text-2xl tracking-[0.08em] text-white md:text-4xl" />
        {action}
      </div>
    </div>
  );
}
