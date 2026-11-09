"use client";

import { useAppState } from "@/lib/store";
import { lastWeek, streakOf, type Streak } from "@/lib/streak";
import { useNow } from "@/lib/use-now";
import { CheckIcon } from "./icons";
import { Tooltip } from "./tooltip";

// The reading streak ("ударный режим") on screen: sidebar, profile and My books.

function useStreak(): { streak: Streak; now: Date } | null {
  const { readingDays } = useAppState();
  const now = useNow();
  return now ? { streak: streakOf(readingDays, now), now } : null;
}

function hint({ current, readToday }: Streak): string {
  if (readToday) return "Бүгін оқылды";
  if (current > 0) return "Бүгін оқып, серияны сақтаңыз";
  return "Бір бет оқып, серия бастаңыз";
}

/** Bottom of the desktop sidebar. Folded: the flame and the number only. */
export function StreakWidget() {
  const data = useStreak();
  if (!data) return <div className="h-[60px]" aria-hidden="true" />;
  const { streak } = data;
  return (
    <div className="group relative flex items-center gap-3 rounded-2xl bg-white/70 p-2.5 ring-1 ring-black/5 collapsed:justify-center collapsed:bg-transparent collapsed:p-1 collapsed:ring-0">
      <span
        className={`relative flex size-10 shrink-0 items-center justify-center rounded-xl text-xl ${
          streak.readToday ? "bg-accent-soft" : "bg-chip grayscale"
        }`}
        aria-hidden="true"
      >
        🔥
        <span className="absolute -right-1.5 -top-1.5 hidden min-w-5 rounded-full bg-ink px-1 text-center text-[11px] font-bold leading-5 text-white collapsed:block">
          {streak.current}
        </span>
      </span>
      <span className="min-w-0 collapsed:sr-only">
        <span className="block font-semibold">{streak.current} күн қатарынан</span>
        <span className={`block truncate text-xs ${streak.readToday ? "text-emerald-700" : "text-muted"}`}>
          {hint(streak)}
        </span>
      </span>
      <Tooltip>
        {streak.current} күн · {hint(streak)}
      </Tooltip>
    </div>
  );
}

/** "🔥 5 күн" pill, as on the phone My books screen. */
export function StreakChip({ className = "" }: { className?: string }) {
  const data = useStreak();
  if (!data) return null;
  return (
    <li
      className={`flex h-10 items-center gap-2 rounded-full border border-line px-3.5 ${className}`}
      title={hint(data.streak)}
    >
      <span aria-hidden="true" className={data.streak.readToday ? "" : "grayscale"}>
        🔥
      </span>
      {data.streak.current} күн
    </li>
  );
}

/** Profile: the streak with the last seven days. */
export function StreakCard() {
  const data = useStreak();
  const { readingDays } = useAppState();
  if (!data) return <section className="mt-4 h-[178px] rounded-3xl bg-sidebar" aria-hidden="true" />;
  const { streak, now } = data;
  const week = lastWeek(readingDays, now);

  return (
    <section className="mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-accent-soft via-white to-white p-5 ring-1 ring-accent/25" aria-labelledby="streak-title">
      <div className="flex items-center gap-4">
        <span
          className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm ${
            streak.readToday ? "" : "grayscale"
          }`}
          aria-hidden="true"
        >
          🔥
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="streak-title" className="text-sm font-semibold text-muted">
            Оқу сериясы
          </h2>
          <p className="text-2xl font-bold">{streak.current} күн қатарынан</p>
          <p className={`text-sm ${streak.readToday ? "text-emerald-700" : "text-muted"}`}>{hint(streak)}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-muted">Үздік</p>
          <p className="text-lg font-bold">{streak.best} күн</p>
        </div>
      </div>

      <ol className="mt-5 grid grid-cols-7 gap-1.5" aria-label="Соңғы 7 күн">
        {week.map((day) => (
          <li key={day.key} className="flex flex-col items-center gap-1.5">
            <span
              className={`flex size-9 items-center justify-center rounded-full text-sm transition-colors ${
                day.read
                  ? "bg-accent text-white shadow-sm shadow-accent/40"
                  : day.today
                    ? "border-2 border-dashed border-accent/60 bg-white"
                    : "bg-chip"
              }`}
            >
              {day.read ? <CheckIcon className="size-4" strokeWidth={2.5} /> : null}
              <span className="sr-only">{day.read ? "оқылды" : "оқылмады"}</span>
            </span>
            <span className={`text-xs ${day.today ? "font-semibold text-ink" : "text-muted"}`}>{day.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
