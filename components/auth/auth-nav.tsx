"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function SignUpNav() {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="outline"
      className="h-9 border-white/40 bg-transparent px-6 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-white"
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
      className="h-9 border-white/40 bg-transparent px-6 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-white"
      onClick={() => router.push("/sign-in")}
    >
      Sign in
    </Button>
  );
}