"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartNoAxesColumn, ListChecks, LogOut, Target } from "lucide-react";
import { logout } from "@/app/login/actions";

const LINKS = [
  { href: "/todo", label: "To-do", icon: ListChecks },
  { href: "/objectives", label: "Objectives", icon: Target },
  { href: "/progress", label: "Progress", icon: ChartNoAxesColumn },
];

export function Nav() {
  const pathname = usePathname();
  if (pathname.startsWith("/login")) return null;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Desktop: one black bar across the top. */}
      <header className="hidden bg-shell text-paper md:block">
        <div className="mx-auto flex h-14 max-w-[960px] items-center gap-8 px-6">
          <Link href="/todo" className="board text-title font-extrabold tracking-tight">
            Compass
          </Link>
          <nav aria-label="Main" className="flex h-full gap-6">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`flex h-full items-center border-b-2 font-semibold transition-colors ${
                  isActive(href)
                    ? "border-paper text-paper"
                    : "border-transparent text-shell-muted hover:text-paper"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <form action={logout} className="ml-auto">
            <button
              type="submit"
              className="flex items-center gap-2 rounded px-2 py-2 text-meta font-semibold text-shell-muted hover:text-paper focus-visible:outline-paper"
            >
              <LogOut size={16} aria-hidden /> Lock
            </button>
          </form>
        </div>
      </header>

      {/* Phone: a slim brand line on top, tabs under the thumb. */}
      <header className="flex h-12 items-center justify-between px-4 md:hidden">
        <Link href="/todo" className="board text-body font-extrabold">
          Compass
        </Link>
        <form action={logout}>
          <button type="submit" className="icon-btn -mr-3 text-muted" aria-label="Lock Compass">
            <LogOut size={18} aria-hidden />
          </button>
        </form>
      </header>
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 bg-shell pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={`flex h-16 flex-col items-center justify-center gap-1 text-meta font-semibold ${
              isActive(href) ? "text-paper" : "text-shell-muted"
            }`}
          >
            <Icon size={20} strokeWidth={isActive(href) ? 2.5 : 2} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
