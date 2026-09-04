import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AccountProfile } from "@/components/dashboard/account-profile";

// Flat, theme-matched account page. Clerk's raw <UserProfile /> fights the
// mono design system, so the profile facts render as ruled rows here and
// Clerk's profile modal (fully themed) is used for edits.
export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const primary = user.primaryEmailAddress ?? user.emailAddresses[0];
  const name =
    user.fullName ?? user.username ?? primary?.emailAddress.split("@")[0] ?? "User";
  const initial = (name[0] ?? "?").toUpperCase();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[1.375rem] leading-8 font-semibold">Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, password, and security.
        </p>
      </div>

      <AccountProfile
        user={{
          name,
          email: primary?.emailAddress ?? "",
          emailVerified: `${primary?.verification?.status ?? ""}` === "complete",
          avatarUrl: user.imageUrl,
          initial,
          userId: user.id,
          memberSince: user.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "",
          passwordEnabled: user.passwordEnabled,
          twoFactorEnabled: user.twoFactorEnabled,
        }}
      />
    </div>
  );
}
