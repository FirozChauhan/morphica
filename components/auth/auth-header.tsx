import { Wordmark } from "@/components/wordmark";

export function AuthHeader({ action }: { action?: React.ReactNode }) {
  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto flex w-full items-center justify-between px-4 py-4 md:max-w-[1080px] md:px-6">
        <Wordmark className="text-lg text-foreground" />
        {action}
      </div>
    </div>
  );
}
