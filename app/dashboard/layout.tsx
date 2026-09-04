import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

import { AccountMenu } from "@/components/dashboard/account-menu";
import { DashboardNav } from "@/components/dashboard/nav";
import { Wordmark } from "@/components/wordmark";

// Dashboard shell in the opencode style: a flat, rule-separated layout —
// bordered 1080px column on desktop, full-bleed on mobile, hairline borders
// between every region (no cards, no shadows, no gradients).
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();

  return (
    <div className="min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1080px] border-x border-border max-md:border-x-0">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 self-start flex-col border-r border-border bg-background md:flex">
          <div className="border-b border-border px-5 py-5">
            <Wordmark className="text-base text-foreground" />
          </div>
          <DashboardNav />
          <div className="mt-auto border-t border-border p-3">
            <AccountMenu />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile header + nav stay pinned while the page scrolls so the
              nav is always one tap away. */}
          <div className="sticky top-0 z-20 bg-background md:hidden">
            <header className="flex h-14 items-center justify-between border-b border-border px-4">
              <Wordmark className="text-base text-foreground" />
              <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
            </header>

            <div className="border-b border-border">
              <DashboardNav />
            </div>
          </div>

          <main className="w-full min-w-0 flex-1 px-5 pt-8 pb-16 md:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
