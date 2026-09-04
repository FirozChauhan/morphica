"use client";

import { ClerkProvider as Clerk } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

// Clerk appearance themed to Morphica's opencode-style mono palette
// (#131010 bg, #1b1818 surface, #f2eded text, #3d3838 borders, 4px radii).
// Lives on the provider so every Clerk component — including the
// openUserProfile() modal opened from the account page — inherits it.
export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#f2eded",
    colorBackground: "#1b1818",
    colorInputBackground: "#131010",
    colorInputText: "#f2eded",
    colorText: "#f2eded",
    colorTextSecondary: "#7f7a7a",
    colorTextOnPrimaryBackground: "#131010",
    colorNeutral: "#f2eded",
    colorDanger: "#ff6b6b",
    colorSuccess: "#7fd88f",
    borderRadius: "0.375rem",
    fontFamily: "var(--font-mono)",
  },
  elements: {
    modalContent:
      "bg-[#1b1818] border border-[#3d3838] rounded-md shadow-none",
    navbar: "bg-[#131010] border-b border-[#3d3838]",
    formFieldInput:
      "bg-[#131010] border border-[#3d3838] rounded-[4px]",
    formButtonPrimary: "rounded-[4px]",
    identityPreviewEditButton: "rounded-[4px]",
  },
};

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <Clerk
      appearance={clerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      {children}
    </Clerk>
  );
}
