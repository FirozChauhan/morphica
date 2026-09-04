"use client";

// Shared "Continue with Google" button + divider used by both the custom
// sign-in and sign-up forms. The actual OAuth kick-off lives in each form
// (they use different hooks: useSignIn vs useSignUp); this is just the UI.
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/auth/google-icon";

export function GoogleButton({
  onClick,
  disabled,
  loading,
  label = "Continue with Google",
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled || loading}
      className="h-10 w-full gap-2.5 rounded-[4px] border-border bg-surface shadow-none hover:bg-accent hover:text-accent-foreground"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
      {label}
    </Button>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 py-1" aria-hidden="true">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">or</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
