import { addWord, mergeProgress, type AppState, type Progress, type Review, type SavedWord } from "./state";
import { MAX_BOX } from "./review";
import { DAY_KEY, MAX_DAY_SECONDS } from "./streak";
import { parseSignupSource, type SignupSource } from "./signup-source";

// Reader data sync between the browser and the server (docs/paywall-plan.md, E2A and E2B).
// Pure rules shared by both sides. The browser queues every change as an op and sends the
// queue to POST /api/me/sync; the server applies the ops with the same merge rules the
// browser uses (mergeProgress, addWord), so both sides agree on the result.
//
//   guest data ──first sign-in──▶ opsFromState ─┐
//   recordProgress / saveWord / removeWord ──▶ outbox ─┴─▶ POST /api/me/sync ─▶ server tables
//                                                                     │ pull: true
//   local copy ◀── applyServerData (server words + still-queued ops) ◀┘

export type SyncOp =
  | { type: "progress"; slug: string; progress: Progress }
  | { type: "word"; word: SavedWord }
  | { type: "unword"; id: string }
  /** Seconds read on a local date so far (the streak and the weekly chart). The larger total wins. */
  | { type: "day"; day: string; seconds: number }
  | { type: "review"; id: string; review: Review };

/** anonId is sent once, at the first sign-in on this browser, to link the guest's paywall events (E1B). */
export type SyncRequest = {
  ops: SyncOp[];
  anonId: string | null;
  /** Where the guest pressed sign-up; sent with the first sync of an account on a browser. */
  signupSource: SignupSource | null;
  pull: boolean;
};
export type ReaderData = Pick<AppState, "progress" | "words" | "readingDays" | "reviews">;

/** Plan, "Безопасность": a guest import is capped at 5 000 words. */
export const MAX_SYNC_WORDS = 5000;
export const MAX_SYNC_OPS = 6000;
export const MAX_SYNC_BYTES = 3_000_000;

const SLUG = /^[a-z0-9-]{1,100}$/;
const MAX_ANON_ID = 100;

const isInt = (value: unknown, min: number, max: number): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
const isTime = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0;
const isText = (value: unknown, max: number): value is string => typeof value === "string" && value.length <= max;

function parseProgress(value: unknown): Progress | null {
  if (!value || typeof value !== "object") return null;
  const { page, totalPages, finished, updatedAt } = value as Record<string, unknown>;
  if (!isInt(totalPages, 1, 100_000) || !isInt(page, 1, totalPages) || typeof finished !== "boolean" || !isTime(updatedAt)) {
    return null;
  }
  return { page, totalPages, finished, updatedAt };
}

function parseWord(value: unknown): SavedWord | null {
  if (!value || typeof value !== "object") return null;
  const w = value as Record<string, unknown>;
  if (
    !isText(w.id, 200) || w.id.length === 0 ||
    !isText(w.lemma, 300) || !isText(w.kk, 300) || !isText(w.ipa, 300) || !isText(w.pos, 50) ||
    typeof w.slug !== "string" || !SLUG.test(w.slug) || !isText(w.bookTitle, 300) ||
    !isInt(w.page, 1, 100_000) || !isText(w.sentence, 2000) || !isTime(w.savedAt)
  ) {
    return null;
  }
  return {
    id: w.id, lemma: w.lemma, kk: w.kk, ipa: w.ipa, pos: w.pos, slug: w.slug,
    bookTitle: w.bookTitle, page: w.page, sentence: w.sentence, savedAt: w.savedAt,
  };
}

function parseReview(value: unknown): Review | null {
  if (!value || typeof value !== "object") return null;
  const { box, due, reviewedAt } = value as Record<string, unknown>;
  if (!isInt(box, 0, MAX_BOX) || !isTime(due) || !isTime(reviewedAt)) return null;
  return { box, due, reviewedAt };
}

function parseOp(value: unknown): SyncOp | null {
  if (!value || typeof value !== "object") return null;
  const op = value as Record<string, unknown>;
  if (op.type === "progress" && typeof op.slug === "string" && SLUG.test(op.slug)) {
    const progress = parseProgress(op.progress);
    return progress && { type: "progress", slug: op.slug, progress };
  }
  if (op.type === "word") {
    const word = parseWord(op.word);
    return word && { type: "word", word };
  }
  if (op.type === "unword" && isText(op.id, 200) && op.id.length > 0) return { type: "unword", id: op.id };
  if (op.type === "day" && typeof op.day === "string" && DAY_KEY.test(op.day) && isInt(op.seconds, 0, MAX_DAY_SECONDS)) {
    return { type: "day", day: op.day, seconds: op.seconds };
  }
  if (op.type === "review" && isText(op.id, 200) && op.id.length > 0) {
    const review = parseReview(op.review);
    return review && { type: "review", id: op.id, review };
  }
  return null;
}

export type Parsed = { ok: true; value: SyncRequest; dropped: number } | { ok: false; error: string };

/**
 * Damaged single entries (an old browser, a hand-edited localStorage) are dropped, so one bad
 * word never blocks the rest. Only a request that is too big as a whole is refused.
 */
export function parseSyncRequest(body: unknown): Parsed {
  if (!body || typeof body !== "object") return { ok: false, error: "body must be an object" };
  const { ops, anonId, pull, signupSource } = body as Record<string, unknown>;
  if (!Array.isArray(ops)) return { ok: false, error: "ops must be a list" };
  if (ops.length > MAX_SYNC_OPS) return { ok: false, error: "too many changes" };
  if (anonId !== undefined && anonId !== null && (!isText(anonId, MAX_ANON_ID) || anonId.length === 0)) {
    return { ok: false, error: "anonId is invalid" };
  }
  const parsed = ops.map(parseOp).filter((op): op is SyncOp => op !== null);
  if (parsed.filter((op) => op.type === "word").length > MAX_SYNC_WORDS) return { ok: false, error: "too many words" };
  return {
    ok: true,
    value: {
      ops: parsed,
      anonId: typeof anonId === "string" ? anonId : null,
      // An unknown value is ignored rather than refused: the reader's data still syncs.
      signupSource: parseSignupSource(signupSource),
      pull: pull === true,
    },
    dropped: ops.length - parsed.length,
  };
}

/** The guest's whole local copy as ops, for the first sign-in (plan decision D7). */
export function opsFromState(data: ReaderData): SyncOp[] {
  return [
    ...Object.entries(data.progress).map(([slug, progress]): SyncOp => ({ type: "progress", slug, progress })),
    ...Object.values(data.words).map((word): SyncOp => ({ type: "word", word })),
    ...Object.entries(data.readingDays).map(([day, seconds]): SyncOp => ({ type: "day", day, seconds })),
    ...Object.entries(data.reviews)
      .filter(([id]) => data.words[id])
      .map(([id, review]): SyncOp => ({ type: "review", id, review })),
  ];
}

/**
 * What a list of ops adds up to. Progress per book goes through mergeProgress; for a word the
 * last op wins (saved, then removed = removed), and saving twice keeps the first copy (addWord).
 */
export type Folded = {
  progress: Record<string, Progress>;
  words: Record<string, SavedWord | null>;
  days: Record<string, number>;
  /** The latest review per word (by reviewedAt). */
  reviews: Record<string, Review>;
};

export function laterReview(a: Review | undefined, b: Review): Review {
  return a && a.reviewedAt >= b.reviewedAt ? a : b;
}

export function foldOps(ops: SyncOp[]): Folded {
  const progress: Record<string, Progress> = {};
  const words: Record<string, SavedWord | null> = {};
  const days: Record<string, number> = {};
  const reviews: Record<string, Review> = {};
  for (const op of ops) {
    if (op.type === "progress") {
      progress[op.slug] = mergeProgress(progress[op.slug], op.progress);
    } else if (op.type === "word") {
      const current = words[op.word.id];
      words[op.word.id] = current ? current : op.word;
    } else if (op.type === "unword") {
      words[op.id] = null;
      delete reviews[op.id];
    } else if (op.type === "day") {
      days[op.day] = Math.max(days[op.day] ?? 0, op.seconds);
    } else {
      reviews[op.id] = laterReview(reviews[op.id], op.review);
    }
  }
  return { progress, words, days, reviews };
}

/**
 * The browser's copy after a pull. The server is the source of truth (E2B): its words replace
 * the local list. Progress never moves back, so it is merged. Ops still waiting in the outbox
 * (made while the request was in flight, or offline) are laid on top so nothing is lost.
 */
export function applyServerData(local: AppState, server: ReaderData, pending: SyncOp[]): AppState {
  const progress = { ...local.progress };
  for (const [slug, p] of Object.entries(server.progress)) progress[slug] = mergeProgress(progress[slug], p);

  let words = { ...server.words };
  const reviews = { ...server.reviews };
  // Reading time only grows, so for each day the largest total from any side wins.
  const readingDays = { ...local.readingDays };
  const queued = foldOps(pending);
  for (const source of [server.readingDays, queued.days]) {
    for (const [day, seconds] of Object.entries(source)) readingDays[day] = Math.max(readingDays[day] ?? 0, seconds);
  }
  for (const [id, review] of Object.entries(queued.reviews)) reviews[id] = laterReview(reviews[id], review);
  for (const [slug, p] of Object.entries(queued.progress)) progress[slug] = mergeProgress(progress[slug], p);
  for (const [id, word] of Object.entries(queued.words)) {
    if (word) {
      words = addWord(words, word);
    } else {
      delete words[id];
      delete reviews[id];
    }
  }
  for (const id of Object.keys(reviews)) if (!words[id]) delete reviews[id];
  return { ...local, progress, words, readingDays, reviews };
}
