"use client";

// The account trigger pinned to the bottom of the dashboard sidebar.
// Shows the user's avatar (or a letter fallback) + email, and opens a small
// "Log out" menu. Manage account lives in the sidebar nav instead.

import { useEffect, useRef, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

import { Wordmark } from "@/components/wordmark";
import { clearAllCached } from "@/lib/client-cache";

export function AccountMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
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

  // Play a full-page fade-out, then actually sign out once it's done.
  function handleLogout() {
    clearAllCached();
    setOpen(false);
    setLoggingOut(true);
    setTimeout(() => void signOut(), 500);
  }

  return (
    <>
      {/* Full-page logout overlay: the screen closes in to black and shows the
          wordmark, then signs out. */}
      {loggingOut && (
        <div className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-black fade-in-0 duration-500">
          <Wordmark className="animate-in text-3xl tracking-[0.08em] text-white/80 fade-in-0 zoom-in-95 delay-200 duration-300" />
        </div>
      )}

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
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full cursor-pointer items-center gap-2 border-t border-border px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </div>
        )}
      </div>
    </>
  );
}
