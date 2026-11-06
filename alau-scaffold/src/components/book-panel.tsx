"use client";

import Link from "next/link";
import { useState } from "react";
import { toggleSavedBook, useAppState } from "@/lib/store";
import type { BookInfo } from "@/lib/types";
import { BookCover } from "./book-card";
import { BookmarkIcon, CloseIcon } from "./icons";

export function BookPanel({ book }: { book: BookInfo }) {
  const { progress, savedBooks } = useAppState();
  const [language, setLanguage] = useState<"kk" | "en">("kk");
  const reading = progress[book.slug];
  const saved = Boolean(savedBooks[book.slug]);
  const startLabel = reading && !reading.finished ? "Жалғастыру" : "Кітапты оқуды бастау";

  return (
    <aside
      className="fixed inset-y-0 right-0 z-40 flex w-full flex-col border-l border-line bg-white shadow-2xl md:w-[497px]"
      aria-label={book.title}
    >
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-wide text-muted">КІТАП ТУРАЛЫ</p>
          <Link href="/" scroll={false} aria-label="Жабу" className="-m-2 p-2">
            <CloseIcon className="size-6" />
          </Link>
        </div>

        <header className="mt-5 flex gap-4">
          <BookCover cover={book.cover} className="h-[150px] w-[112px] shrink-0 rounded-xl" />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold leading-tight">{book.title}</h2>
            <p className="mt-1 text-sm text-muted">Авторы: {book.author}</p>
            <p className="mt-3 flex flex-wrap gap-2 text-sm font-medium">
              <span className="rounded-lg bg-ink px-2.5 py-1 text-white">{book.level}</span>
              <span className="rounded-lg bg-chip px-2.5 py-1">{book.genre}</span>
            </p>
          </div>
        </header>

        <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[
            ["Уақыты", `${book.minutes} мин`],
            ["Көлемі", `${book.chapters.length} тарау`],
            ["Сөздік қор", `+${book.keyWords.length} сөз`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-sidebar px-2 py-2.5">
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="font-semibold">{value}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-6 rounded-2xl bg-sidebar p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold">Кітап не туралы?</h3>
            <div className="flex rounded-lg bg-chip p-0.5 text-sm" role="group" aria-label="Тіл">
              {(["kk", "en"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  aria-pressed={language === code}
                  onClick={() => setLanguage(code)}
                  className={`rounded-md px-2.5 py-1 font-medium ${language === code ? "bg-white shadow-sm" : "text-muted"}`}
                >
                  {code === "kk" ? "Қаз" : "Eng"}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-3 leading-relaxed" lang={language}>
            {book.description[language]}
          </p>
        </section>

        <section className="mt-6">
          <h3 className="font-semibold">Осы кітапта кездесетін негізгі сөздер</h3>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {book.keyWords.map((word) => (
              <li key={word.en} className="rounded-lg bg-accent-soft px-2.5 py-1.5">
                <b className="font-semibold">{word.en}</b> — {word.kk}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h3 className="font-semibold">Кітап мазмұны ({book.chapters.length} тарау)</h3>
          <ol className="mt-3 divide-y divide-line">
            {book.chapters.map((chapter) => (
              <li key={chapter.n}>
                <Link href={`/read/${book.slug}?page=${chapter.firstPage}`} className="flex py-3 hover:text-amber-700">
                  {chapter.n}-тарау: {chapter.title}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-4 rounded-xl border border-line p-3 text-xs text-muted">
          Демо-мәтін: сөз аудармалары әлі тексеріліп жатыр.
        </p>
      </div>

      <footer className="flex gap-2.5 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          aria-pressed={saved}
          onClick={() => toggleSavedBook(book.slug)}
          className="flex h-[50px] items-center gap-2 rounded-2xl border border-line px-4 font-medium"
        >
          <BookmarkIcon filled={saved} className="size-5" />
          {saved ? "Сақталды" : "Сақтау"}
        </button>
        <Link
          href={`/read/${book.slug}`}
          className="flex h-[50px] flex-1 items-center justify-center rounded-2xl bg-accent font-medium text-on-accent"
        >
          {startLabel}
        </Link>
      </footer>
    </aside>
  );
}
