"use client";

import { ClerkProvider as Clerk } from "@clerk/nextjs";
import { dark, shadcn } from "@clerk/themes";

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <Clerk
      appearance={{ baseTheme: dark, ...shadcn }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      {children}
    </Clerk>
  );
}