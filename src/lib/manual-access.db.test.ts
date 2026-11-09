import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "../db";
import { entitlements, user } from "../db/schema";
import { createTestDb, resetDb } from "../db/test-db";
import { canReadChapter } from "./access";
import { loadEntitlements } from "./entitlements";
import { findUserByEmail, grantAccess, listManualGrants, listPlanRequests, revokeGrant } from "./manual-access";
import { choosePlan } from "./paywall";

let db: Database;
const NOW = new Date("2026-11-09T12:00:00Z");
const DAY = 24 * 60 * 60 * 1000;
const WORK = "secret-of-lake-bakaly";

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

const canRead = async (at: Date) =>
  canReadChapter({
    paywall: { freeChapters: 6, priceTenge: 490 },
    work: WORK,
    chapter: 7,
    reader: { userId: "u1", entitlements: await loadEntitlements(db, "u1") },
    now: at,
  });

describe("manual access", () => {
  it("finds a reader by email, ignoring case and spaces", async () => {
    expect((await findUserByEmail(db, "  AIKYN@example.kz "))?.id).toBe("u1");
    expect(await findUserByEmail(db, "nobody@example.kz")).toBeNull();
  });

  it("opens a book forever, once", async () => {
    expect(await canRead(NOW)).toBe("payment_required");
    expect(await grantAccess(db, { userId: "u1", kind: "single_book", work: WORK, now: NOW })).toBe("granted");
    expect(await grantAccess(db, { userId: "u1", kind: "single_book", work: WORK, now: NOW })).toBe("already");
    expect(await db.$count(entitlements)).toBe(1);
    expect(await canRead(new Date(NOW.getTime() + 1000 * DAY))).toBe("ok");
  });

  it("gives premium for its full term and extends an active one", async () => {
    expect(await grantAccess(db, { userId: "u1", kind: "premium_monthly", work: null, now: NOW })).toBe("granted");
    const later = new Date(NOW.getTime() + 10 * DAY);
    expect(await grantAccess(db, { userId: "u1", kind: "premium_monthly", work: null, now: later })).toBe("extended");
    const rows = await db.select().from(entitlements);
    const ends = rows.map((r) => r.expiresAt!.getTime()).sort();
    expect(ends).toEqual([NOW.getTime() + 30 * DAY, NOW.getTime() + 60 * DAY]);
    expect(await canRead(new Date(NOW.getTime() + 59 * DAY))).toBe("ok");
    expect(await canRead(new Date(NOW.getTime() + 61 * DAY))).toBe("payment_required");
  });

  it("extends a demo premium too", async () => {
    await choosePlan(db, "u1", { plan: "premium_annual", work: WORK, slug: "s", chapter: 7, anonId: null }, "demo", NOW);
    expect(await grantAccess(db, { userId: "u1", kind: "premium_monthly", work: null, now: NOW })).toBe("extended");
  });

  it("lists hand-given and demo access with the reader's email, and revokes both", async () => {
    await choosePlan(db, "u1", { plan: "single_book", work: "other", slug: "s", chapter: 7, anonId: null }, "demo", NOW);
    await grantAccess(db, { userId: "u1", kind: "single_book", work: WORK, now: NOW });
    const grants = await listManualGrants(db);
    expect(grants.map((g) => g.source).sort()).toEqual(["demo", "manual"]);
    const manual = grants.find((g) => g.source === "manual")!;
    expect(manual).toMatchObject({ email: "aikyn@example.kz", kind: "single_book", work: WORK });

    expect(await revokeGrant(db, manual.id)).toBe(true);
    expect(await canRead(NOW)).toBe("payment_required");
    const [demo] = await db.select().from(entitlements).where(eq(entitlements.source, "demo"));
    expect(await revokeGrant(db, demo.id)).toBe(true);
    expect(await db.$count(entitlements)).toBe(0);
    expect(await revokeGrant(db, demo.id)).toBe(false);
  });
});

describe("tariff requests (PAYMENTS_MODE=transfer)", () => {
  const pick = (plan: "single_book" | "premium_monthly", work = WORK) =>
    choosePlan(db, "u1", { plan, work, slug: "s", chapter: 7, anonId: null }, "transfer", NOW);

  it("records the choice and gives nothing by itself", async () => {
    expect(await pick("premium_monthly")).toEqual({ unlocked: false });
    expect(await db.$count(entitlements)).toBe(0);
    expect(await canRead(NOW)).toBe("payment_required");
  });

  it("lists one row per reader and tariff, marked once access is given", async () => {
    await pick("premium_monthly");
    await pick("premium_monthly", "other-work");
    await pick("single_book");
    let requests = await listPlanRequests(db, NOW);
    expect(requests.map((r) => [r.email, r.plan, r.work, r.granted])).toEqual([
      ["aikyn@example.kz", "single_book", WORK, false],
      ["aikyn@example.kz", "premium_monthly", null, false],
    ]);

    await grantAccess(db, { userId: "u1", kind: "single_book", work: WORK, now: NOW });
    requests = await listPlanRequests(db, NOW);
    expect(requests.find((r) => r.plan === "single_book")?.granted).toBe(true);
    expect(requests.find((r) => r.plan === "premium_monthly")?.granted).toBe(false);

    await grantAccess(db, { userId: "u1", kind: "premium_monthly", work: null, now: NOW });
    expect((await listPlanRequests(db, NOW)).every((r) => r.granted)).toBe(true);
    // After premium runs out the request shows as open again.
    expect((await listPlanRequests(db, new Date(NOW.getTime() + 40 * DAY))).find((r) => r.plan === "premium_monthly")?.granted).toBe(false);
  });
});
