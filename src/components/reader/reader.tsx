"use client";

import Link from "next/link";
import {
  memo,
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
} from "react";
import { sentenceText } from "@/lib/text";
import { recordProgress, saveWord, updateSettings, useAppState, useHydrated } from "@/lib/store";
import type { BookInfo, ChapterFile, Gloss, Page } from "@/lib/types";
import { Mascot } from "../brand";
import { ArrowLeftIcon, ArrowRightIcon, CaretIcon, CloseIcon, MenuIcon, WordsIcon } from "../icons";
import { viewUnlocksWork } from "@/lib/entitlement-view";
import { useEntitlements } from "@/lib/use-entitlements";
import { ChapterMenu, OriginalPanel, SettingsPanel } from "./panels";
import { Paywall } from "./paywall";
import { WordPopover, placePopover, type PopoverPlace } from "./word-popover";

const FONT_FAMILY = { serif: "var(--ff-pt-serif)", sans: "var(--ff-inter)", lora: "var(--ff-lora)" };

/** login and paywall: the server refused a paid chapter (401 guest, 402 no purchase). */
type Loaded = { key: string; status: "ready" | "error" | "gone" | "login" | "paywall"; file?: ChapterFile };

function useChapter(slug: string, chapter: number | null) {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const key = `${slug}/${chapter}/${attempt}`;

  useEffect(() => {
    if (chapter === null) return;
    const controller = new AbortController();
    // no-cache: reuse the browser's copy only after the server confirms it by ETag.
    fetch(`/api/books/${slug}/chapters/${chapter}`, { signal: controller.signal, cache: "no-cache" })
      .then(async (response) => {
        if (response.status === 410 || response.status === 404) {
          setLoaded({ key, status: "gone" });
        } else if (response.status === 401) {
          setLoaded({ key, status: "login" });
        } else if (response.status === 402) {
          setLoaded({ key, status: "paywall" });
        } else if (response.ok) {
          setLoaded({ key, status: "ready", file: (await response.json()) as ChapterFile });
        } else {
          setLoaded({ key, status: "error" });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoaded({ key, status: "error" });
      });
    return () => controller.abort();
  }, [slug, chapter, key]);

  const current = loaded?.key === key ? loaded : null;
  return { status: current?.status ?? "loading", file: current?.file, retry: () => setAttempt((a) => a + 1) };
}

type Selection = {
  sentenceId: string;
  tokenIndex: number;
  ph?: number;
  gloss: Gloss;
  surface: string;
  sentence: string;
  place: PopoverPlace;
};

const PageText = memo(function PageText({
  page,
  selection,
  savedIds,
  onTap,
}: {
  page: Page;
  selection: Pick<Selection, "sentenceId" | "tokenIndex" | "ph"> | null;
  savedIds: Set<string>;
  onTap: (event: MouseEvent<HTMLDivElement>) => void;
}) {
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const word = (event.target as HTMLElement).closest<HTMLElement>("[data-t]");
    if (word) {
      event.preventDefault();
      word.click();
    }
  };

  // Words are inline spans, not <button>: a browser may break the line right after a
  // button, which would push a full stop onto its own line.
  return (
    <div onClick={onTap} onKeyDown={onKeyDown}>
      {page.paragraphs.map((paragraph) => (
        <p key={paragraph[0].id} className="mb-[1.3em]">
          {paragraph.map((sentence) =>
            sentence.tokens.map((token, i) => {
              if (!token.g) return <span key={`${sentence.id}-${i}`}>{token.t}</span>;
              const isSelected =
                selection?.sentenceId === sentence.id &&
                (selection.tokenIndex === i || (token.ph !== undefined && selection.ph === token.ph));
              const className = `word${savedIds.has(token.g) ? " word-saved" : ""}${isSelected ? " word-selected" : ""}`;
              return (
                <span key={`${sentence.id}-${i}`} role="button" tabIndex={0} className={className} data-s={sentence.id} data-t={i}>
                  {token.t}
                </span>
              );
            }),
          )}
        </p>
      ))}
    </div>
  );
});

export function Reader({ book, startPage }: { book: BookInfo; startPage?: number }) {
  const { progress, words, settings } = useAppState();
  const hydrated = useHydrated();
  const stored = progress[book.slug];

  const [chosenPage, setChosenPage] = useState<number | null>(startPage ?? null);
  const [showFinish, setShowFinish] = useState(false);
  const [panel, setPanel] = useState<"chapters" | "settings" | "original" | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);

  const resumePage = stored && !stored.finished ? stored.page : 1;
  const rawPage = chosenPage ?? (hydrated ? resumePage : null);
  const page = rawPage === null ? null : Math.min(Math.max(rawPage, 1), book.totalPages);
  const chapterInfo =
    page === null ? null : (book.chapters.find((c) => page >= c.firstPage && page <= c.lastPage) ?? book.chapters[0]);

  const { status, file, retry } = useChapter(book.slug, chapterInfo?.n ?? null);
  const { entitlements, reload: reloadEntitlements } = useEntitlements();
  const ownsWork = viewUnlocksWork(entitlements, book.work, new Date());
  /** Lock icons in the menu only; the server decides real access. */
  const isLocked = (n: number) => Boolean(book.paywall) && n > (book.paywall?.freeChapters ?? 0) && !ownsWork;
  const pageData = file?.pages.find((p) => p.number === page);
  const isReady = status === "ready" && Boolean(pageData);

  useEffect(() => {
    if (page !== null && isReady) {
      recordProgress(book.slug, { page, totalPages: book.totalPages, finished: false, updatedAt: Date.now() });
    }
  }, [book.slug, book.totalPages, page, isReady]);

  const savedIds = new Set(Object.keys(words));
  const bookWordCount = Object.values(words).filter((w) => w.slug === book.slug).length;

  const closeSelection = useCallback(() => setSelection(null), []);

  useEffect(() => {
    if (!selection && !panel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelection(null);
        setPanel(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selection, panel]);

  const onTap = (event: MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-t]");
    if (!target || !pageData || !file) {
      setSelection(null);
      return;
    }
    const sentenceId = target.dataset.s!;
    const tokenIndex = Number(target.dataset.t);
    const sentence = pageData.paragraphs.flat().find((s) => s.id === sentenceId);
    const token = sentence?.tokens[tokenIndex];
    const gloss = token?.g ? file.glosses[token.g] : undefined;
    if (!sentence || !token || !gloss) return;
    const surface =
      token.ph === undefined
        ? token.t
        : sentence.tokens.filter((t) => t.ph === token.ph).map((t) => t.t).join(" ");
    setSelection({
      sentenceId,
      tokenIndex,
      ph: token.ph,
      gloss,
      surface,
      sentence: sentenceText(sentence),
      place: placePopover(target.getBoundingClientRect(), window.innerWidth, window.innerHeight),
    });
    if (!settings.hintSeen) updateSettings({ hintSeen: true });
  };

  const goTo = (next: number) => {
    setSelection(null);
    setChosenPage(next);
    window.scrollTo({ top: 0 });
  };

  const onNext = () => {
    if (page === null) return;
    if (page < book.totalPages) {
      goTo(page + 1);
    } else {
      recordProgress(book.slug, { page, totalPages: book.totalPages, finished: true, updatedAt: Date.now() });
      setSelection(null);
      setShowFinish(true);
    }
  };

  const percent = page === null ? 0 : (page / book.totalPages) * 100;
  const circleButton =
    "flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--r-line)] bg-[var(--r-surface)] md:size-[50px]";

  return (
    <div data-theme={settings.theme} className="reader min-h-dvh">
      <header className="sticky top-0 z-20 bg-[var(--r-bg)]">
        <div className="mx-auto flex h-[66px] max-w-[1146px] items-center gap-2 px-3 md:h-[90px] md:gap-2.5 md:px-6">
          <button
            type="button"
            onClick={() => setPanel("chapters")}
            className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-[var(--r-line)] bg-[var(--r-surface)] px-3 md:h-[50px] md:max-w-[490px] md:px-4"
          >
            <MenuIcon className="size-5 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-left text-sm font-medium md:text-base">
              <span className="max-sm:hidden">{book.title}: </span>
              {chapterInfo ? `${chapterInfo.n}-тарау` : ""}
            </span>
            <CaretIcon className="size-5 shrink-0" />
          </button>
          <span className="flex-1 max-md:hidden" />
          <Link
            href="/dictionary"
            aria-label={`Сөздікке: ${bookWordCount} сөз`}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-[var(--r-line)] bg-[var(--r-surface)] px-3 text-sm font-medium"
          >
            <WordsIcon className="size-5" />
            <span className="max-md:hidden">Сөздікке:</span>
            <span className="text-accent">{bookWordCount}<span className="max-md:hidden"> сөз</span></span>
          </Link>
          {file?.original && (
            <button
              type="button"
              onClick={() => setPanel("original")}
              aria-label="Қазақша нұсқа"
              className="flex h-10 shrink-0 items-center rounded-full border border-[var(--r-line)] bg-[var(--r-surface)] px-3 text-sm font-medium"
            >
              <span className="md:hidden">ҚАЗ</span>
              <span className="max-md:hidden">Қазақша нұсқа</span>
            </button>
          )}
          <button type="button" onClick={() => setPanel("settings")} aria-label="Оқу баптаулары" className={`${circleButton} font-medium`}>
            Aa
          </button>
          <Link href="/" aria-label="Кітаптан шығу" className={circleButton}>
            <CloseIcon className="size-5" />
          </Link>
        </div>
        <div className="h-1 bg-[var(--r-line)]">
          <div className="h-full bg-accent transition-[width]" style={{ width: `${percent}%` }} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[680px] px-4 pb-10 pt-6 md:pt-10">
        {showFinish ? (
          <FinishScreen
            book={book}
            wordCount={bookWordCount}
            onRestart={() => {
              setShowFinish(false);
              goTo(1);
            }}
          />
        ) : status === "login" || status === "paywall" ? (
          <Paywall
            book={book}
            chapter={chapterInfo?.n ?? 1}
            needsLogin={status === "login"}
            onUnlocked={() => {
              reloadEntitlements();
              retry();
            }}
          />
        ) : status === "gone" ? (
          <Unavailable />
        ) : status === "error" ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center" role="alert">
            <p className="text-lg font-semibold">Тарау жүктелмеді</p>
            <p className="text-[var(--r-muted)]">Интернетті тексеріп, қайталап көріңіз.</p>
            <button type="button" onClick={retry} className="mt-2 rounded-xl bg-accent px-5 py-3 font-medium text-on-accent">
              Қайталау
            </button>
          </div>
        ) : !isReady || !pageData || !file || !chapterInfo ? (
          <div className="animate-pulse space-y-4 py-4" aria-label="Жүктелуде">
            <div className="h-9 w-2/3 rounded-lg bg-[var(--r-line)]" />
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-5 rounded bg-[var(--r-line)]" />
            ))}
          </div>
        ) : (
          <>
            <article lang="en" style={{ fontFamily: FONT_FAMILY[settings.font], fontSize: settings.fontSize, lineHeight: 1.85 }}>
              {page === chapterInfo.firstPage && (
                <h1 className="mb-[1em] text-[1.6em] leading-tight">
                  Chapter {chapterInfo.n}: {file.title}
                </h1>
              )}
              <PageText page={pageData} selection={selection} savedIds={savedIds} onTap={onTap} />
            </article>

            <footer className="mt-2 grid grid-cols-3 items-center border-t border-[var(--r-line)] pt-6">
              <div>
                {page !== null && page > 1 && (
                  <button
                    type="button"
                    onClick={() => goTo(page - 1)}
                    className="flex h-[50px] items-center gap-1.5 rounded-2xl pr-3 font-medium text-[var(--r-muted)]"
                  >
                    <ArrowLeftIcon className="size-5" />
                    Артқа
                  </button>
                )}
              </div>
              <p className="text-center text-[var(--r-muted)]">
                {page}/{book.totalPages} бет
              </p>
              <button
                type="button"
                onClick={onNext}
                className="flex h-[50px] items-center justify-center gap-1.5 justify-self-end rounded-2xl bg-accent px-5 font-medium text-on-accent"
              >
                {page === book.totalPages ? "Аяқтау" : "Келесі"}
                <ArrowRightIcon className="size-5" />
              </button>
            </footer>
          </>
        )}
      </main>

      {isReady && !showFinish && (
        <>
          <Mascot className="pointer-events-none fixed bottom-8 left-10 hidden size-20 xl:block" />
          {hydrated && !settings.hintSeen && (
            <div className="fixed inset-x-3 top-[76px] z-10 flex md:top-[100px] md:left-auto md:w-72 items-start gap-2 rounded-2xl border border-[var(--r-line)] bg-[var(--r-surface)] p-3 shadow-lg xl:inset-x-auto xl:bottom-28 xl:left-10 xl:top-auto xl:w-64">
              <p className="flex-1 text-sm">Кез келген сөзді басыңыз, аудармасы бірден шығады.</p>
              <button type="button" onClick={() => updateSettings({ hintSeen: true })} aria-label="Жабу" className="-m-1 p-1">
                <CloseIcon className="size-5" />
              </button>
            </div>
          )}
        </>
      )}

      {selection && (
        <WordPopover
          gloss={selection.gloss}
          surface={selection.surface}
          place={selection.place}
          saved={savedIds.has(selection.gloss.id)}
          onClose={closeSelection}
          onSave={() => {
            if (page === null) return;
            saveWord({
              ...selection.gloss,
              slug: book.slug,
              bookTitle: book.title,
              page,
              sentence: selection.sentence,
              savedAt: Date.now(),
            });
          }}
        />
      )}

      {panel === "chapters" && (
        <ChapterMenu
          book={book}
          currentChapter={chapterInfo?.n ?? 1}
          isLocked={isLocked}
          onClose={() => setPanel(null)}
          onPick={(firstPage) => {
            setPanel(null);
            setShowFinish(false);
            goTo(firstPage);
          }}
        />
      )}
      {panel === "settings" && <SettingsPanel settings={settings} onClose={() => setPanel(null)} />}
      {panel === "original" && file?.original && (
        <OriginalPanel
          chapter={file.chapter}
          title={file.title}
          paragraphs={file.original}
          onClose={() => setPanel(null)}
        />
      )}
    </div>
  );
}

export function Unavailable() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center" role="alert">
      <Mascot className="size-24" />
      <p className="text-xl font-semibold">Кітап қолжетімсіз</p>
      <p className="opacity-70">Бұл кітап қазір оқуға ашық емес.</p>
      <Link href="/" className="mt-2 rounded-xl bg-accent px-5 py-3 font-medium text-on-accent">
        Кітапханаға оралу
      </Link>
    </div>
  );
}

function FinishScreen({ book, wordCount, onRestart }: { book: BookInfo; wordCount: number; onRestart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <Mascot className="size-28" />
      <h1 className="text-3xl font-bold">Құттықтаймыз!</h1>
      <p className="text-[var(--r-muted)]">
        Сіз «{book.title}» кітабын оқып бітірдіңіз. Сөздікте осы кітаптан {wordCount} сөз бар.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Link href="/" className="rounded-2xl bg-accent px-5 py-3 font-medium text-on-accent">
          Кітапханаға оралу
        </Link>
        <Link href="/dictionary" className="rounded-2xl border border-[var(--r-line)] px-5 py-3 font-medium">
          Сөздікті ашу
        </Link>
        <button type="button" onClick={onRestart} className="rounded-2xl border border-[var(--r-line)] px-5 py-3 font-medium">
          Басынан оқу
        </button>
      </div>
    </div>
  );
}
