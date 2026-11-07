"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountBadge } from "./account";
import { Logo } from "./brand";
import { BookOpenIcon, HomeIcon, UserIcon, WordsIcon } from "./icons";

const LINKS = [
  { href: "/", label: "Кітапхана", Icon: HomeIcon },
  { href: "/my-books", label: "Менің кітаптарым", shortLabel: "Кітаптарым", Icon: BookOpenIcon },
  { href: "/dictionary", label: "Сөздік", Icon: WordsIcon },
  { href: "/profile", label: "Профиль", Icon: UserIcon },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/books");
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[270px] flex-col bg-sidebar px-5 py-10 md:flex">
        <Link href="/" className="px-1 text-5xl" aria-label="Alau">
          <Logo />
        </Link>
        <nav className="mt-16 flex flex-col gap-2" aria-label="Негізгі мәзір">
          {LINKS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-[50px] items-center gap-3 rounded-2xl px-3.5 font-medium transition-colors ${
                  active ? "bg-accent text-on-accent shadow-md shadow-accent/30" : "hover:bg-chip"
                }`}
              >
                <Icon className="size-6 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-line pt-3">
          <AccountBadge />
        </div>
      </aside>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Негізгі мәзір"
      >
        {LINKS.map(({ href, label, shortLabel, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
                active ? "text-amber-700" : "text-muted"
              }`}
            >
              <Icon className="size-6" />
              {shortLabel ?? label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
