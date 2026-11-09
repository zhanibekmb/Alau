// Reading streak ("Үздіксіз оқу") and weekly activity. A day is a local calendar date with
// some reading time; reading at 23:50 and 00:10 counts as two days.

export type ReadingDays = Record<string, number>;

export const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;
/** One reading session tick, and the most one day can hold. */
export const MAX_DAY_SECONDS = 24 * 60 * 60;

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

const isRead = (days: ReadingDays, date: Date) => (days[dayKey(date)] ?? 0) > 0;

function runEndingAt(days: ReadingDays, end: Date): number {
  let count = 0;
  for (let day = end; isRead(days, day); day = shift(day, -1)) count += 1;
  return count;
}

export type Streak = {
  /** Days in a row. Still counts yesterday's run while today is not read yet. */
  current: number;
  readToday: boolean;
  best: number;
};

export function streakOf(days: ReadingDays, now: Date): Streak {
  const readToday = isRead(days, now);
  const current = readToday ? runEndingAt(days, now) : runEndingAt(days, shift(now, -1));
  let best = 0;
  for (const [key, seconds] of Object.entries(days)) {
    if (!DAY_KEY.test(key) || seconds <= 0) continue;
    const [y, m, d] = key.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (isRead(days, shift(date, 1))) continue; // Count each run once, from its last day.
    best = Math.max(best, runEndingAt(days, date));
  }
  return { current, readToday, best: Math.max(best, current) };
}

const WEEKDAYS = ["Жс", "Дс", "Сс", "Ср", "Бс", "Жм", "Сб"];
const WEEKDAY_NAMES = ["Жексенбі", "Дүйсенбі", "Сейсенбі", "Сәрсенбі", "Бейсенбі", "Жұма", "Сенбі"];

export type WeekDay = { key: string; label: string; name: string; minutes: number; today: boolean; future: boolean };

/** This week, Monday to Sunday, with whole minutes read each day. */
export function thisWeek(days: ReadingDays, now: Date): WeekDay[] {
  const monday = shift(now, -((now.getDay() + 6) % 7));
  const todayKey = dayKey(now);
  return Array.from({ length: 7 }, (_, i) => {
    const date = shift(monday, i);
    const key = dayKey(date);
    return {
      key,
      label: WEEKDAYS[date.getDay()],
      name: WEEKDAY_NAMES[date.getDay()],
      minutes: Math.floor((days[key] ?? 0) / 60),
      today: key === todayKey,
      future: key > todayKey,
    };
  });
}

export const minutesToday = (days: ReadingDays, now: Date) => Math.floor((days[dayKey(now)] ?? 0) / 60);

export function totalSeconds(days: ReadingDays): number {
  return Object.values(days).reduce((sum, s) => sum + s, 0);
}

/** "45 мин", "3.5 сағ", "12 сағ". */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} мин`;
  const hours = minutes / 60;
  return `${hours < 10 ? Math.round(hours * 10) / 10 : Math.round(hours)} сағ`;
}
