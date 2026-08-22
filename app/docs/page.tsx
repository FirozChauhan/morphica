import Link from "next/link";

import { SignInButton } from "@/components/landing/auth-buttons";
import { ApiReference } from "@/components/docs/api-reference";
import { Wordmark } from "@/components/wordmark";

export default function DocsPage() {
  return (
    <main className="min-h-dvh bg-app">
      <div className="bg-black shadow-[0_10px_30px_-6px_color-mix(in_srgb,var(--brand)_25%,transparent)]">
        <div className="mx-auto flex w-full items-center justify-between px-4 py-4 md:max-w-[80vw] md:px-6 md:py-6">
          <Wordmark className="cursor-pointer text-2xl tracking-[0.08em] text-white md:text-4xl" />
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/docs"
              className="hidden text-sm font-medium text-white transition-colors hover:text-white/70 md:inline"
            >
              Docs
            </Link>
            <SignInButton compact className="h-9 border-white/40 bg-transparent px-5 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-white" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <ApiReference />
      </div>
    </main>
  );
}
