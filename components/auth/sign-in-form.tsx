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
    <div className="auth-card flex w-[30rem] max-w-full min-h-[28rem] flex-col border border-border p-6 text-white">
      <h1 className="text-lg font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in to your account.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-1 flex-col space-y-4"
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 border-white/20 bg-transparent text-white shadow-none placeholder:text-white/40 focus-visible:border-white/60 focus-visible:ring-0"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button
          type="submit"
          disabled={loading || !signIn}
          className="mt-auto h-12 w-full gap-1.5 bg-white text-black hover:bg-white/90"
        >
          {loading ? <Loader2 className="animate-spin" /> : null}
          Sign in
          {!loading && <ArrowRight className="size-4" />}
        </Button>
      </form>
    </div>
  );
}
