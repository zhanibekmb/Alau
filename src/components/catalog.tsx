"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { progressPercent } from "@/lib/state";
import { useAppState, useHydrated } from "@/lib/store";
import { LEVELS, type BookInfo, type Level } from "@/lib/types";
import { BookCard, BookCover } from "./book-card";
import { Logo, Mascot } from "./brand";
import { SearchIcon } from "./icons";

type Filter = Level | "all";
const LEVEL_NAMES: Record<Filter, string> = {
  all: "Барлығы",
  A1: "A1 - Бастауыш",
  A2: "A2",
  B1: "B1",
  B2: "B2",
};

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
    <div className="mx-auto w-full max-w-[913px] px-4 pb-10 pt-5 md:px-8 md:pt-12">
      <Logo className="mb-4 text-3xl md:hidden" />
      <ContinueCard books={books} />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Кітапхана</h1>
        <label className="relative block sm:w-[330px]">
          <span className="sr-only">Іздеу</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Іздеу"
            className="h-12 w-full rounded-2xl border border-line bg-white pl-10 pr-3 outline-accent"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Деңгей">
        {(["all", ...LEVELS] as Filter[]).map((level) => (
          <button
            key={level}
            type="button"
            aria-pressed={filter === level}
            onClick={() => setChosen(level)}
            className={`h-10 rounded-full px-4 text-sm font-medium transition-colors ${
              filter === level ? "bg-ink text-white" : "bg-chip text-muted hover:text-ink"
            }`}
          >
            {LEVEL_NAMES[level]}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
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
    <div className="mx-auto w-full max-w-[913px] animate-pulse px-4 pt-5 md:px-8 md:pt-12">
      <div className="h-[132px] rounded-3xl bg-sidebar sm:h-[180px]" />
      <div className="mt-8 h-10 w-48 rounded-xl bg-sidebar" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-sidebar" />
        ))}
      </div>
    </div>
  );
}
