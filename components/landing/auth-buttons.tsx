"use client";

import { useClerk } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function SignUpButton() {
  const { redirectToSignUp } = useClerk();
  return (
    <Button
      size="lg"
      className="h-12 bg-brand px-8 text-sm text-white hover:bg-brand/90"
      onClick={() => redirectToSignUp({ redirectUrl: "/dashboard" })}
    >
      Sign up
    </Button>
  );
}

import { ArrowRight } from "lucide-react";

export function GetStartedButton() {
  const { redirectToSignUp } = useClerk();
  return (
    <Button
      size="lg"
      className="group relative h-12 animate-in overflow-hidden bg-brand px-10 text-sm text-white slide-in-from-bottom-3 fade-in-0 duration-500 ease-out hover:bg-brand/90 hover:shadow-[0_8px_30px_-6px_color-mix(in_srgb,var(--brand)_50%,transparent)]"
      onClick={() => redirectToSignUp({ redirectUrl: "/dashboard" })}
    >
      <span className="relative z-10 flex items-center gap-2">
        Get started
        <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
      </span>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
    </Button>
  );
}

export function SignInButton({
  compact,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const { redirectToSignIn } = useClerk();
  return (
    <Button
      size={compact ? "sm" : "lg"}
      variant="outline"
      className={
        compact
          ? `h-8 px-3 text-xs ${className ?? ""}`
          : `h-12 px-8 text-sm ${className ?? ""}`
      }
      onClick={() => redirectToSignIn({ redirectUrl: "/dashboard" })}
    >
      Sign in
    </Button>
  );
}