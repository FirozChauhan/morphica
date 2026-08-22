import Link from "next/link";

import { GetStartedButton, SignInButton } from "@/components/landing/auth-buttons";
import { Demo } from "@/components/landing/demo";
import { Wordmark } from "@/components/wordmark";

export default function LandingPage() {
  return (
    <main className="relative h-dvh overflow-hidden bg-app">
      <div className="absolute inset-x-0 top-0 z-10 bg-black shadow-[0_10px_30px_-6px_color-mix(in_srgb,var(--brand)_25%,transparent)]">
        <div className="mx-auto flex w-full max-w-[70vw] items-center justify-between px-6 py-6">
          <Link href="/">
            <Wordmark className="cursor-pointer text-4xl tracking-[0.08em] text-white" />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/docs"
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Docs
            </Link>
            <SignInButton
              compact
              className="h-11 border-white/40 bg-transparent px-8 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-white"
            />
          </div>
        </div>
      </div>

      <section className="mx-auto grid h-full w-full max-w-[70vw] grid-cols-1 items-center gap-10 px-6 xl:grid-cols-[2fr_minmax(20rem,1fr)] xl:gap-6">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-bold leading-[1.05] tracking-tight xl:text-[4rem] 2xl:text-7xl">
            <span className="block">One request</span>
            <span className="block">zero persistence.</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Stateless, serverless image processing — one request, zero
            persistence.
          </p>
          <div className="mt-8">
            <GetStartedButton />
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <Demo />
        </div>
      </section>
    </main>
  );
}