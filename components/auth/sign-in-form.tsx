"use client";

// Custom sign-in form (matching the custom sign-up form) so both auth screens
// are identical in width and style instead of mixing my UI with Clerk's
// component. Uses Clerk's `useSignIn` hook directly.
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleButton, OrDivider } from "@/components/auth/google-button";

function errorMessage(err: unknown): string {
  const e = err as { message?: string; longMessage?: string };
  return e.longMessage ?? e.message ?? "Something went wrong.";
}

export function SignInForm() {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Kick off the Google OAuth flow. The browser is redirected to Google, then
  // back to /sso-callback (which completes the sign-in), and finally lands on
  // /dashboard with an active session.
  async function handleGoogle() {
    if (!signIn) return;
    setGoogleLoading(true);
    setError(null);
    try {
      const res = await signIn.sso({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectCallbackUrl: "/sso-callback",
      });
      if (res.error) throw res.error;
      // We never get here on success — the browser is being redirected.
    } catch (err) {
      setError(errorMessage(err));
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn) return;
    setLoading(true);
    setError(null);
    try {
      // Password sign-in with email or username as the identifier.
      const res = await signIn.password({ identifier, password });
      if (res.error) throw res.error;

      if (signIn.status === "complete") {
        // Complete the sign-in and activate the session.
        const fin = await signIn.finalize();
        if (fin.error) throw fin.error;
        router.push("/dashboard");
      } else {
        // e.g. MFA — out of scope for v1.
        setError("Additional verification required.");
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-[30rem] max-w-full min-h-[26rem] flex-col rounded-md border border-border bg-background p-6">
      <h1 className="text-lg font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in to your account.
      </p>

      <div className="mt-6 flex flex-1 flex-col">
        <GoogleButton
          onClick={handleGoogle}
          disabled={!signIn}
          loading={googleLoading}
        />
        <OrDivider />

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col space-y-4"
        >
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Email or username
            </span>
            <Input
              required
              autoFocus
              placeholder="you@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-10 rounded-[4px] border-border bg-surface px-3 shadow-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-0"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Password
            </span>
            <Input
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 rounded-[4px] border-border bg-surface px-3 shadow-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-0"
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            type="submit"
            disabled={loading || !signIn}
            className="mt-auto h-10 w-full gap-1.5 rounded-[4px] bg-primary font-medium text-primary-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {loading ? <Loader2 className="animate-spin" /> : null}
            Sign in
            {!loading && <ArrowRight className="size-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
