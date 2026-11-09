import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "../db";
import { entitlements, user } from "../db/schema";
import { createTestDb, resetDb } from "../db/test-db";
import { canReadChapter } from "./access";
import { loadEntitlements } from "./entitlements";
import { PAGE_SIZE, findUserByEmail, grantAccess, listManualGrants, listPlanRequests, listReaders, revokeGrant } from "./manual-access";
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
    const grants = (await listManualGrants(db, { now: NOW })).rows;
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
    let requests = (await listPlanRequests(db, { now: NOW })).rows;
    expect(requests.map((r) => [r.email, r.plan, r.work, r.granted])).toEqual([
      ["aikyn@example.kz", "single_book", WORK, false],
      ["aikyn@example.kz", "premium_monthly", null, false],
    ]);

    await grantAccess(db, { userId: "u1", kind: "single_book", work: WORK, now: NOW });
    requests = (await listPlanRequests(db, { now: NOW })).rows;
    expect(requests.find((r) => r.plan === "single_book")?.granted).toBe(true);
    expect(requests.find((r) => r.plan === "premium_monthly")?.granted).toBe(false);

    await grantAccess(db, { userId: "u1", kind: "premium_monthly", work: null, now: NOW });
    expect((await listPlanRequests(db, { now: NOW })).rows.every((r) => r.granted)).toBe(true);
    // After premium runs out the request shows as open again.
    const later = await listPlanRequests(db, { now: new Date(NOW.getTime() + 40 * DAY) });
    expect(later.rows.find((r) => r.plan === "premium_monthly")?.granted).toBe(false);
  });
});

describe("admin lists: search, filters, pages", () => {
  beforeEach(async () => {
    const readers = Array.from({ length: PAGE_SIZE + 5 }, (_, i) => ({
      id: `r${i}`,
      name: `r${i}`,
      email: `reader${String(i).padStart(2, "0")}@example.kz`,
      createdAt: new Date(NOW.getTime() - i * 60_000),
    }));
    await db.insert(user).values([...readers, { id: "odd", name: "odd", email: "a_b%c@example.kz", createdAt: NOW }]);
  });

  it("pages readers 25 at a time, newest first, with the total", async () => {
    const first = await listReaders(db, { now: NOW });
    expect(first.total).toBe(PAGE_SIZE + 7);
    expect(first.pages).toBe(2);
    expect(first.rows).toHaveLength(PAGE_SIZE);
    const second = await listReaders(db, { now: NOW, page: 2 });
    expect(second.rows).toHaveLength(7);
    expect(new Set([...first.rows, ...second.rows].map((r) => r.id)).size).toBe(PAGE_SIZE + 7);
  });

  it("finds readers by part of the email, case-insensitive, and treats % and _ literally", async () => {
    expect((await listReaders(db, { now: NOW, query: "READER07" })).rows.map((r) => r.email)).toEqual(["reader07@example.kz"]);
    expect((await listReaders(db, { now: NOW, query: "_b%" })).rows.map((r) => r.id)).toEqual(["odd"]);
    expect((await listReaders(db, { now: NOW, query: "%" })).rows.map((r) => r.id)).toEqual(["odd"]);
  });

  it("filters readers by paid access and shows what they have", async () => {
    await grantAccess(db, { userId: "r3", kind: "premium_monthly", work: null, now: NOW });
    await grantAccess(db, { userId: "r4", kind: "single_book", work: WORK, now: NOW });
    const paid = await listReaders(db, { now: NOW, access: "paid" });
    expect(paid.rows.map((r) => r.id).sort()).toEqual(["r3", "r4"]);
    expect(paid.rows.find((r) => r.id === "r3")?.premiumUntil?.getTime()).toBe(NOW.getTime() + 30 * DAY);
    expect(paid.rows.find((r) => r.id === "r4")?.books).toBe(1);
    expect((await listReaders(db, { now: NOW, access: "free" })).total).toBe(PAGE_SIZE + 7 - 2);
  });

  it("filters requests by status and email", async () => {
    for (const id of ["r1", "r2"]) {
      await choosePlan(db, id, { plan: "premium_monthly", work: WORK, slug: "s", chapter: 7, anonId: null }, "transfer", NOW);
    }
    await grantAccess(db, { userId: "r1", kind: "premium_monthly", work: null, now: NOW });
    expect((await listPlanRequests(db, { now: NOW, status: "pending" })).rows.map((r) => r.userId)).toEqual(["r2"]);
    expect((await listPlanRequests(db, { now: NOW, status: "granted" })).rows.map((r) => r.userId)).toEqual(["r1"]);
    expect((await listPlanRequests(db, { now: NOW, query: "reader02" })).rows.map((r) => r.userId)).toEqual(["r2"]);
  });

  it("filters access by source and by whether it has ended", async () => {
    await grantAccess(db, { userId: "r1", kind: "premium_monthly", work: null, now: NOW });
    await choosePlan(db, "r2", { plan: "single_book", work: WORK, slug: "s", chapter: 7, anonId: null }, "demo", NOW);
    const later = new Date(NOW.getTime() + 40 * DAY);
    expect((await listManualGrants(db, { now: later, source: "demo" })).rows.map((g) => g.email)).toEqual(["reader02@example.kz"]);
    expect((await listManualGrants(db, { now: later, status: "expired" })).rows.map((g) => g.email)).toEqual(["reader01@example.kz"]);
    expect((await listManualGrants(db, { now: later, status: "active" })).rows.map((g) => g.email)).toEqual(["reader02@example.kz"]);
  });
});
