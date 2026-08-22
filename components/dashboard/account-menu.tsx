"use client";

// The account trigger pinned to the bottom of the dashboard sidebar.
// Shows the user's avatar (or a letter fallback) + email, and opens a small
// "Log out" menu. Manage account lives in the sidebar nav instead.

import { useEffect, useRef, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

import { clearAllCached } from "@/lib/client-cache";

export function AccountMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    "";
  // Fallback avatar: the first letter of the email when there's no photo.
  const initial = (email[0] ?? "?").toUpperCase();

  // Close the menu when clicking anywhere outside it.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-2 py-1.5 transition-colors hover:bg-muted/50"
      >
        {user?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.imageUrl}
            alt=""
            className="size-8 shrink-0 rounded-full"
          />
        ) : (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/15 font-semibold text-brand">
            {initial}
          </span>
        )}
        <span className="min-w-0 truncate text-xs text-muted-foreground">
          {email}
        </span>
      </button>

      {open && (
        // Pops UP from the bottom of the sidebar, spanning its full width.
        <div className="absolute bottom-full -left-3 -right-3 z-50 mb-2 border border-border bg-popover text-popover-foreground shadow-lg">
          <button
            type="button"
            onClick={() => {
              // Clear the client cache first so the next account never sees
              // this one's dashboard data.
              clearAllCached();
              void signOut();
            }}
            className="flex w-full cursor-pointer items-center gap-2 border-t border-border px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
