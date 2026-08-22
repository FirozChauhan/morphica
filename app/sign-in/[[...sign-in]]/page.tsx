import { SignIn } from "@clerk/nextjs";

import { AuthHeader } from "@/components/auth/auth-header";
import { SignUpNav } from "@/components/auth/auth-nav";
import { authAppearance } from "@/components/auth/appearance";

export default function SignInPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-app">
      <AuthHeader action={<SignUpNav />} />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <SignIn
          fallbackRedirectUrl="/dashboard"
          appearance={authAppearance}
        />
      </div>
    </main>
  );
}
