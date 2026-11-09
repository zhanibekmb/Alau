import { describe, expect, it } from "vitest";
import { INTERVAL_DAYS, answer, dueWords, isDue, learnedCount } from "./review";
import type { SavedWord } from "./state";
import { dayKey, lastWeek, streakOf } from "./streak";

const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h);
const days = (...keys: string[]) => Object.fromEntries(keys.map((k) => [k, true as const]));

describe("streak", () => {
  const now = at(2026, 11, 9);

  it("uses the local date", () => {
    expect(dayKey(at(2026, 1, 5, 23))).toBe("2026-01-05");
  });

  it("counts days in a row up to today", () => {
    expect(streakOf(days("2026-11-07", "2026-11-08", "2026-11-09"), now)).toEqual({ current: 3, readToday: true, best: 3 });
  });

  it("keeps yesterday's run alive until today ends", () => {
    expect(streakOf(days("2026-11-07", "2026-11-08"), now)).toEqual({ current: 2, readToday: false, best: 2 });
  });

  it("breaks after a missed day and remembers the best run", () => {
    const s = streakOf(days("2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04", "2026-11-09"), now);
    expect(s).toEqual({ current: 1, readToday: true, best: 4 });
    expect(streakOf(days("2026-11-06"), now).current).toBe(0);
  });

  it("crosses month and year boundaries", () => {
    expect(streakOf(days("2026-12-31", "2027-01-01"), at(2027, 1, 1)).current).toBe(2);
  });

  it("shows the last seven days, today last", () => {
    const week = lastWeek(days("2026-11-08"), now);
    expect(week.map((d) => d.label)).toEqual(["Сс", "Ср", "Бс", "Жм", "Сб", "Жс", "Дс"]);
    expect(week.map((d) => d.read)).toEqual([false, false, false, false, false, true, false]);
    expect(week[6].today).toBe(true);
  });
});

const word = (id: string, savedAt = 0): SavedWord => ({
  id, lemma: id, kk: "", ipa: "", pos: "n", slug: "s", bookTitle: "B", page: 1, sentence: "", savedAt,
});
const DAY = 24 * 60 * 60 * 1000;

describe("review", () => {
  it("moves a known word up a box and brings it back later", () => {
    const first = answer(undefined, true, 0);
    expect(first).toEqual({ box: 1, due: INTERVAL_DAYS[1] * DAY, reviewedAt: 0 });
    const second = answer(first, true, DAY);
    expect(second.box).toBe(2);
    expect(second.due).toBe(DAY + 3 * DAY);
  });

  it("sends a forgotten word back to the start, due now", () => {
    expect(answer({ box: 4, due: 0, reviewedAt: 0 }, false, 500)).toEqual({ box: 0, due: 500, reviewedAt: 500 });
  });

  it("stops at the last box", () => {
    expect(answer({ box: 5, due: 0, reviewedAt: 0 }, true, 0).box).toBe(5);
  });

  it("lists overdue words first, then new ones by newest", () => {
    const words = { a: word("a", 1), b: word("b", 2), c: word("c", 3), d: word("d", 4) };
    const reviews = {
      a: { box: 1, due: 50, reviewedAt: 0 },
      c: { box: 2, due: 10, reviewedAt: 0 },
      d: { box: 3, due: 999, reviewedAt: 0 },
    };
    expect(dueWords(words, reviews, 100).map((w) => w.id)).toEqual(["c", "a", "b"]);
    expect(isDue(reviews.d, 100)).toBe(false);
    expect(learnedCount(words, { ...reviews, b: { box: 4, due: 0, reviewedAt: 0 } })).toBe(1);
  });
});
