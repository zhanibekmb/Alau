"use client";

import Link from "next/link";
import { useState } from "react";
import { toggleSavedBook, useAppState } from "@/lib/store";
import type { BookInfo } from "@/lib/types";
import { BookCover } from "./book-card";
import { BookmarkIcon, CloseIcon } from "./icons";

/** Key words shown before "+ басқа сөздер" on a phone. */
const PHONE_WORDS = 4;

/**
 * Desktop: a panel on the right. Phone: a sheet over the dimmed library
 * (Figma Mobile Version, Main-introdaction-book).
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
      <Link href="/" scroll={false} aria-hidden="true" tabIndex={-1} className="fixed inset-0 z-40 bg-black/30 md:hidden" />
      <aside
        className="fixed inset-x-0 bottom-0 top-[max(3.5rem,16dvh)] z-40 flex flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:top-0 md:w-[497px] md:rounded-none md:border-l md:border-line"
        aria-label={book.title}
      >
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold tracking-wide text-muted">КІТАП ТУРАЛЫ</p>
            <Link
              href="/"
              scroll={false}
              aria-label="Жабу"
              className="flex size-[30px] items-center justify-center rounded-full bg-chip md:-m-2 md:size-auto md:bg-transparent md:p-2"
            >
              <CloseIcon className="size-5 md:size-6" />
            </Link>
          </div>

          <header className="mt-5 flex gap-4">
            <BookCover cover={book.cover} className="h-[130px] w-[100px] shrink-0 rounded-xl md:h-[150px] md:w-[112px]" />
            <div className="flex min-w-0 flex-col">
              <h2 className="text-base font-semibold leading-[19px] md:text-2xl md:font-bold md:leading-tight">{book.title}</h2>
              <p className="mt-1 text-[13px] text-muted md:text-sm">Авторы: {book.author}</p>
              <p className="flex flex-wrap gap-2 text-[13px] font-medium max-md:order-first max-md:mb-2.5 md:mt-3 md:text-sm">
                <span className="rounded-lg bg-accent px-2.5 py-1 text-on-accent md:bg-ink md:text-white">{book.level}</span>
                <span className="rounded-lg bg-chip px-2.5 py-1 max-md:text-muted">{book.genre}</span>
              </p>
            </div>
          </header>

          <dl className="mt-5 grid grid-cols-[repeat(3,88px)] gap-5 text-center md:grid-cols-3 md:gap-2">
            {[
              ["Уақыты", "⏱", `${book.minutes} мин`],
              ["Көлемі", "📑", `${book.chapters.length} тарау`],
              ["Сөздік қор", "", `+${book.keyWords.length} сөз`],
            ].map(([label, emoji, value]) => (
              <div
                key={label}
                className="flex flex-col justify-center rounded-xl border border-line px-1 max-md:h-14 md:rounded-2xl md:border-0 md:bg-sidebar md:px-2 md:py-2.5"
              >
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="text-[13px] font-semibold md:text-base">
                  {emoji && <span className="md:hidden" aria-hidden="true">{emoji} </span>}
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <section className="mt-5 flex flex-col rounded-2xl border border-line bg-sidebar p-5 md:mt-6 md:border-0 md:p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold md:text-base">
                <span className="md:hidden" aria-hidden="true">📖 </span>Кітап не туралы?
              </h3>
              <LanguageSwitch value={language} onChange={setLanguage} className="max-md:hidden" />
            </div>
            <p className="mt-3 text-[13px] leading-[19px] md:text-base md:leading-relaxed" lang={language}>
              {book.description[language]}
            </p>
            {/* Figma puts the switch under the text on a phone. */}
            <LanguageSwitch value={language} onChange={setLanguage} className="mt-3 self-end md:hidden" />
          </section>

          <section className="mt-5 md:mt-6">
            <h3 className="text-sm font-semibold md:text-base">Осы кітапта кездесетін негізгі сөздер</h3>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs md:text-sm">
              {book.keyWords.map((word, i) => (
                <li
                  key={word.en}
                  className={`rounded-lg border border-accent/60 bg-accent-soft px-2.5 py-1.5 md:border-0 ${
                    !allWords && i >= PHONE_WORDS ? "max-md:hidden" : ""
                  }`}
                >
                  <b className="font-medium md:font-semibold">{word.en}</b> — {word.kk}
                </li>
              ))}
              {!allWords && book.keyWords.length > PHONE_WORDS && (
                <li className="md:hidden">
                  <button type="button" onClick={() => setAllWords(true)} className="rounded-lg bg-chip px-2.5 py-1.5 text-muted">
                    + басқа сөздер
                  </button>
                </li>
              )}
            </ul>
          </section>

          <section className="mt-5 md:mt-6">
            <h3 className="font-semibold">Кітап мазмұны ({book.chapters.length} тарау)</h3>
            <ol className="mt-3 flex flex-col gap-2.5 md:gap-0 md:divide-y md:divide-line">
              {book.chapters.map((chapter) => (
                <li key={chapter.n}>
                  <Link
                    href={`/read/${book.slug}?page=${chapter.firstPage}`}
                    className="flex items-center hover:text-amber-700 max-md:h-10 max-md:rounded-xl max-md:border max-md:border-line max-md:px-2.5 max-md:text-[13px] max-md:font-medium md:py-3"
                  >
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

        <footer className="flex gap-2.5 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))] max-md:px-5 max-md:pt-2">
          <button
            type="button"
            aria-pressed={saved}
            onClick={() => toggleSavedBook(book.slug)}
            className="flex h-[50px] items-center gap-2 rounded-xl border border-line px-4 font-medium md:rounded-2xl"
          >
            <span className="md:hidden" aria-hidden="true">{saved ? "🧡" : "🤍"}</span>
            <BookmarkIcon filled={saved} className="size-5 max-md:hidden" />
            {saved ? "Сақталды" : "Сақтау"}
          </button>
          <Link
            href={`/read/${book.slug}`}
            className="flex h-[50px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent font-medium text-white md:rounded-2xl md:text-on-accent"
          >
            <span className="md:hidden" aria-hidden="true">📖</span>
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
    <div
      role="group"
      aria-label="Тіл"
      className={`flex gap-0.5 rounded-lg bg-white p-[3px] text-xs ring-1 ring-line md:bg-chip md:p-0.5 md:text-sm md:ring-0 ${className}`}
    >
      {(["kk", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={value === code}
          onClick={() => onChange(code)}
          className={`rounded-md px-2 py-1 font-medium md:px-2.5 ${
            value === code ? "bg-ink text-white md:bg-white md:text-ink md:shadow-sm" : "text-muted"
          }`}
        >
          <span className="md:hidden" aria-hidden="true">{code === "kk" ? "🇰🇿 " : "🇬🇧 "}</span>
          {code === "kk" ? "Қаз" : "Eng"}
        </button>
      ))}
    </div>
  );
}
