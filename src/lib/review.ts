import type { Review, SavedWord } from "./state";

// Word review with Leitner boxes. A word you know moves up a box and comes back later;
// a word you forgot goes back to box 0 and comes back in this same session.
//
//   box:      0      1      2      3      4       5
//   back in:  now    1 day  3 days 7 days 14 days 30 days

export const INTERVAL_DAYS = [0, 1, 3, 7, 14, 30] as const;
export const MAX_BOX = INTERVAL_DAYS.length - 1;
/** From this box on a word counts as learned. */
export const LEARNED_BOX = 4;
/** Words per session, so a long list does not turn into a wall. */
export const SESSION_SIZE = 20;

const DAY_MS = 24 * 60 * 60 * 1000;

export function isDue(review: Review | undefined, now: number): boolean {
  return !review || review.due <= now;
}

export function answer(review: Review | undefined, knew: boolean, now: number): Review {
  const box = knew ? Math.min((review?.box ?? 0) + 1, MAX_BOX) : 0;
  return { box, due: now + INTERVAL_DAYS[box] * DAY_MS, reviewedAt: now };
}

/** Words to review now: overdue ones first, then never reviewed, newest saved first among those. */
export function dueWords(words: Record<string, SavedWord>, reviews: Record<string, Review>, now: number): SavedWord[] {
  return Object.values(words)
    .filter((word) => isDue(reviews[word.id], now))
    .sort((a, b) => {
      const ra = reviews[a.id];
      const rb = reviews[b.id];
      if (ra && rb) return ra.due - rb.due;
      if (ra) return -1;
      if (rb) return 1;
      return b.savedAt - a.savedAt;
    });
}

export function learnedCount(words: Record<string, SavedWord>, reviews: Record<string, Review>): number {
  return Object.keys(words).filter((id) => (reviews[id]?.box ?? 0) >= LEARNED_BOX).length;
}
