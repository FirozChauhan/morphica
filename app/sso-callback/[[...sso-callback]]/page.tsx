// app/sso-callback/[[...sso-callback]]/page.tsx
// Completes the Google OAuth flow for the custom sign-in/sign-up forms.
//
// When the provider redirects the browser back, Clerk sends it to
// /sso-callback (with /oauth_callback appended — hence the catch-all). This
// component finishes the sign-in/sign-up and forwards to the
// `redirectUrlComplete` we passed in the form ("/dashboard").
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background">
      <AuthenticateWithRedirectCallback />
    </main>
  );
}
