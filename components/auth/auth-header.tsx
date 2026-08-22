import { Wordmark } from "@/components/wordmark";

export function AuthHeader({ action }: { action?: React.ReactNode }) {
  return (
    <div className="bg-black shadow-[0_10px_30px_-6px_color-mix(in_srgb,var(--brand)_25%,transparent)]">
      <div className="mx-auto flex w-full max-w-[70vw] items-center justify-between px-6 py-6">
        <Wordmark className="cursor-pointer text-4xl tracking-[0.08em] text-white" />
        {action}
      </div>
    </div>
  );
}
