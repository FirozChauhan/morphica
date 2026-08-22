import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ClerkLoaded } from "@clerk/nextjs";

import { AuthHeader } from "@/components/auth/auth-header";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpNav } from "@/components/auth/auth-nav";

export default async function SignInPage() {
  const { userId } = await auth();
  // Already signed in? Don't show the sign-in form — go to the dashboard.
  if (userId) redirect("/dashboard");

  return (
    <main className="flex min-h-dvh flex-col bg-app">
      <AuthHeader action={<SignUpNav />} />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <ClerkLoaded>
          <div className="animate-in w-[30rem] max-w-full fade-in-0 slide-in-from-bottom-2 duration-300 ease-out">
            <SignInForm />
          </div>
        </ClerkLoaded>
      </div>
    </main>
  );
}
