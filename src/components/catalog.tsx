"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { progressPercent } from "@/lib/state";
import { useAppState, useHydrated } from "@/lib/store";
import { LEVEL_TITLES, LEVELS, type BookInfo, type Level } from "@/lib/types";
import { BookCard, BookCover } from "./book-card";
import { Flame, Mascot } from "./brand";
import { SearchIcon } from "./icons";

type Filter = Level | "all";

/** Phone page header from the Figma Mobile Version: title, flame mark, one-line purpose. */
export function PhoneHeader({ title, children }: { title: string; children: ReactNode }) {
  return (
    <header className="md:hidden">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Flame className="size-[30px] shrink-0" />
      </div>
      <p className="mt-[15px] text-sm leading-[19px] text-muted">{children}</p>
    </header>
  );
}

export function SearchField({ label, value, onChange, placeholder, className = "" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{label}</span>
      <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-5 -translate-y-1/2 text-muted md:left-3" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-line bg-white pl-10 pr-3 outline-accent placeholder:text-muted/70 md:h-12 md:rounded-2xl"
      />
    </label>
  );
}

/** Filter pills. On a phone they scroll sideways instead of wrapping. */
export function ChipRow({ label, className = "", children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`-mx-5 flex gap-2.5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:gap-2 md:overflow-visible md:px-0 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * A filter pill. `detail` slides out next to the label while the pill is chosen
 * (the level name: "A1" becomes "A1 – Бастауыш"). Screen readers always hear the whole text.
 */
export function Chip({ active, onClick, children, detail }: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  detail?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex h-10 shrink-0 items-center rounded-full px-[15px] text-sm font-medium whitespace-nowrap transition-colors duration-300 md:px-4 ${
        active ? "bg-ink text-white shadow-md shadow-black/15" : "bg-chip text-muted hover:text-ink"
      }`}
    >
      {children}
      {detail && (
        <span
          className={`grid transition-[grid-template-columns,opacity] duration-300 ease-out motion-reduce:transition-none ${
            active ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"
          }`}
        >
          <span className="overflow-hidden">&nbsp;– {detail}</span>
        </span>
      )}
    </button>
  );
}

export function ContinueCard({ books }: { books: BookInfo[] }) {
  const { progress } = useAppState();
  const hydrated = useHydrated();

  const current = useMemo(() => {
    return books
      .filter((b) => progress[b.slug] && !progress[b.slug].finished)
      .sort((a, b) => progress[b.slug].updatedAt - progress[a.slug].updatedAt)[0];
  }, [books, progress]);

  if (!hydrated) return <div className="h-[132px] rounded-3xl bg-sidebar sm:h-[180px]" />;

  if (!current) {
    const first = books.find((b) => b.level === "A2") ?? books[0];
    return (
      <section className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-lg shadow-black/8 ring-1 ring-black/5">
        <Mascot className="size-16 shrink-0 sm:size-20" />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold sm:text-xl">Ағылшынша оқып, сөзді бірден түсініңіз</h2>
          <p className="mt-1 text-sm text-muted">
            Сөзді бассаңыз, қазақша аудармасы шығады. Сөздікке сақтап, кейін қайта қарай аласыз.
          </p>
        </div>
        {first && (
          <Link
            href={`/read/${first.slug}`}
            className="hidden shrink-0 rounded-2xl bg-accent px-5 py-3.5 font-medium text-on-accent sm:block"
          >
            Оқуды бастау
          </Link>
        )}
      </section>
    );
  }

  const percent = progressPercent(progress[current.slug]);
  return (
    <section className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-lg shadow-black/8 ring-1 ring-black/5 sm:p-5">
      <BookCover cover={current.cover} className="h-24 w-[72px] shrink-0 rounded-xl sm:h-[140px] sm:w-[110px]" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted">Оқуды жалғастыру</p>
        <h2 className="mt-1 text-lg font-semibold leading-snug sm:text-xl">{current.title}</h2>
        <div className="mt-2 flex max-w-xs items-center gap-2">
          <span className="text-sm font-semibold">{percent}%</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-chip">
            <div className="h-full rounded-full bg-ink" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <Link
          href={`/read/${current.slug}`}
          className="mt-3 inline-block rounded-xl bg-accent px-4 py-2 text-sm font-medium text-on-accent sm:hidden"
        >
          Жалғастыру
        </Link>
      </div>
      <Link
        href={`/read/${current.slug}`}
        className="hidden shrink-0 rounded-2xl bg-accent px-5 py-3.5 font-medium text-on-accent sm:block"
      >
        Жалғастыру
      </Link>
    </section>
  );
}

export function Catalog({ books }: { books: BookInfo[] }) {
  const { settings } = useAppState();
  const [chosen, setChosen] = useState<Filter | null>(null);
  const [query, setQuery] = useState("");
  const filter: Filter = chosen ?? settings.level ?? "all";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter(
      (b) =>
        (filter === "all" || b.level === filter) &&
        (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)),
    );
  }, [books, filter, query]);

  return (
    <div className="mx-auto w-full max-w-[913px] px-5 pb-10 pt-4 md:px-8 md:pt-12">
      <PhoneHeader title="Кітапхана">Деңгейіңізге сай бейімделген ағылшынша кітаптар мен интерактивті сөздік</PhoneHeader>
      {/* On a phone the continue card lives on the My books page (Figma, Mobile Version). */}
      <div className="max-md:hidden">
        <ContinueCard books={books} />
      </div>

      <div className="mt-[15px] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mt-8">
        <h1 className="text-3xl font-bold max-md:hidden">Кітапхана</h1>
        <SearchField
          label="Іздеу"
          value={query}
          onChange={setQuery}
          placeholder="Кітап немесе авторды іздеу..."
          className="sm:w-[330px]"
        />
      </div>

      <ChipRow label="Деңгей" className="mt-5 md:mt-4">
        {(["all", ...LEVELS] as Filter[]).map((level) => (
          <Chip
            key={level}
            active={filter === level}
            onClick={() => setChosen(level)}
            detail={level === "all" ? undefined : LEVEL_TITLES[level]}
          >
            {level === "all" ? "Барлығы" : level}
          </Chip>
        ))}
      </ChipRow>

      {visible.length > 0 ? (
        <div className="mt-[15px] grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 md:mt-6 md:gap-y-6 lg:grid-cols-4">
          {visible.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-3 py-8 text-center">
          <Mascot className="size-20" />
          <p className="font-semibold">{query ? "Ештеңе табылмады" : "Бұл деңгейде әзірге кітап жоқ"}</p>
        </div>
      )}
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[913px] animate-pulse px-5 pt-4 md:px-8 md:pt-12">
      <div className="h-[138px] rounded-3xl bg-sidebar md:h-[180px]" />
      <div className="mt-8 h-10 w-48 rounded-xl bg-sidebar" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-sidebar" />
        ))}
      </div>
    </div>
  );
}
