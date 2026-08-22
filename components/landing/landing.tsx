"use client";

// The landing page. Holds the auth/demo view state so "Sign in" and
// "Get started" swap the live demo for the sign-in / sign-up form inline,
// instead of navigating to a separate page.
import { useState } from "react";
import { ClerkLoaded } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Demo } from "@/components/landing/demo";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";

type View = "demo" | "sign-up" | "sign-in";

export function Landing() {
  const [view, setView] = useState<View>("demo");

  return (
    <main className="relative h-dvh animate-in overflow-y-auto bg-app fade-in-0 duration-1000 ease-out md:overflow-hidden">
      <div className="sticky top-0 z-10 bg-black shadow-[0_10px_30px_-6px_color-mix(in_srgb,var(--brand)_25%,transparent)]">
        <div className="mx-auto flex w-full items-center justify-between px-4 py-4 md:max-w-[80vw] md:px-6 md:py-6">
          <Wordmark className="cursor-pointer text-2xl tracking-[0.08em] text-white md:text-4xl" />
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/docs"
              className="hidden text-xs font-medium text-white/60 transition-colors hover:text-white md:inline md:text-sm"
            >
              Docs
            </Link>
            <Button
              onClick={() => setView("sign-in")}
              className="h-9 cursor-pointer border-white/40 bg-transparent px-4 text-xs font-medium text-white transition-colors hover:bg-white/10 hover:text-white md:h-11 md:px-8 md:text-sm"
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>

      <section className="mx-auto grid min-h-full w-full grid-cols-1 items-start gap-6 px-4 pt-16 pb-10 md:max-w-[80vw] md:items-center md:gap-10 md:px-6 md:pt-0 md:pb-0 xl:grid-cols-[minmax(0,2.4fr)_minmax(19rem,1fr)] xl:gap-4">
        <div className="min-w-0 max-w-3xl">
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-7xl xl:text-[5rem]">
            <span className="block">One request</span>
            <span className="block">zero persistence.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-lg">
            Stateless, serverless image processing — one request, zero
            persistence.
          </p>
          <p className="mt-3 hidden text-xs text-muted-foreground md:block md:mt-4">
            Morphica is an image-processing API that resizes images on the
            fly. Send a picture along with your target width or height, and
            you get the processed image back in milliseconds — nothing is
            ever stored on our servers. Create an API key in seconds and
            drop it straight into your app, your server, or a simple curl
            command.
          </p>
          <div className="mt-6 md:mt-8">
            <Button
              onClick={() => setView("sign-up")}
              className="group relative h-12 w-full cursor-pointer overflow-hidden bg-brand px-10 text-sm text-white hover:bg-brand/90 hover:shadow-[0_8px_30px_-6px_color-mix(in_srgb,var(--brand)_50%,transparent)] md:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get started
                <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center md:min-h-[32rem] lg:justify-end">
          {view === "demo" ? (
            <Demo />
          ) : (
            <ClerkLoaded>
              <div
                key={view}
                className="animate-in w-[30rem] max-w-full fade-in-0 slide-in-from-right-8 zoom-in-95 duration-300 ease-out"
              >
                {view === "sign-up" ? <SignUpForm /> : <SignInForm />}
              </div>
            </ClerkLoaded>
          )}
        </div>
      </section>
    </main>
  );
}
