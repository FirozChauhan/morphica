"use client";

// Theme-matched account panel. Rows are flat and ruled like the rest of the
// dashboard; editing opens Clerk's profile modal themed to the mono palette.
// Security actions use Clerk's <Security /> component inside the modal.
import { useClerk } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

type AccountUser = {
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string;
  initial: string;
  userId: string;
  memberSince: string;
  passwordEnabled: boolean;
  twoFactorEnabled: boolean;
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border px-4 py-3.5 last:border-b-0 max-md:flex-col max-md:items-start max-md:gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        {action}
      </div>
      <div>{children}</div>
    </section>
  );
}

export function AccountProfile({ user }: { user: AccountUser }) {
  const { openUserProfile } = useClerk();

  function handleEdit() {
    openUserProfile();
  }

  return (
    <>
      <div className="space-y-8">
        {/* Identity header */}
        <div className="flex items-center gap-4 border border-border p-4 max-md:flex-col max-md:items-start">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              className="size-14 shrink-0 rounded-[4px] object-cover"
            />
          ) : (
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[4px] bg-accent text-xl font-medium text-foreground">
              {user.initial}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-medium text-foreground">
              {user.name}
            </p>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={handleEdit}
          >
            Edit profile
          </Button>
        </div>

        <Panel
          title="Profile"
          action={
            <button
              type="button"
              onClick={handleEdit}
              className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Edit
            </button>
          }
        >
          <Row label="Full name" value={user.name} />
          <Row
            label="Email"
            value={
              <span className="inline-flex items-center gap-2">
                {user.email}
                {user.emailVerified ? (
                  <span className="rounded-[4px] border border-border px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground">
                    Verified
                  </span>
                ) : (
                  <span className="rounded-[4px] border border-border px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground">
                    Unverified
                  </span>
                )}
              </span>
            }
          />
          <Row label="User ID" value={<code className="text-xs">{user.userId}</code>} />
          <Row label="Member since" value={user.memberSince || "—"} />
        </Panel>

        <Panel
          title="Security"
          action={
            <button
              type="button"
              onClick={handleEdit}
              className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Manage
            </button>
          }
        >
          <Row
            label="Password"
            value={user.passwordEnabled ? "Enabled" : "Not set"}
          />
          <Row
            label="Two-step verification"
            value={user.twoFactorEnabled ? "Enabled" : "Off"}
          />
        </Panel>

        <p className="text-xs leading-5 text-muted-foreground">
          Changes to your name, email, password, and two-step verification are
          handled by the secure profile dialog.
        </p>
      </div>

    </>
  );
}
