import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "../db";
import { entitlements, user } from "../db/schema";
import { createTestDb, resetDb } from "../db/test-db";
import { canReadChapter } from "./access";
import { listReaderEntitlements, loadEntitlements } from "./entitlements";

let db: Database;

beforeAll(() => {
  db = createTestDb();
});
beforeEach(async () => {
  await resetDb(db);
  await db.insert(user).values([
    { id: "u1", name: "Aikyn", email: "aikyn@example.kz" },
    { id: "u2", name: "Askar", email: "askar@example.kz" },
  ]);
});
afterAll(async () => {
  await db.$client.end();
});

describe("listReaderEntitlements", () => {
  it("lists this reader's purchases oldest first, with their source", async () => {
    await db.insert(entitlements).values([
      { userId: "u1", kind: "premium_monthly", source: "demo", startsAt: new Date("2026-11-05T00:00:00Z"), expiresAt: new Date("2026-12-05T00:00:00Z") },
      { userId: "u1", kind: "single_book", work: "secret-of-lake-bakaly", source: "demo", startsAt: new Date("2026-11-01T00:00:00Z") },
      { userId: "u2", kind: "single_book", work: "secret-of-lake-bakaly", source: "demo" },
    ]);
    const rows = await listReaderEntitlements(db, "u1");
    expect(rows.map((r) => [r.kind, r.source])).toEqual([
      ["single_book", "demo"],
      ["premium_monthly", "demo"],
    ]);
  });
});

describe("loadEntitlements", () => {
  it("returns only this reader's purchases", async () => {
    await db.insert(entitlements).values([
      { userId: "u1", kind: "single_book", work: "secret-of-lake-bakaly", source: "demo" },
      { userId: "u2", kind: "premium_monthly", source: "demo", expiresAt: new Date("2030-01-01T00:00:00Z") },
    ]);
    const mine = await loadEntitlements(db, "u1");
    expect(mine).toEqual([{ kind: "single_book", work: "secret-of-lake-bakaly", expiresAt: null }]);
    expect(await loadEntitlements(db, "nobody")).toEqual([]);
  });

  it("gives the access rule a real Date for premium", async () => {
    const expiresAt = new Date("2026-12-08T12:00:00Z");
    await db.insert(entitlements).values({ userId: "u2", kind: "premium_monthly", source: "demo", expiresAt });
    const rows = await loadEntitlements(db, "u2");
    expect(rows[0].expiresAt?.toISOString()).toBe(expiresAt.toISOString());
    const decide = (now: string) =>
      canReadChapter({
        paywall: { freeChapters: 6, priceTenge: 490 },
        work: "secret-of-lake-bakaly",
        // Chapter 7 is the sign-up gift; 8 is the first paid one.
        chapter: 8,
        reader: { userId: "u2", entitlements: rows },
        now: new Date(now),
      });
    expect(decide("2026-12-08T11:59:59Z")).toBe("ok");
    expect(decide("2026-12-08T12:00:00Z")).toBe("payment_required");
  });
});
