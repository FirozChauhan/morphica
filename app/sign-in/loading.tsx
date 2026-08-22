import { Loader2 } from "lucide-react";

import { Wordmark } from "@/components/wordmark";

export default function AuthLoading() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-app px-4">
      <Wordmark className="text-3xl tracking-[0.08em] text-foreground" />
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </main>
  );
}
