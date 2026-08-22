import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ClerkLoaded } from "@clerk/nextjs";

import { AuthHeader } from "@/components/auth/auth-header";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default async function SignUpPage() {
  const { userId } = await auth();
  // Already signed in? Don't show the sign-up form — go to the dashboard.
  if (userId) redirect("/dashboard");

  return (
    <main className="flex min-h-dvh flex-col bg-app">
      <AuthHeader />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <ClerkLoaded>
          <div className="animate-in w-[30rem] max-w-full fade-in-0 slide-in-from-bottom-2 duration-300 ease-out">
            <SignUpForm />
          </div>
        </ClerkLoaded>
      </div>
    </main>
  );
}
