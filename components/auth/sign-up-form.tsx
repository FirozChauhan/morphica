"use client";

// Custom sign-up form (instead of Clerk's hosted component). I wanted to ask
// for a full name and auto-assign a unique username, which the stock
// <SignUp /> component doesn't support.
//
// Flow: create the Clerk sign-up → send an email code → verify it → finalize
// the session → redirect into the dashboard.
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleButton, OrDivider } from "@/components/auth/google-button";

function slugify(value: string): string {
  // Turn a name into a safe username fragment: lowercase, alphanumeric only.
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 14) || "user";
}

function uniqueUsername(fullName: string): string {
  // slug + a random 4-char suffix makes collisions essentially impossible.
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slugify(fullName)}${suffix}`;
}

function errorMessage(err: unknown): string {
  // Clerk errors carry a human-readable message/longMessage.
  const e = err as { message?: string; longMessage?: string };
  return e.longMessage ?? e.message ?? "Something went wrong.";
}

export function SignUpForm() {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [step, setStep] = useState<"form" | "verify">("form");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google OAuth sign-up: Clerk creates the account from Google's profile and
  // redirects back through /sso-callback to complete it, landing on /dashboard.
  async function handleGoogle() {
    if (!signUp) return;
    setGoogleLoading(true);
    setError(null);
    try {
      const res = await signUp.sso({
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp) return;
    setLoading(true);
    setError(null);

    // Split the full name into first/last; "last" is optional.
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ") || undefined;
    const generated = uniqueUsername(fullName);

    try {
      // Step 1: create the sign-up with all the fields. Clerk validates the
      // email/password/username rules and returns an error object on failure.
      const res = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        username: generated,
      });
      if (res.error) throw res.error;

      // Step 2: fire off the verification email.
      const sendRes = await signUp.verifications.sendEmailCode();
      if (sendRes.error) throw sendRes.error;

      setUsername(generated);
      setStep("verify");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp) return;
    setLoading(true);
    setError(null);
    try {
      // Step 3: check the code the user typed against the email we sent.
      const res = await signUp.verifications.verifyEmailCode({ code });
      if (res.error) throw res.error;

      // Step 4: finalize converts the completed sign-up into an active
      // session, then we're in.
      const fin = await signUp.finalize();
      if (fin.error) throw fin.error;

      router.push("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card flex w-[30rem] max-w-full min-h-[28rem] flex-col border border-border p-6 text-white">
      <h1 className="text-lg font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {step === "form"
          ? "Enter your details to get started."
          : `A verification code was sent to ${email}.`}
      </p>

      {step === "form" ? (
        <div className="mt-6 flex flex-1 flex-col">
          <GoogleButton
            onClick={handleGoogle}
            disabled={!signUp}
            loading={googleLoading}
          />
          <OrDivider />

          <form
            onSubmit={handleCreate}
            className="flex flex-1 flex-col space-y-4"
          >
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Full name
              </span>
              <Input
                required
                autoFocus
                placeholder="e.g. Firoz Khan Chauhan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 border-white/20 bg-transparent text-white shadow-none placeholder:text-white/40 focus-visible:border-white/60 focus-visible:ring-0"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Email
              </span>
              <Input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-white/20 bg-transparent text-white shadow-none placeholder:text-white/40 focus-visible:border-white/60 focus-visible:ring-0"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Password
              </span>
              <Input
                required
                type="password"
                minLength={8}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-white/20 bg-transparent text-white shadow-none placeholder:text-white/40 focus-visible:border-white/60 focus-visible:ring-0"
              />
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              type="submit"
              disabled={loading || !signUp}
              className="mt-auto h-12 w-full gap-1.5 bg-white text-black hover:bg-white/90"
            >
              {loading ? <Loader2 className="animate-spin" /> : null}
              Create account
              {!loading && <ArrowRight className="size-4" />}
            </Button>
          </form>
        </div>
      ) : (
        <form
          onSubmit={handleVerify}
          className="mt-6 flex flex-1 flex-col space-y-4"
        >
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Verification code
            </span>
            <Input
              required
              autoFocus
              inputMode="numeric"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-12 border-white/20 bg-transparent text-white shadow-none placeholder:text-white/40 focus-visible:border-white/60 focus-visible:ring-0"
            />
          </label>

          <p className="text-xs text-muted-foreground">
            Your username is <span className="text-white">{username}</span> —
            keep it to sign in.
          </p>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            type="submit"
            disabled={loading || !signUp}
            className="mt-auto h-12 w-full gap-1.5 bg-white text-black hover:bg-white/90"
          >
            {loading ? <Loader2 className="animate-spin" /> : null}
            Verify &amp; continue
            {!loading && <ArrowRight className="size-4" />}
          </Button>
        </form>
      )}
    </div>
  );
}