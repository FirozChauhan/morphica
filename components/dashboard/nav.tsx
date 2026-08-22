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

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 p-3 md:flex-1 md:overflow-y-auto">
      <p className="px-2 pb-2 pt-1 text-xs font-medium text-muted-foreground md:hidden">
        Navigation
      </p>
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-brand/10 text-brand"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
