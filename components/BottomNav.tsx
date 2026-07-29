"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TABS = [
  { href: "/", label: "Today" },
  { href: "/log", label: "Log" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
] as const;

function isActive(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function BottomNav() {
  const pathname = usePathname();
  // The tapped tab is marked active immediately, before the route resolves, so
  // a slow navigation still reads as "heard you" rather than as a dead button.
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    setPending(null);
  }, [pathname]);

  // The picker is pre-identity: there is nothing to navigate to yet.
  if (pathname === "/who") return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 border-t border-ink bg-paper"
      style={{
        // The full 34px inset under a one-line label reads as dead space. Sit
        // just above the home indicator — taps still register there, only
        // drags belong to the system.
        paddingBottom: "max(calc(env(safe-area-inset-bottom) - 22px), 6px)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {/* Hairlines between cells so each tab's pressable column is legible at
          rest, not only while it is being touched. */}
      <ul className="mx-auto grid max-w-md grid-cols-4 divide-x divide-line">
        {TABS.map((tab) => {
          const current = isActive(tab.href, pathname);
          const shown = pending ? pending === tab.href : current;

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                prefetch
                onClick={() => setPending(tab.href)}
                aria-current={current ? "page" : undefined}
                className={`flex min-h-[48px] touch-manipulation flex-col items-center justify-center text-[11px] font-semibold uppercase tracking-[0.12em] ${
                  shown
                    ? "bg-ink text-paper"
                    : "text-ink/70 active:bg-ink active:text-paper"
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
