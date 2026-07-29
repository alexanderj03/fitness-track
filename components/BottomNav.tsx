"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Today" },
  { href: "/log", label: "Log" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  // The picker is pre-identity: there is nothing to navigate to yet.
  if (pathname === "/who") return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 border-t border-ink bg-paper"
      style={{
        // The full 34px inset under a one-line label reads as dead space. Keep
        // the tap targets clear of the home-indicator gesture zone and no more.
        paddingBottom: "max(calc(env(safe-area-inset-bottom) - 14px), 8px)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {TABS.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`flex min-h-[44px] flex-col items-center justify-center text-[11px] font-semibold uppercase tracking-[0.12em] ${
                  active ? "text-ink" : "text-ink/70"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
