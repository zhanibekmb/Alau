"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { LEARNED_BOX, SESSION_SIZE, dueWords } from "@/lib/review";
import { speak } from "@/lib/speak";
import type { SavedWord } from "@/lib/state";
import { removeWord, useAppState, useHydrated } from "@/lib/store";
import { POS_LABELS, type BookInfo } from "@/lib/types";
import { signUpHref } from "@/lib/guest-nudge";
import { useEntitlements } from "@/lib/use-entitlements";
import { useNow } from "@/lib/use-now";
import { BookCover } from "./book-card";
import { GuestSignUpCard } from "./guest-nudge";
import { Mascot } from "./brand";
import { ArrowRightIcon, CardsIcon, CloseIcon, FolderIcon, LockIcon, PageIcon, SearchIcon, SortIcon, SpeakerIcon, WordsIcon } from "./icons";
import { WordReview } from "./word-review";

// Dictionary from the Figma Desktop screens (MyWords-all-words, MyWords-book-words).

type Sort = "new" | "old" | "az";
const SORTS: { id: Sort; label: string }[] = [
  { id: "new", label: "Алдымен жаңалары" },
  { id: "old", label: "Алдымен ескілері" },
  { id: "az", label: "Әліпби бойынша (A–Z)" },
];

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function Dictionary({ books: catalog }: { books: BookInfo[] }) {
  const { words, reviews } = useAppState();
  const hydrated = useHydrated();
  const now = useNow();
  const { signedIn, sessionPending } = useEntitlements();
  const [session, setSession] = useState<string[] | null>(null);
  const [view, setView] = useState<"all" | "book">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("new");
  const [bookSlug, setBookSlug] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const all = useMemo(() => {
    const list = Object.values(words);
    if (sort === "az") return list.sort((a, b) => a.lemma.localeCompare(b.lemma, "en"));
    return list.sort((a, b) => (sort === "new" ? b.savedAt - a.savedAt : a.savedAt - b.savedAt));
  }, [words, sort]);

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
  // "All words" always shows a word; "by book" shows the book until a word is chosen (as in the design).
  const shown = selected ?? (view === "all" ? visible[0] : undefined);
  const due = now ? dueWords(words, reviews, now.getTime()).length : 0;
  const infoFor = (slug: string) => catalog.find((b) => b.slug === slug);

  const tabs = [
    { id: "all" as const, label: "Барлық сөздер", Icon: FolderIcon },
    { id: "book" as const, label: "Кітап бойынша", Icon: WordsIcon },
  ];

  return (
    <div className="mx-auto w-full max-w-[913px] px-5 pb-10 pt-6 md:px-8 md:pt-14">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold md:text-4xl">Сөздік</h1>
        {all.length > 0 && !signedIn && !sessionPending && (
          // Review is an account feature: a guest sees how many words wait, and the way to them.
          <Link
            href={signUpHref("/dictionary")}
            title="Сөздерді қайталау үшін тегін аккаунт ашыңыз"
            className="flex h-12 items-center gap-2.5 rounded-2xl bg-accent px-4 text-lg font-medium text-white shadow-md shadow-accent/30 transition-transform active:scale-[0.98]"
          >
            <LockIcon className="size-5" />
            Сөздерді қайталау
            {due > 0 && (
              <span className="flex min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-sm font-semibold text-amber-700">
                {due}
              </span>
            )}
          </Link>
        )}
        {all.length > 0 && signedIn && (
          <button
            type="button"
            onClick={() => setSession(dueWords(words, reviews, Date.now()).slice(0, SESSION_SIZE).map((w) => w.id))}
            disabled={due === 0}
            title={due === 0 ? "Бүгінгі қайталау аяқталды" : `${due} сөз қайталауды күтіп тұр`}
            className="flex h-12 items-center gap-2.5 rounded-2xl bg-accent px-4 text-lg font-medium text-white shadow-md shadow-accent/30 transition-transform active:scale-[0.98] disabled:bg-chip disabled:text-muted disabled:shadow-none"
          >
            <CardsIcon className="size-6" />
            Сөздерді қайталау
            {due > 0 && (
              <span className="flex min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-sm font-semibold text-amber-700">
                {due}
              </span>
            )}
          </button>
        )}
      </header>
      <GuestSignUpCard className="mt-5" />
      {session && <WordReview initialQueue={session} onClose={() => setSession(null)} />}

      {!hydrated ? (
        <div className="mt-8 h-64 animate-pulse rounded-3xl bg-sidebar" aria-label="Жүктелуде" />
      ) : all.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 py-8 text-center">
          <Mascot pose="empty-state" className="size-32" />
          <p className="text-lg font-semibold">Сөздік әзірге бос</p>
          <p className="max-w-sm text-muted">
            Кітап оқығанда сөзді басып, «Сөздікке сақтау» батырмасын таңдаңыз. Сөз осы жерде сақталады.
          </p>
          <Link href="/library" className="mt-2 rounded-xl bg-accent px-5 py-2.5 font-medium text-on-accent">
            Кітапханаға өту
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 flex gap-6 border-b border-line" role="group" aria-label="Сөздік көрінісі">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={view === id}
                onClick={() => {
                  setView(id);
                  setSelectedId(null);
                }}
                className={`-mb-px flex items-center gap-1.5 border-b-2 pb-2.5 font-medium transition-colors ${
                  view === id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </div>

          {view === "book" && (
            <div className="-mx-5 mt-6 flex gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:-mx-8 md:px-8">
              {books.map((book) => {
                const info = infoFor(book.slug);
                const active = activeBook === book.slug;
                return (
                  <button
                    key={book.slug}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setBookSlug(book.slug);
                      setSelectedId(null);
                    }}
                    className={`flex w-[300px] shrink-0 items-center gap-4 rounded-3xl border-2 p-3.5 text-left transition-colors md:w-[380px] ${
                      active ? "border-accent bg-[#fdf6e8]" : "border-line hover:border-accent/40"
                    }`}
                  >
                    {info ? (
                      <BookCover cover={info.cover} className="h-[120px] w-[80px] shrink-0 rounded-xl md:h-[128px] md:w-[85px]" />
                    ) : (
                      <span className="h-[120px] w-[80px] shrink-0 rounded-xl bg-chip" />
                    )}
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-lg font-semibold leading-snug">{book.title}</span>
                      <span className="mt-2 block">{book.count} сөз</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div
            className={`mt-6 grid gap-5 md:grid-cols-2 ${
              view === "book" ? "rounded-3xl border border-line p-4 md:p-5" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="flex gap-3">
                <label className="relative block flex-1">
                  <span className="sr-only">Іздеу</span>
                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Іздеу"
                    className="h-[50px] w-full rounded-2xl border border-line pl-10 pr-3 outline-accent"
                  />
                </label>
                <SortMenu value={sort} onChange={setSort} />
              </div>

              {visible.length === 0 ? (
                <p className="mt-8 text-center font-semibold">Ештеңе табылмады</p>
              ) : (
                <ul className="mt-4 flex flex-col gap-4 md:-mx-1 md:max-h-[calc(100dvh-300px)] md:overflow-y-auto md:px-1 md:py-1 md:pr-3">
                  {visible.map((word) => {
                    const active = shown?.id === word.id;
                    const learned = (reviews[word.id]?.box ?? 0) >= LEARNED_BOX;
                    return (
                      <li key={word.id}>
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSelectedId(word.id)}
                          className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                            active ? "border-accent bg-[#fdf6e8] ring-1 ring-accent" : "border-line hover:border-accent/40"
                          }`}
                        >
                          <span className="block text-lg">
                            <span lang="en">{capitalize(word.lemma)}</span> - {word.kk}
                          </span>
                          <span className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
                            <WordsIcon className="size-4" />
                            <span className="truncate">{word.bookTitle}</span>
                            {learned && <span className="ml-auto shrink-0 font-medium text-emerald-700">✓ үйренілді</span>}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {shown ? (
              <WordCard word={shown} openOnPhone={Boolean(selected)} onClose={() => setSelectedId(null)} />
            ) : view === "book" && activeBook ? (
              <BookSummary
                info={infoFor(activeBook)}
                title={books.find((b) => b.slug === activeBook)?.title ?? ""}
                count={books.find((b) => b.slug === activeBook)?.count ?? 0}
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

function SortMenu({ value, onChange }: { value: Sort; onChange: (sort: Sort) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Сұрыптау"
        title="Сұрыптау"
        className="flex size-[50px] items-center justify-center rounded-2xl bg-chip transition-colors hover:bg-line"
      >
        <SortIcon className="size-6" />
      </button>
      {open && (
        <ul role="menu" className="absolute right-0 top-full z-20 mt-2 w-60 animate-card-in rounded-2xl border border-line bg-white p-1.5 shadow-xl">
          {SORTS.map((option) => (
            <li key={option.id} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={value === option.id}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-sidebar ${
                  value === option.id ? "font-semibold" : ""
                }`}
              >
                {option.label}
                {value === option.id && <span className="text-accent">●</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** The sentence with the saved word in amber (simple match on the word's start, so "curious" finds "Curiously"). */
function Excerpt({ sentence, lemma }: { sentence: string; lemma: string }) {
  const escaped = lemma.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = sentence.split(new RegExp(`\\b(${escaped}\\w*)`, "i"));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-amber-600">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** A side card on desktop, a bottom sheet on a phone. */
function WordCard({ word, openOnPhone, onClose }: { word: SavedWord; openOnPhone: boolean; onClose: () => void }) {
  const { settings } = useAppState();

  return (
    <section
      className={`self-start rounded-t-3xl bg-white p-5 max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-40 max-md:shadow-[0_-8px_30px_rgb(0_0_0/0.18)] md:sticky md:top-6 md:rounded-3xl md:border md:border-line ${
        openOnPhone ? "" : "max-md:hidden"
      }`}
      aria-label={word.lemma}
    >
      <div className="flex items-start gap-3">
        <h2 className="min-w-0 flex-1 text-2xl font-semibold">
          <span lang="en">{capitalize(word.lemma)}</span>{" "}
          {word.ipa && <span className="font-normal text-muted/70">[{word.ipa}]</span>}
        </h2>
        <button
          type="button"
          onClick={() => speak(word.lemma, settings.accent)}
          aria-label="Тыңдау"
          title="Тыңдау"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-transform hover:scale-105 active:scale-95"
        >
          <SpeakerIcon className="size-5" />
        </button>
        <button type="button" onClick={onClose} aria-label="Жабу" className="-m-1 p-1 md:hidden">
          <CloseIcon className="size-6" />
        </button>
      </div>
      <p className="mt-3 text-lg">
        <span className="font-semibold">Аудармасы:</span> {word.kk}
      </p>
      <p className="text-sm text-muted">{POS_LABELS[word.pos] ?? word.pos}</p>

      <div className="mt-5 rounded-3xl bg-[#efefef] p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-lg font-medium">{word.bookTitle}</p>
          <p className="shrink-0 text-sm text-muted">Кітаптан үзінді</p>
        </div>
        <p className="mt-2 italic leading-relaxed" lang="en">
          <Excerpt sentence={word.sentence} lemma={word.lemma} />
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <PageIcon className="size-4" />
            {word.page}-бет
          </span>
          <Link
            href={`/read/${word.slug}?page=${word.page}`}
            aria-label="Кітапқа өту"
            title="Кітапқа өту"
            className="flex size-9 items-center justify-center rounded-full bg-ink text-white transition-transform hover:scale-105"
          >
            <ArrowRightIcon className="size-5" />
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          removeWord(word.id);
          onClose();
        }}
        className="mt-4 text-sm text-muted hover:text-red-700"
      >
        Сөздіктен өшіру
      </button>
    </section>
  );
}

function BookSummary({ info, title, count }: { info: BookInfo | undefined; title: string; count: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-4 text-center max-md:hidden md:border-l md:border-line">
      {info ? (
        <BookCover cover={info.cover} className="h-[321px] w-[214px] rounded-3xl" />
      ) : (
        <span className="h-[321px] w-[214px] rounded-3xl bg-chip" />
      )}
      <p className="mt-5 text-xl font-semibold">{title}</p>
      {info && <p className="text-muted">{info.author}</p>}
      <p className="text-muted">{count} сөз</p>
    </div>
  );
}
