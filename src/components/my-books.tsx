"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppState } from "@/lib/store";
import { progressPercent, type AppState } from "@/lib/state";
import type { BookInfo } from "@/lib/types";
import { BookCard, BookCover } from "./book-card";
import { Mascot } from "./brand";
import { Chip, ChipRow, LEVEL_NAMES, PhoneHeader, SearchField } from "./catalog";

type Tab = "all" | "reading" | "saved" | "finished";

function groupBooks(books: BookInfo[], { progress, savedBooks }: AppState) {
  const newestFirst = (a: BookInfo, b: BookInfo) =>
    (progress[b.slug]?.updatedAt ?? 0) - (progress[a.slug]?.updatedAt ?? 0);
  const reading = books.filter((b) => progress[b.slug] && !progress[b.slug].finished).sort(newestFirst);
  const saved = books.filter((b) => savedBooks[b.slug]);
  const finished = books.filter((b) => progress[b.slug]?.finished).sort(newestFirst);
  const all = [...new Set([...reading, ...finished, ...saved])];
  return { all, reading, saved, finished };
}

const EMPTY: Record<Tab, string> = {
  all: "Сөреңіз әзірге бос",
  reading: "Сіз әлі кітап оқуды бастаған жоқсыз",
  saved: "Сақталған кітаптар әзірге жоқ",
  finished: "Оқып біткен кітаптар әзірге жоқ",
};

export function MyBooks({ books }: { books: BookInfo[] }) {
  const state = useAppState();
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const groups = groupBooks(books, state);
  const current = groups.reading[0];
  const wordsIn = (slug: string) => Object.values(state.words).filter((w) => w.slug === slug).length;

  const q = query.trim().toLowerCase();
  const shown = groups[tab].filter(
    (b) => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q),
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: `Барлығы (${groups.all.length})` },
    { id: "reading", label: `Оқып жатырмын (${groups.reading.length})` },
    { id: "saved", label: `Сақталғандар (${groups.saved.length})` },
    { id: "finished", label: `Оқып біткендер (${groups.finished.length})` },
  ];

  return (
    <div className="mx-auto w-full max-w-[913px] px-5 pb-10 pt-4 md:px-8 md:pt-14">
      <PhoneHeader title="Менің кітаптарым">Оқып жатқан, ұнатқан және аяқтаған кітаптарыңыздың жеке сөресі</PhoneHeader>
      <h1 className="text-4xl font-bold max-md:hidden">Менің кітаптарым</h1>

      <ul className="mt-[15px] flex gap-2.5 text-[15px] font-medium md:hidden">
        <li className="flex h-10 items-center gap-2 rounded-full border border-line px-3.5">
          <span aria-hidden="true">✅</span>
          {groups.finished.length} кітап
        </li>
        <li className="flex h-10 items-center gap-2 rounded-full border border-line px-3.5">
          <span aria-hidden="true">🧠</span>+{Object.keys(state.words).length} сөз
        </li>
      </ul>

      {current && (
        <>
          <ContinueBlock book={current} state={state} />
          <section className="mt-6 flex items-center gap-4 rounded-3xl bg-sidebar p-5 max-md:hidden">
            <BookCover cover={current.cover} className="h-[140px] w-[105px] shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted">Қазір оқылуда</p>
              <h2 className="mt-1 text-xl font-semibold">{current.title}</h2>
              <p className="mt-1 text-sm text-muted">{whereAt(current, state)}</p>
              <Link
                href={`/read/${current.slug}`}
                className="mt-3 inline-block rounded-xl bg-accent px-5 py-2.5 font-medium text-on-accent"
              >
                Жалғастыру
              </Link>
            </div>
          </section>
        </>
      )}

      <ChipRow label="Кітаптар тізімі" className="mt-5 pb-1 md:mt-8">
        {tabs.map(({ id, label }) => (
          <Chip key={id} active={tab === id} onClick={() => setTab(id)}>
            {label}
          </Chip>
        ))}
      </ChipRow>

      <SearchField
        label="Сөреден іздеу"
        value={query}
        onChange={setQuery}
        placeholder="Менің сөремнен іздеу..."
        className="mt-5 md:mt-4 md:w-[330px]"
      />

      <hr className="mt-5 border-line md:hidden" />

      {shown.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 md:mt-6 md:gap-y-6 lg:grid-cols-4">
          {shown.map((book) => {
            const started = Boolean(state.progress[book.slug]);
            return (
              <BookCard
                key={book.slug}
                book={book}
                href={started ? `/read/${book.slug}` : undefined}
                percent={started ? progressPercent(state.progress[book.slug]) : undefined}
                savedWords={wordsIn(book.slug)}
              />
            );
          })}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-3 py-8 text-center">
          <Mascot className="size-20" />
          <p className="font-semibold">{q ? "Ештеңе табылмады" : EMPTY[tab]}</p>
          {!q && (
            <Link href="/" className="rounded-xl bg-accent px-5 py-2.5 font-medium text-on-accent">
              Кітапханаға өту
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

/** Phone version of the "last read" card (Figma Mobile Version, MyBooks). */
function ContinueBlock({ book, state }: { book: BookInfo; state: AppState }) {
  const percent = progressPercent(state.progress[book.slug]);
  return (
    <section className="mt-5 rounded-[20px] border border-line bg-white p-5 shadow-sm md:hidden">
      <div className="flex gap-4">
        <BookCover cover={book.cover} className="h-[135px] w-[100px] shrink-0 rounded-xl" />
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <p className="text-sm text-muted">Соңғы оқылған кітап</p>
          <h2 className="mt-1 text-[15px] font-semibold leading-[19px]">{book.title}</h2>
          <span className="mt-auto rounded-lg bg-accent-soft px-2 py-1.5 text-[13px] font-medium leading-none text-amber-800">
            {LEVEL_NAMES[book.level]}
          </span>
        </div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-chip">
        <div className="h-full rounded-full bg-ink" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1.5 text-[13px]">{whereAt(book, state)}</p>
      <Link
        href={`/read/${book.slug}`}
        className="mt-4 flex h-10 items-center justify-center rounded-xl bg-ink font-medium text-white"
      >
        Оқуды жалғастыру
      </Link>
    </section>
  );
}

function whereAt(book: BookInfo, state: AppState) {
  const page = state.progress[book.slug].page;
  const chapter = book.chapters.find((c) => page >= c.firstPage && page <= c.lastPage)?.n ?? 1;
  return `${chapter}-тарау • ${page}/${book.totalPages} бет`;
}
