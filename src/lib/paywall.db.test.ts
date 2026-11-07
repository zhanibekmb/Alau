import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "../db";
import { entitlements, paywallEvents, user } from "../db/schema";
import { createTestDb, resetDb } from "../db/test-db";
import type { EntitlementKind } from "./access";
import { choosePlan, recordPaywallShown } from "./paywall";

let db: Database;
const NOW = new Date("2026-11-08T12:00:00Z");
const choice = (plan: EntitlementKind) => ({
  plan,
  work: "secret-of-lake-bakaly",
  slug: "secret-of-lake-bakaly-b1",
  chapter: 7,
  anonId: "anon-1",
});

beforeAll(() => {
  db = createTestDb();
});
beforeEach(async () => {
  await resetDb(db);
  await db.insert(user).values({ id: "u1", name: "Aikyn", email: "aikyn@example.kz" });
});
afterAll(async () => {
  await db.$client.end();
});

describe("interest mode (public site)", () => {
  it("records the choice and grants nothing", async () => {
    expect(await choosePlan(db, "u1", choice("premium_monthly"), "interest", NOW)).toEqual({ unlocked: false });
    expect(await db.$count(entitlements)).toBe(0);
    const [event] = await db.select().from(paywallEvents);
    expect(event).toMatchObject({ type: "plan_chosen", plan: "premium_monthly", userId: "u1", anonId: "anon-1", chapter: 7 });
  });
});

describe("demo mode (your computer)", () => {
  it("grants the book forever and records one unlock", async () => {
    expect(await choosePlan(db, "u1", choice("single_book"), "demo", NOW)).toEqual({ unlocked: true });
    const [row] = await db.select().from(entitlements);
    expect(row).toMatchObject({ kind: "single_book", work: "secret-of-lake-bakaly", source: "demo", expiresAt: null });
    expect(await db.$count(paywallEvents)).toBe(1);
  });

  it("grants premium for exactly 30 days", async () => {
    await choosePlan(db, "u1", choice("premium_monthly"), "demo", NOW);
    const [row] = await db.select().from(entitlements);
    expect(row.work).toBeNull();
    expect(row.expiresAt?.toISOString()).toBe("2026-12-08T12:00:00.000Z");
  });

  it("keeps one row when the same book is bought twice", async () => {
    await choosePlan(db, "u1", choice("single_book"), "demo", NOW);
    expect(await choosePlan(db, "u1", choice("single_book"), "demo", NOW)).toEqual({ unlocked: true });
    expect(await db.$count(entitlements)).toBe(1);
    expect(await db.$count(paywallEvents)).toBe(1);
  });

  it("keeps one row for a double tap that arrives at the same moment", async () => {
    await Promise.all([
      choosePlan(db, "u1", choice("premium_annual"), "demo", NOW),
      choosePlan(db, "u1", choice("premium_annual"), "demo", NOW),
      choosePlan(db, "u1", choice("premium_annual"), "demo", NOW),
    ]);
    expect(await db.$count(entitlements)).toBe(1);
  });

  it("does not stack a second premium while one is active, but renews after it ends", async () => {
    await choosePlan(db, "u1", choice("premium_monthly"), "demo", NOW);
    await choosePlan(db, "u1", choice("premium_annual"), "demo", new Date("2026-11-20T00:00:00Z"));
    expect(await db.$count(entitlements)).toBe(1);
    await choosePlan(db, "u1", choice("premium_monthly"), "demo", new Date("2026-12-08T12:00:00Z"));
    expect(await db.$count(entitlements)).toBe(2);
  });
});

describe("recordPaywallShown", () => {
  it("counts a guest by anonId", async () => {
    await recordPaywallShown(db, null, { work: "secret-of-lake-bakaly", slug: "secret-of-lake-bakaly-a2", chapter: 7, anonId: "anon-9" }, NOW);
    const [event] = await db.select().from(paywallEvents);
    expect(event).toMatchObject({ type: "paywall_shown", userId: null, anonId: "anon-9", slug: "secret-of-lake-bakaly-a2" });
  });
});
