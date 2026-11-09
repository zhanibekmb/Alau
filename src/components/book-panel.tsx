"use client";

import Link from "next/link";
import { useState } from "react";
import { toggleSavedBook, useAppState } from "@/lib/store";
import type { BookInfo } from "@/lib/types";
import { BookCover } from "./book-card";
import { CloseIcon } from "./icons";

/** Key words shown before "+ басқа сөздер". */
const FIRST_WORDS = 4;

/**
 * "Кітап туралы" over the dimmed library (Figma: Book-preview on desktop, a panel on the right;
 * Main-introdaction-book on a phone, a sheet from the bottom). One style for both.
 */
export function BookPanel({ book }: { book: BookInfo }) {
  const { progress, savedBooks } = useAppState();
  const [language, setLanguage] = useState<"kk" | "en">("kk");
  const [allWords, setAllWords] = useState(false);
  const reading = progress[book.slug];
  const saved = Boolean(savedBooks[book.slug]);
  const startLabel = reading && !reading.finished ? "Жалғастыру" : "Кітапты оқуды бастау";

  return (
    <>
      <Link href="/library" scroll={false} aria-hidden="true" tabIndex={-1} className="fixed inset-0 z-40 animate-[fade-in_0.2s] bg-black/30 motion-reduce:animate-none" />
      <aside
        className="fixed inset-x-0 bottom-0 top-[max(3.5rem,16dvh)] z-40 flex animate-card-in flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:top-0 md:w-[497px] md:rounded-none md:rounded-l-3xl"
        aria-label={book.title}
      >
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold tracking-wide text-muted">КІТАП ТУРАЛЫ</p>
            <Link
              href="/library"
              scroll={false}
              aria-label="Жабу"
              className="flex size-[30px] items-center justify-center rounded-full bg-chip transition-colors hover:bg-line"
            >
              <CloseIcon className="size-5" />
            </Link>
          </div>

          <header className="mt-5 flex gap-4">
            <BookCover cover={book.cover} className="h-[150px] w-[100px] shrink-0 rounded-xl md:h-[176px] md:w-[117px]" />
            <div className="flex min-w-0 flex-col">
              <p className="mb-2.5 flex flex-wrap gap-2 text-[13px] font-medium md:text-base">
                <span className="rounded-lg bg-[#ffe3a3] px-2.5 py-0.5 text-amber-900">{book.level}</span>
                <span className="rounded-lg bg-chip px-2.5 py-0.5 text-muted">{book.genre}</span>
              </p>
              <h2 className="text-base font-semibold leading-tight md:text-xl">{book.title}</h2>
              <p className="mt-1 text-[13px] text-muted md:text-base">Авторы: {book.author}</p>
            </div>
          </header>

          <dl className="mt-5 grid grid-cols-[repeat(3,88px)] gap-5 text-center md:grid-cols-[repeat(3,116px)]">
            {[
              ["Уақыты", "⏱", `${book.minutes} мин`],
              ["Көлемі", "📑", `${book.chapters.length} тарау`],
              ["Сөздік қор", "", `+${book.keyWords.length} сөз`],
            ].map(([label, emoji, value]) => (
              <div
                key={label}
                className="flex h-14 flex-col justify-center rounded-xl border border-line px-1 md:h-[60px] md:border-0 md:bg-sidebar"
              >
                <dt className="text-xs text-muted md:text-sm">{label}</dt>
                <dd className="text-[13px] font-semibold md:text-sm">
                  {emoji && <span aria-hidden="true">{emoji} </span>}
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <section className="mt-5 flex flex-col rounded-2xl border border-line bg-sidebar p-5 md:mt-8">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold md:text-base">
                <span aria-hidden="true">📖 </span>Кітап не туралы? <span className="font-normal">(Introduction)</span>
              </h3>
              <LanguageSwitch value={language} onChange={setLanguage} className="max-md:hidden" />
            </div>
            <p className="mt-3 text-[13px] leading-[19px] md:mt-5 md:text-sm md:leading-[21px]" lang={language}>
              {book.description[language]}
            </p>
            {/* Figma puts the switch under the text on a phone. */}
            <LanguageSwitch value={language} onChange={setLanguage} className="mt-3 self-end md:hidden" />
          </section>

          <section className="mt-5 md:mt-8">
            <h3 className="text-sm font-semibold md:text-base">Осы кітапта кездесетін негізгі сөздер</h3>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs md:text-sm">
              {book.keyWords.map((word, i) => (
                <li
                  key={word.en}
                  className={`rounded-lg border border-[#f5e050] bg-[#fffbd6] px-2.5 py-1 ${
                    !allWords && i >= FIRST_WORDS ? "hidden" : "animate-card-in"
                  }`}
                >
                  {word.en} — {word.kk}
                </li>
              ))}
              {!allWords && book.keyWords.length > FIRST_WORDS && (
                <li>
                  <button
                    type="button"
                    onClick={() => setAllWords(true)}
                    className="rounded-lg bg-chip px-2.5 py-1 text-muted transition-colors hover:text-ink"
                  >
                    + басқа сөздер
                  </button>
                </li>
              )}
            </ul>
          </section>

          <section className="mt-5 md:mt-8">
            <h3 className="font-semibold">Кітап мазмұны ({book.chapters.length} тарау)</h3>
            <ol className="mt-3 flex flex-col gap-2.5">
              {book.chapters.map((chapter) => (
                <li key={chapter.n}>
                  <Link
                    href={`/read/${book.slug}?page=${chapter.firstPage}`}
                    className="flex h-10 items-center rounded-xl border border-line px-3.5 text-[13px] font-semibold transition-colors hover:border-accent hover:bg-[#fdf6e8]"
                  >
                    {chapter.n}-тарау: {chapter.title}
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <p className="mt-4 rounded-xl border border-line p-3 text-xs text-muted">
            Сөз аудармалары әлі тексеріліп жатыр. Қате көрсеңіз, бізге жазыңыз.
          </p>
        </div>

        <footer className="flex gap-2.5 border-t border-line px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 md:pt-4">
          <button
            type="button"
            aria-pressed={saved}
            onClick={() => toggleSavedBook(book.slug)}
            className="flex h-[50px] items-center gap-2 rounded-xl border border-line px-4 font-medium transition-colors hover:bg-sidebar md:text-lg"
          >
            <span aria-hidden="true">{saved ? "🧡" : "🤍"}</span>
            {saved ? "Сақталды" : "Сақтау"}
          </button>
          <Link
            href={`/read/${book.slug}`}
            className="flex h-[50px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent font-medium text-white shadow-md shadow-accent/30 md:text-lg"
          >
            <span aria-hidden="true">📖</span>
            {startLabel}
          </Link>
        </footer>
      </aside>
    </>
  );
}

function LanguageSwitch({ value, onChange, className }: {
  value: "kk" | "en";
  onChange: (value: "kk" | "en") => void;
  className: string;
}) {
  return (
    <div role="group" aria-label="Тіл" className={`flex gap-0.5 rounded-lg bg-white p-[3px] text-xs ring-1 ring-line ${className}`}>
      {(["kk", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={value === code}
          onClick={() => onChange(code)}
          className={`rounded-md px-2 py-1 font-medium transition-colors ${value === code ? "bg-ink text-white" : "text-muted"}`}
        >
          <span aria-hidden="true">{code === "kk" ? "🇰🇿 " : "🇬🇧 "}</span>
          {code === "kk" ? "Қаз" : "Eng"}
        </button>
      ))}
    </div>
  );
}
