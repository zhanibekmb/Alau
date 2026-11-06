"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppState } from "@/lib/store";
import { progressPercent, type AppState } from "@/lib/state";
import type { BookInfo } from "@/lib/types";
import { BookCard, BookCover } from "./book-card";
import { Mascot } from "./brand";

type Tab = "reading" | "saved" | "finished";

function groupBooks(books: BookInfo[], { progress, savedBooks }: AppState) {
  const newestFirst = (a: BookInfo, b: BookInfo) =>
    (progress[b.slug]?.updatedAt ?? 0) - (progress[a.slug]?.updatedAt ?? 0);
  return {
    reading: books.filter((b) => progress[b.slug] && !progress[b.slug].finished).sort(newestFirst),
    saved: books.filter((b) => savedBooks[b.slug]),
    finished: books.filter((b) => progress[b.slug]?.finished).sort(newestFirst),
  };
}

const EMPTY: Record<Tab, string> = {
  reading: "Сіз әлі кітап оқуды бастаған жоқсыз",
  saved: "Сақталған кітаптар әзірге жоқ",
  finished: "Оқып біткен кітаптар әзірге жоқ",
};

export function MyBooks({ books }: { books: BookInfo[] }) {
  const state = useAppState();
  const [tab, setTab] = useState<Tab>("reading");
  const groups = groupBooks(books, state);
  const current = groups.reading[0];
  const wordsIn = (slug: string) => Object.values(state.words).filter((w) => w.slug === slug).length;

  const tabs: { id: Tab; label: string }[] = [
    { id: "reading", label: `Оқып жатырмын (${groups.reading.length})` },
    { id: "saved", label: `Сақталғандар (${groups.saved.length})` },
    { id: "finished", label: `Оқып біткендер (${groups.finished.length})` },
  ];

  return (
    <div className="mx-auto w-full max-w-[913px] px-4 pb-10 pt-6 md:px-8 md:pt-14">
      <h1 className="text-3xl font-bold md:text-4xl">Менің кітаптарым</h1>

      {current && (
        <section className="mt-6 flex items-center gap-4 rounded-3xl bg-sidebar p-4 sm:p-5">
          <BookCover cover={current.cover} className="h-28 w-[84px] shrink-0 rounded-xl sm:h-[140px] sm:w-[105px]" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted">Қазір оқылуда</p>
            <h2 className="mt-1 text-lg font-semibold sm:text-xl">{current.title}</h2>
            <p className="mt-1 text-sm text-muted">
              {chapterOf(current, state.progress[current.slug].page)}-тарау •{" "}
              {state.progress[current.slug].page}/{current.totalPages} бет
            </p>
            <Link
              href={`/read/${current.slug}`}
              className="mt-3 inline-block rounded-xl bg-accent px-5 py-2.5 font-medium text-on-accent"
            >
              Жалғастыру
            </Link>
          </div>
        </section>
      )}

      <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="group" aria-label="Кітаптар тізімі">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={tab === id}
            onClick={() => setTab(id)}
            className={`h-10 shrink-0 rounded-full px-4 text-sm font-medium ${
              tab === id ? "bg-ink text-white" : "bg-chip text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {groups[tab].length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {groups[tab].map((book) => (
            <BookCard
              key={book.slug}
              book={book}
              href={tab === "saved" ? undefined : `/read/${book.slug}`}
              percent={tab === "saved" ? undefined : progressPercent(state.progress[book.slug])}
              savedWords={wordsIn(book.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-3 py-8 text-center">
          <Mascot className="size-20" />
          <p className="font-semibold">{EMPTY[tab]}</p>
          <Link href="/" className="rounded-xl bg-accent px-5 py-2.5 font-medium text-on-accent">
            Кітапханаға өту
          </Link>
        </div>
      )}
    </div>
  );
}

function chapterOf(book: BookInfo, page: number) {
  return book.chapters.find((c) => page >= c.firstPage && page <= c.lastPage)?.n ?? 1;
}
