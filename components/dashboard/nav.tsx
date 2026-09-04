"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, KeyRound, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/api-keys",
    label: "API Keys",
    icon: KeyRound,
  },
  {
    href: "/dashboard/usage",
    label: "Usage",
    icon: BarChart3,
  },
  {
    href: "/dashboard/docs",
    label: "Docs",
    icon: BookOpen,
  },
  {
    href: "/dashboard/account",
    label: "Account",
    icon: Settings,
  },
];

// Sidebar nav in the opencode style: quiet mono text, small square icon
// glyphs, hairline separator per row, active row marked by an accent
// background block (no rounded pills, no color fills).
export function DashboardNav() {
  const pathname = usePathname();

  return (
    // Horizontal, swipeable row on mobile; the vertical sidebar column on md+.
    <nav className="flex items-center gap-1 overflow-x-auto px-3 py-2 md:flex-1 md:flex-col md:items-stretch md:gap-0 md:overflow-y-auto md:py-3">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-3 border-b border-transparent px-3 py-2.5 text-sm whitespace-nowrap transition-colors max-md:border-b-0 max-md:rounded-[4px]",
              active
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
