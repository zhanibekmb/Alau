import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "../db";
import { paywallEvents, user } from "../db/schema";
import { createTestDb, resetDb } from "../db/test-db";
import { loadReaderData, syncReaderData } from "./reader-data";
import type { SavedWord } from "./state";
import type { SyncOp } from "./sync";

let db: Database;

const word = (id: string, extra: Partial<SavedWord> = {}): SavedWord => ({
  id,
  lemma: id,
  kk: "аударма",
  ipa: "/x/",
  pos: "n",
  slug: "the-little-foal",
  bookTitle: "The Little Foal",
  page: 2,
  sentence: "Dana has a foal.",
  savedAt: Date.UTC(2026, 10, 9),
  ...extra,
});
const progress = (page: number, updatedAt = Date.UTC(2026, 10, 9), finished = false) => ({ page, totalPages: 10, finished, updatedAt });
const sync = (userId: string, ops: SyncOp[], extra: { anonId?: string; pull?: boolean } = {}) =>
  syncReaderData(db, userId, { ops, anonId: extra.anonId ?? null, pull: extra.pull ?? true });

beforeAll(() => {
  db = createTestDb();
});
beforeEach(async () => {
  await resetDb(db);
  await db.insert(user).values([
    { id: "u1", name: "Aikyn", email: "aikyn@example.kz" },
    { id: "u2", name: "Dana", email: "dana@example.kz" },
  ]);
});
afterAll(async () => {
  await db.$client.end();
});

describe("guest import at the first sign-in", () => {
  it("copies the guest's progress and words into the account", async () => {
    const data = await sync("u1", [
      { type: "progress", slug: "the-little-foal", progress: progress(3) },
      { type: "word", word: word("foal") },
    ]);
    expect(data).toEqual({
      progress: { "the-little-foal": progress(3) },
      words: { foal: word("foal") },
      readingDays: {},
      reviews: {},
    });
  });

  it("gives the same result when the same import arrives twice", async () => {
    const ops: SyncOp[] = [{ type: "progress", slug: "s", progress: progress(3) }, { type: "word", word: word("a") }];
    const first = await sync("u1", ops);
    expect(await sync("u1", ops)).toEqual(first);
  });

  it("merges with data from another device: furthest page, union of words", async () => {
    await sync("u1", [{ type: "progress", slug: "s", progress: progress(6, 1000) }, { type: "word", word: word("a", { page: 1 }) }]);
    const data = await sync("u1", [
      { type: "progress", slug: "s", progress: progress(2, 5000, true) },
      { type: "word", word: word("a", { page: 9 }) },
      { type: "word", word: word("b") },
    ]);
    expect(data?.progress.s).toEqual(progress(6, 5000, true));
    expect(data?.words.a.page).toBe(1);
    expect(Object.keys(data?.words ?? {}).sort()).toEqual(["a", "b"]);
  });

  it("handles an empty guest", async () => {
    expect(await sync("u1", [])).toEqual({ progress: {}, words: {}, readingDays: {}, reviews: {} });
  });
});

describe("changes after sign-in", () => {
  it("removes a word", async () => {
    await sync("u1", [{ type: "word", word: word("a") }, { type: "word", word: word("b") }]);
    const data = await sync("u1", [{ type: "unword", id: "a" }]);
    expect(Object.keys(data?.words ?? {})).toEqual(["b"]);
  });

  it("answers nothing when the browser does not ask for data", async () => {
    expect(await sync("u1", [{ type: "word", word: word("a") }], { pull: false })).toBeNull();
    expect(Object.keys((await loadReaderData(db, "u1")).words)).toEqual(["a"]);
  });

  it("keeps each reader's data apart", async () => {
    await sync("u1", [{ type: "word", word: word("a") }, { type: "progress", slug: "s", progress: progress(4) }]);
    await sync("u2", [{ type: "unword", id: "a" }]);
    expect(await loadReaderData(db, "u2")).toEqual({ progress: {}, words: {}, readingDays: {}, reviews: {} });
    expect(Object.keys((await loadReaderData(db, "u1")).words)).toEqual(["a"]);
  });

  it("keeps the furthest page when two tabs sync at the same moment", async () => {
    await Promise.all([
      sync("u1", [{ type: "progress", slug: "s", progress: progress(4) }]),
      sync("u1", [{ type: "progress", slug: "s", progress: progress(8) }]),
      sync("u1", [{ type: "progress", slug: "s", progress: progress(6) }]),
    ]);
    expect((await loadReaderData(db, "u1")).progress.s.page).toBe(8);
  });
});

describe("anon id (E1B)", () => {
  it("links the guest's earlier paywall events to the account, and no one else's", async () => {
    await db.insert(paywallEvents).values([
      { anonId: "anon-1", type: "paywall_shown", slug: "s", chapter: 7 },
      { anonId: "anon-1", type: "paywall_shown", slug: "s", chapter: 7 },
      { anonId: "anon-2", type: "paywall_shown", slug: "s", chapter: 7 },
      { anonId: "anon-1", userId: "u2", type: "plan_chosen", plan: "single_book" },
    ]);
    await sync("u1", [], { anonId: "anon-1" });
    const rows = await db.select().from(paywallEvents);
    const owners = rows.map((r) => `${r.anonId}:${r.userId}`).sort();
    expect(owners).toEqual(["anon-1:u1", "anon-1:u1", "anon-1:u2", "anon-2:null"]);
  });
});

describe("streak days and word reviews", () => {
  it("stores reading days once and keeps the latest review", async () => {
    await sync("u1", [
      { type: "word", word: word("a") },
      { type: "review", id: "a", review: { box: 2, due: 3000, reviewedAt: 2000 } },
      { type: "day", day: "2026-11-08" },
      { type: "day", day: "2026-11-09" },
    ]);
    const data = await sync("u1", [
      { type: "day", day: "2026-11-09" },
      // An older answer from another device does not overwrite the newer one.
      { type: "review", id: "a", review: { box: 0, due: 1000, reviewedAt: 1000 } },
    ]);
    expect(Object.keys(data?.readingDays ?? {}).sort()).toEqual(["2026-11-08", "2026-11-09"]);
    expect(data?.reviews.a).toEqual({ box: 2, due: 3000, reviewedAt: 2000 });
  });

  it("ignores a review for a word the reader does not have", async () => {
    const data = await sync("u1", [{ type: "review", id: "ghost", review: { box: 1, due: 1, reviewedAt: 1 } }]);
    expect(data?.reviews).toEqual({});
  });
});
