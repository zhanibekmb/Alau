import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "../db";
import { paywallEvents, user } from "../db/schema";
import { createTestDb, resetDb } from "../db/test-db";
import { loadPaywallStats } from "./paywall-stats";

let db: Database;
const NOW = new Date("2026-11-09T12:00:00Z");
const daysAgo = (days: number) => new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000);

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

describe("loadPaywallStats", () => {
  it("splits sign-ups by where the guest pressed the button", async () => {
    const at = daysAgo(1);
    await db.insert(paywallEvents).values([
      { userId: "u1", type: "signup", source: "chapter_end", createdAt: at },
      { userId: "u2", type: "signup", source: "gift_paywall", createdAt: at },
      { userId: "u2", type: "signup", source: null, createdAt: at },
      { userId: "u1", type: "signup", source: "chapter_end", createdAt: daysAgo(10) },
    ]);
    const stats = await loadPaywallStats(db, daysAgo(7));
    expect(stats.signupsBySource).toEqual([
      { source: "chapter_end", count: 1 },
      { source: "gift_paywall", count: 1 },
      { source: "other", count: 0 },
      { source: "unknown", count: 1 },
    ]);
  });

  it("is all zeros with no events", async () => {
    const stats = await loadPaywallStats(db, daysAgo(7));
    expect(stats).toMatchObject({ shown: { people: 0, events: 0 }, chose: { people: 0 }, rate: null, signups: 0, byBook: [] });
    expect(stats.signupsBySource.every((s) => s.count === 0)).toBe(true);
    expect(stats.byPlan.map((p) => p.people)).toEqual([0, 0, 0]);
  });

  it("counts each person once and matches the events", async () => {
    const at = daysAgo(1);
    const bakaly = { work: "secret-of-lake-bakaly", slug: "secret-of-lake-bakaly-b1", chapter: 7, createdAt: at };
    await db.insert(paywallEvents).values([
      // Guest anon-1 saw it twice, then signed up as u1 (events already linked) and bought the book.
      { ...bakaly, userId: "u1", anonId: "anon-1", type: "paywall_shown" },
      { ...bakaly, userId: "u1", anonId: "anon-1", type: "paywall_shown" },
      { userId: "u1", type: "signup", createdAt: at },
      { ...bakaly, userId: "u1", anonId: "anon-1", type: "demo_unlock", plan: "single_book" },
      // Guest anon-2 saw it and left.
      { ...bakaly, anonId: "anon-2", type: "paywall_shown" },
      // u2 saw it on another book and chose Premium in interest mode.
      { work: "w2", slug: "institute-a1", chapter: 18, createdAt: at, userId: "u2", type: "paywall_shown" },
      { work: "w2", slug: "institute-a1", chapter: 18, createdAt: at, userId: "u2", type: "plan_chosen", plan: "premium_monthly" },
      // Older than the window: not counted.
      { ...bakaly, anonId: "anon-3", type: "paywall_shown", createdAt: daysAgo(10) },
    ]);

    const stats = await loadPaywallStats(db, daysAgo(7));
    expect(stats.shown).toEqual({ people: 3, events: 4 });
    expect(stats.chose).toEqual({ people: 2, events: 2 });
    expect(stats.rate).toBeCloseTo(2 / 3);
    expect(stats.signups).toBe(1);
    expect(stats.byPlan).toEqual([
      { plan: "single_book", people: 1 },
      { plan: "premium_monthly", people: 1 },
      { plan: "premium_annual", people: 0 },
    ]);
    expect(stats.byBook).toEqual([
      { slug: "secret-of-lake-bakaly-b1", shown: 2, chose: 1, rate: 0.5 },
      { slug: "institute-a1", shown: 1, chose: 1, rate: 1 },
    ]);

    expect((await loadPaywallStats(db, daysAgo(30))).shown.people).toBe(4);
  });
});
