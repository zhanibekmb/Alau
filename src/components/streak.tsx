"use client";

import { useAppState } from "@/lib/store";
import { streakOf, type Streak } from "@/lib/streak";
import { useNow } from "@/lib/use-now";

// The reading streak in the My books header. The profile shows it as a stat card.

export function useStreak(): Streak | null {
  const { readingDays } = useAppState();
  const now = useNow();
  return now ? streakOf(readingDays, now) : null;
}

export const streakHint = ({ current, readToday }: Streak) =>
  readToday ? "Бүгін оқылды" : current > 0 ? "Бүгін оқып, серияны сақтаңыз" : "Бір бет оқып, серия бастаңыз";

/** "🔥 5 күн". Phone: outlined pill (Figma Mobile); desktop: filled coral pill (Figma Desktop). */
export function StreakChip({ className = "" }: { className?: string }) {
  const streak = useStreak();
  if (!streak) return null;
  return (
    <li
      className={`flex h-10 items-center gap-2 rounded-full border border-line px-3.5 md:border-0 md:bg-[#ff8080] md:text-white ${className}`}
      title={streakHint(streak)}
    >
      <span aria-hidden="true" className={streak.readToday ? "" : "grayscale"}>
        🔥
      </span>
      {streak.current} күн
    </li>
  );
}
