"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function SignUpNav() {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="outline"
      className="h-8 rounded-[4px] border-border bg-transparent px-4 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      onClick={() => router.push("/sign-up")}
    >
      Sign up
    </Button>
  );
}

export function SignInNav() {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="outline"
      className="h-8 rounded-[4px] border-border bg-transparent px-4 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      onClick={() => router.push("/sign-in")}
    >
      Sign in
    </Button>
  );
}