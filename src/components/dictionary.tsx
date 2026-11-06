"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SavedWord } from "@/lib/state";
import { removeWord, useAppState } from "@/lib/store";
import { POS_LABELS } from "@/lib/types";
import { Mascot } from "./brand";
import { CloseIcon, SearchIcon } from "./icons";

export function Dictionary() {
  const { words } = useAppState();
  const [view, setView] = useState<"all" | "book">("all");
  const [query, setQuery] = useState("");
  const [bookSlug, setBookSlug] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const all = useMemo(() => Object.values(words).sort((a, b) => b.savedAt - a.savedAt), [words]);

  const books = useMemo(() => {
    const grouped = new Map<string, { slug: string; title: string; count: number }>();
    for (const word of all) {
      const entry = grouped.get(word.slug) ?? { slug: word.slug, title: word.bookTitle, count: 0 };
      entry.count += 1;
      grouped.set(word.slug, entry);
    }
    return [...grouped.values()];
  }, [all]);

  const activeBook = bookSlug && books.some((b) => b.slug === bookSlug) ? bookSlug : books[0]?.slug;
  const q = query.trim().toLowerCase();
  const visible = all.filter(
    (w) =>
      (view === "all" || w.slug === activeBook) &&
      (!q || w.lemma.toLowerCase().includes(q) || w.kk.toLowerCase().includes(q)),
  );
  const selected = visible.find((w) => w.id === selectedId);
  const shown = selected ?? visible[0];

  return (
    <div className="mx-auto w-full max-w-[913px] px-4 pb-10 pt-6 md:px-8 md:pt-14">
      <h1 className="text-3xl font-bold md:text-4xl">Сөздік</h1>

      {all.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 py-8 text-center">
          <Mascot className="size-24" />
          <p className="text-lg font-semibold">Сөздік әзірге бос</p>
          <p className="max-w-sm text-muted">
            Кітап оқығанда сөзді басып, «Сөздікке сақтау» батырмасын таңдаңыз. Сөз осы жерде сақталады.
          </p>
          <Link href="/" className="mt-2 rounded-xl bg-accent px-5 py-2.5 font-medium text-on-accent">
            Кітапханаға өту
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 flex gap-6 border-b border-line" role="group" aria-label="Сөздік көрінісі">
            {(
              [
                ["all", "Барлық сөздер"],
                ["book", "Кітап бойынша"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={view === id}
                onClick={() => setView(id)}
                className={`-mb-px border-b-2 pb-2 font-medium ${
                  view === id ? "border-accent" : "border-transparent text-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {view === "book" && (
            <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
              {books.map((book) => (
                <button
                  key={book.slug}
                  type="button"
                  aria-pressed={activeBook === book.slug}
                  onClick={() => setBookSlug(book.slug)}
                  className={`shrink-0 rounded-2xl border px-4 py-2.5 text-left ${
                    activeBook === book.slug ? "border-accent bg-accent-soft" : "border-line"
                  }`}
                >
                  <span className="block font-semibold">{book.title}</span>
                  <span className="block text-sm text-muted">{book.count} сөз</span>
                </button>
              ))}
            </div>
          )}

          <label className="relative mt-4 block">
            <span className="sr-only">Іздеу</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Іздеу"
              className="h-12 w-full rounded-2xl border border-line pl-10 pr-3 outline-accent"
            />
          </label>

          {visible.length === 0 ? (
            <p className="mt-8 text-center font-semibold">Ештеңе табылмады</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ul className="flex flex-col gap-2">
                {visible.map((word) => (
                  <li key={word.id}>
                    <button
                      type="button"
                      aria-pressed={shown?.id === word.id}
                      onClick={() => setSelectedId(word.id)}
                      className={`w-full rounded-2xl border p-3.5 text-left ${
                        shown?.id === word.id ? "md:border-accent md:bg-accent-soft" : ""
                      } border-line`}
                    >
                      <span className="block font-semibold">
                        <span lang="en">{capitalize(word.lemma)}</span> <span className="font-normal">- {word.kk}</span>
                      </span>
                      <span className="mt-0.5 block text-sm text-muted">{word.bookTitle}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {shown && (
                <WordCard
                  word={shown}
                  openOnPhone={Boolean(selected)}
                  onClose={() => setSelectedId(null)}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** A side card on desktop, a bottom sheet on a phone. */
function WordCard({
  word,
  openOnPhone,
  onClose,
}: {
  word: SavedWord;
  openOnPhone: boolean;
  onClose: () => void;
}) {
  return (
    <section
      className={`self-start rounded-t-3xl bg-white p-5 max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-40 max-md:shadow-[0_-8px_30px_rgb(0_0_0/0.18)] md:sticky md:top-6 md:rounded-3xl md:border md:border-line ${
        openOnPhone ? "" : "max-md:hidden"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold" lang="en">{capitalize(word.lemma)}</h2>
          <p className="mt-0.5 text-sm text-muted">
            {word.ipa && <span>[{word.ipa}] · </span>}
            {POS_LABELS[word.pos] ?? word.pos}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Жабу" className="-m-2 p-2 md:hidden">
          <CloseIcon className="size-6" />
        </button>
      </div>
      <p className="mt-3 text-lg">
        <span className="text-muted">Аудармасы:</span> <b className="font-semibold">{word.kk}</b>
      </p>
      <div className="mt-4 rounded-2xl bg-sidebar p-4">
        <p className="text-sm font-semibold text-muted">Кітаптан үзінді</p>
        <p className="mt-2 font-serif leading-relaxed" lang="en">{word.sentence}</p>
        <p className="mt-2 text-sm text-muted">{word.bookTitle} · {word.page}-бет</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          href={`/read/${word.slug}?page=${word.page}`}
          className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-accent font-medium text-on-accent"
        >
          Кітапқа өту
        </Link>
        <button
          type="button"
          onClick={() => {
            removeWord(word.id);
            onClose();
          }}
          className="h-12 rounded-2xl border border-line px-4 font-medium"
        >
          Өшіру
        </button>
      </div>
    </section>
  );
}
