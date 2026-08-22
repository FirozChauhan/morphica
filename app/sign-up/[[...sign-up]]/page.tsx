import { AuthHeader } from "@/components/auth/auth-header";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-app">
      <AuthHeader />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <SignUpForm />
      </div>
    </main>
  );
}
