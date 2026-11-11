"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { updateSettings, useAppState, useHydrated } from "@/lib/store";
import { AccountBadge } from "./account";
import { Flame, Logo } from "./brand";
import { BookOpenIcon, HomeIcon, PanelIcon, UserIcon, WordsIcon } from "./icons";
import { Tooltip } from "./tooltip";

const LINKS = [
  { href: "/library", label: "Кітапхана", Icon: HomeIcon },
  { href: "/my-books", label: "Менің кітаптарым", Icon: BookOpenIcon },
  { href: "/dictionary", label: "Сөздік", Icon: WordsIcon },
  { href: "/profile", label: "Профиль", Icon: UserIcon },
];

function isActive(pathname: string, href: string) {
  if (href === "/library") return pathname.startsWith("/library") || pathname.startsWith("/books");
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();
  const { settings } = useAppState();
  const hydrated = useHydrated();
  const collapsed = settings.sidebarCollapsed;

  // The head script set the attribute before paint; after hydration the store owns it.
  useEffect(() => {
    if (hydrated) document.documentElement.dataset.sidebar = collapsed ? "collapsed" : "open";
  }, [collapsed, hydrated]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[var(--sidebar-w)] flex-col bg-sidebar px-5 py-10 transition-[width,padding] duration-300 collapsed:px-3 md:flex">
        <div className="flex items-center justify-between gap-2 collapsed:flex-col collapsed:gap-5">
          <Link href="/" className="px-1 text-5xl collapsed:px-0" aria-label="Alau басты беті" title="Басты бет">
            <Logo className="collapsed:hidden" />
            <Flame className="hidden size-11 collapsed:block" />
          </Link>
          <button
            type="button"
            onClick={() => updateSettings({ sidebarCollapsed: !collapsed })}
            aria-label={collapsed ? "Мәзірді ашу" : "Мәзірді жию"}
            title={collapsed ? "Мәзірді ашу" : "Мәзірді жию"}
            aria-expanded={!collapsed}
            className="flex size-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-chip hover:text-ink"
          >
            <PanelIcon className="size-5" />
          </button>
        </div>

        <nav className="mt-20 flex flex-col gap-1.5 collapsed:mt-10" aria-label="Негізгі мәзір">
          {LINKS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex h-[50px] items-center gap-3 rounded-2xl px-3.5 font-medium transition-colors collapsed:justify-center collapsed:px-0 ${
                  active ? "bg-accent text-white shadow-md shadow-accent/30" : "hover:bg-chip"
                }`}
              >
                <Icon className={`size-6 shrink-0 ${active ? "" : "text-muted/70"}`} />
                <span className="truncate collapsed:sr-only">{label}</span>
                <Tooltip>{label}</Tooltip>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-line pt-4">
          <AccountBadge />
        </div>
      </aside>

      {/* Phone: a floating pill. The active tab shows its label, the others only an icon. */}
      <nav
        className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-30 flex h-[60px] -translate-x-1/2 items-center gap-0.5 rounded-[20px] bg-white p-[5px] shadow-lg shadow-black/10 ring-1 ring-black/5 md:hidden"
        aria-label="Негізгі мәзір"
      >
        {LINKS.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              aria-label={active ? undefined : label}
              className={`flex h-[50px] shrink-0 items-center justify-center rounded-[15px] ${
                active ? "gap-2 bg-accent px-3.5 font-medium whitespace-nowrap text-white" : "w-10 text-ink"
              }`}
            >
              <Icon className="size-6 shrink-0" />
              {active && label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

