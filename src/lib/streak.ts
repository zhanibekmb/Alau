// The reading streak ("ударный режим"): days in a row with at least one page read.
// Days are local calendar dates, so reading at 23:50 and 00:10 counts as two days.

export const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;

/** "2026-11-09" in the reader's local time. */
export function dayKey(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

function shift(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function runEndingAt(days: Record<string, true>, end: Date): number {
  let count = 0;
  for (let day = end; days[dayKey(day)]; day = shift(day, -1)) count += 1;
  return count;
}

export type Streak = {
  /** Days in a row. Still counts yesterday's run while today is not read yet. */
  current: number;
  readToday: boolean;
  best: number;
};

export function streakOf(days: Record<string, true>, now: Date): Streak {
  const readToday = Boolean(days[dayKey(now)]);
  const current = readToday ? runEndingAt(days, now) : runEndingAt(days, shift(now, -1));
  let best = 0;
  for (const key of Object.keys(days)) {
    if (!DAY_KEY.test(key)) continue;
    const [y, m, d] = key.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (days[dayKey(shift(date, 1))]) continue; // Count each run once, from its last day.
    best = Math.max(best, runEndingAt(days, date));
  }
  return { current, readToday, best: Math.max(best, current) };
}

const WEEKDAYS = ["Жс", "Дс", "Сс", "Ср", "Бс", "Жм", "Сб"];

/** The last seven days, oldest first, for the week strip. */
export function lastWeek(days: Record<string, true>, now: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = shift(now, i - 6);
    return { key: dayKey(date), label: WEEKDAYS[date.getDay()], read: Boolean(days[dayKey(date)]), today: i === 6 };
  });
}
