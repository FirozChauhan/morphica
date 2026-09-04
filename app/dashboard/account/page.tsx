import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[1.375rem] leading-8 font-semibold">Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, password, and security.
        </p>
      </div>
      <UserProfile
        appearance={{
          variables: { borderRadius: "0" },
        }}
      />
    </div>
  );
}
