"use client";

import { useClerk } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function SignUpButton() {
  const { redirectToSignUp } = useClerk();
  return (
    <Button
      size="lg"
      className="h-10 rounded-[4px] bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-accent hover:text-accent-foreground"
      onClick={() => void redirectToSignUp()}
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
      className="group h-10 rounded-[4px] bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      onClick={() => void redirectToSignUp()}
    >
      <span className="flex items-center gap-2">
        Get started
        <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
      </span>
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
      onClick={() => void redirectToSignIn()}
    >
      Sign in
    </Button>
  );
}