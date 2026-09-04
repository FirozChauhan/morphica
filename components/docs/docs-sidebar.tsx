"use client";

// Docs left sidebar — sticky 300px column. Every entry is a real anchor
// into this page's content (no stub pages). On mobile it collapses to a
// horizontal chip row under the header.
import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Entry = { label: string; hash: string };

const GROUPS: { label: string; entries: Entry[] }[] = [
  {
    label: "Getting started",
    entries: [
      { label: "Intro", hash: "intro" },
      { label: "Self-hosting", hash: "self-hosting" },
    ],
  },
  {
    label: "API reference",
    entries: [
      { label: "POST /api/process", hash: "post-apiprocess" },
      { label: "Authentication", hash: "authentication" },
      { label: "Form fields", hash: "form-fields" },
      { label: "Responses & errors", hash: "responses" },
      { label: "Notes", hash: "notes" },
    ],
  },
  {
    label: "Examples",
    entries: [
      { label: "curl", hash: "curl" },
      { label: "JavaScript (fetch)", hash: "javascript-fetch" },
      { label: "Python", hash: "python" },
    ],
  },
];

export function DocsSidebar() {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(GROUPS.map((g, i) => [g.label, i < 2])),
  );

  return (
    <>
      {/* Desktop: sticky column. */}
      <aside className="fixed top-16 bottom-0 left-0 z-20 hidden w-[300px] overflow-y-auto border-r border-border bg-background py-6 lg:block">
        <nav className="px-3 text-sm">
          {GROUPS.map((group) => {
            const isOpen = open[group.label] ?? false;
            return (
              <details
                key={group.label}
                open={isOpen}
                onToggle={(e) =>
                  setOpen((prev) => ({
                    ...prev,
                    [group.label]: (e.target as HTMLDetailsElement).open,
                  }))
                }
                className="group"
              >
                <summary
                  className={
                    "flex cursor-pointer list-none items-center justify-between rounded-[4px] px-3 py-1.5 font-medium " +
                    (group.label === "Getting started"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  <span>{group.label}</span>
                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                {isOpen && (
                  <ul className="mt-0.5 mb-3 space-y-0.5">
                    {group.entries.map((entry) => (
                      <li key={entry.hash}>
                        <Link
                          href={`/docs#${entry.hash}`}
                          className="block rounded-[4px] px-3 py-1.5 pl-6 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                          {entry.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </details>
            );
          })}
        </nav>
      </aside>

      {/* Mobile: horizontal chip row under the header. */}
      <div className="sticky top-16 z-20 flex gap-1 overflow-x-auto border-b border-border bg-background px-4 py-2 lg:hidden">
        {GROUPS.flatMap((g) => g.entries).map((entry, i) => (
          <Link
            key={entry.hash}
            href={`/docs#${entry.hash}`}
            className={`shrink-0 rounded-[4px] px-3 py-1.5 text-xs whitespace-nowrap transition-colors ${
              i === 0
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {entry.label}
          </Link>
        ))}
      </div>
    </>
  );
}
