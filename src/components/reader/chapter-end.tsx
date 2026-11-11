"use client";

import Link from "next/link";
import { signUpHref } from "@/lib/guest-nudge";
import { useAppState } from "@/lib/store";
import { minutesToday } from "@/lib/streak";
import type { BookInfo } from "@/lib/types";
import { Mascot } from "../brand";
import { GoogleSignUp } from "../google-sign-up";
import { ArrowRightIcon } from "../icons";
import { useStreak } from "../streak";

// "Тарау аяқталды!": shown to a guest who has just turned the last page of a free chapter
// (design "Регистрация как награда, а не стена", step 2). Signing up keeps what they have just
// earned; "Келесі тарау" goes on without it, so saying no costs nothing.

const SHOWN_KEY = (slug: string) => `alau-chapter-end:${slug}`;

/** True when this chapter's screen was not shown yet (the highest chapter shown is stored per book). */
export function chapterEndDue(slug: string, chapter: number): boolean {
  try {
    const shown = Number(window.localStorage.getItem(SHOWN_KEY(slug)) ?? 0);
    return !(Number.isFinite(shown) && chapter <= shown);
  } catch {
    return true; // Storage blocked: showing it again is better than never.
  }
}

export function markChapterEndShown(slug: string, chapter: number): void {
  try {
    window.localStorage.setItem(SHOWN_KEY(slug), String(chapter));
  } catch {
    // Nothing to remember it in.
  }
}

export function ChapterEnd({
  book,
  chapter,
  googleEnabled,
  onNext,
}: {
  book: BookInfo;
  chapter: number;
  googleEnabled: boolean;
  onNext: () => void;
}) {
  const { words, readingDays } = useAppState();
  const streak = useStreak();
  const nextChapter = book.chapters.find((c) => c.n === chapter + 1);
  const returnTo = `/read/${book.slug}?page=${nextChapter?.firstPage ?? 1}`;

  const savedHere = Object.values(words).filter((w) => w.slug === book.slug).length;
  const minutes = minutesToday(readingDays, new Date());
  type Stat = { value: string; label: string; show: boolean };
  const stats = ([
    { value: String(savedHere), label: "сөз сақталды", show: savedHere > 0 },
    { value: String(minutes), label: "минут бүгін", show: minutes > 0 },
    { value: `🔥 ${streak?.current ?? 0}`, label: "күн қатарынан", show: (streak?.current ?? 0) > 0 },
  ] satisfies Stat[]).filter((s) => s.show);

  return (
    <section className="flex flex-col items-center py-8 text-center md:py-12" aria-labelledby="chapter-end-title">
      <Mascot pose="level-up" className="size-28 animate-pop" />
      <h2 id="chapter-end-title" className="mt-3 text-3xl font-bold">
        🎉 {chapter}-тарау аяқталды!
      </h2>

      {stats.length > 0 && (
        <dl className="mt-5 flex flex-wrap justify-center gap-3">
          {stats.map(({ value, label }) => (
            <div key={label} className="min-w-24 rounded-2xl border border-[var(--r-line)] bg-[var(--r-panel)] px-4 py-3">
              <dt className="sr-only">{label}</dt>
              <dd className="text-2xl font-bold">{value}</dd>
              <dd className="text-sm text-[var(--r-muted)]">{label}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-5 max-w-sm text-[var(--r-muted)]">
        Бұл нәтиже әзірге тек осы браузерде. Сақтап қойсаңыз, телефонда да, компьютерде де жалғастырасыз.
      </p>

      <div className="mt-6 flex w-full max-w-sm flex-col gap-3">
        <GoogleSignUp
          next={returnTo}
          source="chapter_end"
          label={googleEnabled ? "Google арқылы сақтау" : "Тегін тіркеліп, сақтау"}
          googleEnabled={googleEnabled}
          className="bg-accent text-on-accent shadow-md shadow-accent/30"
        />
        {googleEnabled && (
          <Link href={signUpHref(returnTo, "chapter_end")} className="text-sm font-medium text-amber-700 underline underline-offset-2">
            Email арқылы
          </Link>
        )}
        <button
          type="button"
          onClick={onNext}
          className="mt-2 flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--r-line)] font-medium"
        >
          {nextChapter ? "Келесі тарау" : "Жалғастыру"}
          <ArrowRightIcon className="size-5" />
        </button>
      </div>
    </section>
  );
}
