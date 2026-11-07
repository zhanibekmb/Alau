import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "./index";
import { entitlements, paywallEvents, savedWords, user } from "./schema";
import { createTestDb, resetDb } from "./test-db";

// Rules the database itself enforces, so a bug in app code cannot break them.

let db: Database;
const MONTH_LATER = new Date("2026-12-08T00:00:00Z");

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

/** Postgres error code from a Drizzle error (Drizzle wraps the driver error in `cause`). */
async function pgErrorCode(action: Promise<unknown>): Promise<string | undefined> {
  try {
    await action;
    return undefined;
  } catch (error) {
    const e = error as { code?: string; cause?: { code?: string } };
    return e.code ?? e.cause?.code;
  }
}

const UNIQUE_VIOLATION = "23505";
const CHECK_VIOLATION = "23514";

describe("entitlements", () => {
  it("keeps one purchase per book, so a second tap on Buy cannot duplicate it", async () => {
    const book = { userId: "u1", kind: "single_book" as const, work: "secret-of-lake-bakaly", source: "demo" as const };
    await db.insert(entitlements).values(book);
    expect(await pgErrorCode(db.insert(entitlements).values(book))).toBe(UNIQUE_VIOLATION);
    await db.insert(entitlements).values({ ...book, work: "institute-of-artificial-consciousness" });
    expect(await db.$count(entitlements)).toBe(2);
  });

  it("allows several premium periods for the same reader", async () => {
    const premium = { userId: "u1", kind: "premium_monthly" as const, source: "demo" as const, expiresAt: MONTH_LATER };
    await db.insert(entitlements).values([premium, premium]);
    expect(await db.$count(entitlements)).toBe(2);
  });

  it("rejects a book purchase without a work or with an end date", async () => {
    const base = { userId: "u1", kind: "single_book" as const, source: "demo" as const };
    expect(await pgErrorCode(db.insert(entitlements).values(base))).toBe(CHECK_VIOLATION);
    expect(
      await pgErrorCode(db.insert(entitlements).values({ ...base, work: "secret-of-lake-bakaly", expiresAt: MONTH_LATER })),
    ).toBe(CHECK_VIOLATION);
  });

  it("rejects premium without an end date or tied to one work", async () => {
    const base = { userId: "u1", kind: "premium_annual" as const, source: "demo" as const };
    expect(await pgErrorCode(db.insert(entitlements).values(base))).toBe(CHECK_VIOLATION);
    expect(
      await pgErrorCode(db.insert(entitlements).values({ ...base, expiresAt: MONTH_LATER, work: "secret-of-lake-bakaly" })),
    ).toBe(CHECK_VIOLATION);
  });
});

describe("deleting a reader", () => {
  it("removes their access but keeps paywall statistics without the name", async () => {
    await db.insert(entitlements).values({ userId: "u1", kind: "single_book", work: "secret-of-lake-bakaly", source: "demo" });
    await db.insert(paywallEvents).values({ userId: "u1", type: "plan_chosen", plan: "single_book", chapter: 7 });

    await db.delete(user).where(eq(user.id, "u1"));

    expect(await db.$count(entitlements)).toBe(0);
    const events = await db.select().from(paywallEvents);
    expect(events).toHaveLength(1);
    expect(events[0].userId).toBeNull();
  });
});

describe("text", () => {
  it("stores Kazakh letters unchanged", async () => {
    const kk = "әғқңөұүһі ӘҒҚҢӨҰҮҺІ: жүрек, бақа, Қазақия";
    await db.insert(savedWords).values({
      userId: "u1",
      glossId: "heart",
      lemma: "heart",
      kk,
      ipa: "hɑːrt",
      pos: "n",
      slug: "institute-of-artificial-consciousness-a1",
      bookTitle: "The Institute",
      page: 3,
      sentence: "He has a good heart.",
      savedAt: new Date(),
    });
    const [row] = await db.select().from(savedWords);
    expect(row.kk).toBe(kk);
  });
});
