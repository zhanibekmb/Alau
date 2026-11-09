import { describe, expect, it } from "vitest";
import { INITIAL_STATE, type SavedWord } from "./state";
import { MAX_SYNC_OPS, MAX_SYNC_WORDS, applyServerData, foldOps, opsFromState, parseSyncRequest, type SyncOp } from "./sync";

const word = (id: string, extra: Partial<SavedWord> = {}): SavedWord => ({
  id,
  lemma: id,
  kk: "аударма",
  ipa: "",
  pos: "n",
  slug: "the-little-foal",
  bookTitle: "The Little Foal",
  page: 1,
  sentence: "A sentence.",
  savedAt: 1000,
  ...extra,
});
const progress = (page: number, updatedAt = 1000, finished = false) => ({ page, totalPages: 10, finished, updatedAt });

describe("parseSyncRequest", () => {
  it("accepts an empty queue", () => {
    expect(parseSyncRequest({ ops: [] })).toEqual({ ok: true, value: { ops: [], anonId: null, pull: false }, dropped: 0 });
  });

  it("refuses a body that is not a queue", () => {
    expect(parseSyncRequest(null).ok).toBe(false);
    expect(parseSyncRequest({ ops: "x" }).ok).toBe(false);
    expect(parseSyncRequest({ ops: [], anonId: 5 }).ok).toBe(false);
  });

  it("drops damaged entries and keeps the good ones", () => {
    const parsed = parseSyncRequest({
      ops: [
        { type: "progress", slug: "the-little-foal", progress: progress(3) },
        { type: "progress", slug: "../etc", progress: progress(3) },
        { type: "progress", slug: "ok", progress: { page: 12, totalPages: 10, finished: false, updatedAt: 1 } },
        { type: "word", word: { ...word("a"), page: "one" } },
        { type: "word", word: word("b") },
        { type: "unword", id: "" },
        { type: "delete-everything" },
        "garbage",
      ],
      anonId: "anon-1",
      pull: true,
    });
    expect(parsed.ok && parsed.value.ops.map((op) => op.type)).toEqual(["progress", "word"]);
    expect(parsed.ok && parsed.dropped).toBe(6);
    expect(parsed.ok && parsed.value.anonId).toBe("anon-1");
  });

  it("refuses more than the word and op limits", () => {
    const words = Array.from({ length: MAX_SYNC_WORDS + 1 }, (_, i) => ({ type: "word", word: word(`w${i}`) }));
    expect(parseSyncRequest({ ops: words })).toEqual({ ok: false, error: "too many words" });
    const ops = Array.from({ length: MAX_SYNC_OPS + 1 }, () => ({ type: "unword", id: "x" }));
    expect(parseSyncRequest({ ops })).toEqual({ ok: false, error: "too many changes" });
  });
});

describe("foldOps", () => {
  it("keeps the furthest page and the first copy of a word", () => {
    const folded = foldOps([
      { type: "progress", slug: "s", progress: progress(5, 2000) },
      { type: "progress", slug: "s", progress: progress(3, 3000) },
      { type: "word", word: word("a", { page: 1 }) },
      { type: "word", word: word("a", { page: 9 }) },
    ]);
    expect(folded.progress.s).toEqual(progress(5, 3000));
    expect(folded.words.a?.page).toBe(1);
  });

  it("lets the last op win for one word", () => {
    expect(foldOps([{ type: "word", word: word("a") }, { type: "unword", id: "a" }]).words.a).toBeNull();
    expect(foldOps([{ type: "unword", id: "a" }, { type: "word", word: word("a") }]).words.a?.id).toBe("a");
  });
});

describe("opsFromState", () => {
  it("turns a guest's data into ops and nothing else", () => {
    const review = { box: 2, due: 5, reviewedAt: 4 };
    const ops = opsFromState({
      progress: { s: progress(2) },
      words: { a: word("a") },
      readingDays: { "2026-11-09": true },
      reviews: { a: review, gone: review },
    });
    expect(ops).toEqual([
      { type: "progress", slug: "s", progress: progress(2) },
      { type: "word", word: word("a") },
      { type: "day", day: "2026-11-09" },
      { type: "review", id: "a", review },
    ]);
    expect(opsFromState({ progress: {}, words: {}, readingDays: {}, reviews: {} })).toEqual([]);
  });
});

describe("applyServerData", () => {
  const local = { ...INITIAL_STATE, progress: { s: progress(7) }, words: { old: word("old") } };

  it("takes the server's words and never moves progress back", () => {
    const next = applyServerData(
      local,
      { progress: { s: progress(4), t: progress(2) }, words: { a: word("a") }, readingDays: {}, reviews: {} },
      [],
    );
    expect(next.progress).toEqual({ s: progress(7), t: progress(2) });
    expect(Object.keys(next.words)).toEqual(["a"]);
    expect(next.settings).toBe(local.settings);
  });

  it("keeps changes that are still waiting to be sent", () => {
    const pending: SyncOp[] = [
      { type: "word", word: word("offline") },
      { type: "unword", id: "a" },
      { type: "progress", slug: "s", progress: progress(9) },
    ];
    const next = applyServerData(local, { progress: {}, words: { a: word("a") }, readingDays: {}, reviews: {} }, pending);
    expect(Object.keys(next.words)).toEqual(["offline"]);
    expect(next.progress.s.page).toBe(9);
  });
});

describe("streak days and reviews in the sync", () => {
  it("accepts a day and a review, refuses bad ones", () => {
    const parsed = parseSyncRequest({
      ops: [
        { type: "day", day: "2026-11-09" },
        { type: "day", day: "9 Nov" },
        { type: "review", id: "a", review: { box: 3, due: 10, reviewedAt: 9 } },
        { type: "review", id: "a", review: { box: 9, due: 10, reviewedAt: 9 } },
      ],
    });
    expect(parsed.ok && parsed.value.ops.map((op) => op.type)).toEqual(["day", "review"]);
  });

  it("keeps the later review and unions reading days", () => {
    const local = { ...INITIAL_STATE, words: { a: word("a") }, readingDays: { "2026-11-01": true as const } };
    const server = {
      progress: {},
      words: { a: word("a"), b: word("b") },
      readingDays: { "2026-11-02": true as const },
      reviews: { a: { box: 1, due: 1, reviewedAt: 100 }, b: { box: 2, due: 1, reviewedAt: 100 } },
    };
    const next = applyServerData(local, server, [
      { type: "review", id: "a", review: { box: 3, due: 9, reviewedAt: 200 } },
      { type: "review", id: "b", review: { box: 0, due: 9, reviewedAt: 50 } },
      { type: "day", day: "2026-11-03" },
    ]);
    expect(next.reviews.a.box).toBe(3);
    expect(next.reviews.b.box).toBe(2);
    expect(Object.keys(next.readingDays).sort()).toEqual(["2026-11-01", "2026-11-02", "2026-11-03"]);
  });

  it("drops a removed word's review", () => {
    const folded = foldOps([
      { type: "review", id: "a", review: { box: 1, due: 1, reviewedAt: 1 } },
      { type: "unword", id: "a" },
    ]);
    expect(folded.reviews).toEqual({});
  });
});
