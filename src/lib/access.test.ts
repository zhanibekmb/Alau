import { describe, expect, it } from "vitest";
import { SOURCE_BOOKS } from "../content/books";
import { IRREGULAR_FORMS, LEXICON } from "../content/lexicon";
import { canReadChapter, type Entitlement, type ReaderAccess } from "./access";
import { buildEdition } from "./publish";
import { serveChapter, type LoadReader } from "./serve";

const NOW = new Date("2026-11-08T12:00:00Z");
const paywall = { freeChapters: 6, priceTenge: 490 };
const WORK = "secret-of-lake-bakaly";

const reader = (...entitlements: Entitlement[]): ReaderAccess => ({ userId: "u1", entitlements });
const book = (work: string): Entitlement => ({ kind: "single_book", work, expiresAt: null });
const premium = (expiresAt: Date): Entitlement => ({ kind: "premium_monthly", work: null, expiresAt });
const decide = (chapter: number, who: ReaderAccess | null, wall: typeof paywall | null = paywall) =>
  canReadChapter({ paywall: wall, work: WORK, chapter, reader: who, now: NOW });

describe("canReadChapter", () => {
  it("lets anyone read up to the last free chapter", () => {
    expect(decide(1, null)).toBe("ok");
    expect(decide(6, null)).toBe("ok");
  });

  it("gives a free account the chapter after the climax, and asks a guest to sign up for it", () => {
    expect(decide(7, null)).toBe("login_required");
    expect(decide(7, reader())).toBe("ok");
  });

  it("asks a guest to sign in for a paid chapter", () => {
    expect(decide(8, null)).toBe("login_required");
  });

  it("asks a reader without a purchase to pay after the gift chapter", () => {
    expect(decide(8, reader())).toBe("payment_required");
  });

  it("opens every level of a work bought once", () => {
    // The purchase stores the work, not the level, so A2 and B1 slugs both open.
    expect(decide(9, reader(book(WORK)))).toBe("ok");
  });

  it("does not open a different work", () => {
    expect(decide(8, reader(book("institute-of-artificial-consciousness")))).toBe("payment_required");
  });

  it("opens everything during premium and closes it at the exact end", () => {
    expect(decide(8, reader(premium(new Date(NOW.getTime() + 1000))))).toBe("ok");
    expect(decide(8, reader(premium(NOW)))).toBe("payment_required");
    expect(decide(8, reader(premium(new Date(NOW.getTime() - 1000))))).toBe("payment_required");
  });

  it("keeps a premium row without an end date closed (the database forbids it anyway)", () => {
    expect(decide(8, reader({ kind: "premium_annual", work: null, expiresAt: null }))).toBe("payment_required");
  });

  it("opens every chapter of a book without a paywall", () => {
    expect(decide(40, null, null)).toBe("ok");
  });
});

describe("serveChapter for a paid book", () => {
  const dictionary = { lexicon: LEXICON, irregular: IRREGULAR_FORMS };
  const edition = buildEdition(SOURCE_BOOKS.find((b) => b.slug === "secret-of-lake-bakaly-b1")!, dictionary);
  const as = (who: ReaderAccess | null): LoadReader => async () => who;
  const failingDb: LoadReader = async () => {
    throw new Error("connection refused");
  };

  it("serves a free chapter without looking up the reader, even if the database is down", async () => {
    expect((await serveChapter(edition, 6, null, NOW, failingDb)).status).toBe(200);
  });

  it("serves the gift chapter to any account and never answers a guest 304 for it", async () => {
    const gift = await serveChapter(edition, 7, null, NOW, as(reader()));
    if (gift.status !== 200) throw new Error("expected 200");
    expect((await serveChapter(edition, 7, gift.etag, NOW, as(null))).status).toBe(401);
    expect((await serveChapter(edition, 7, gift.etag, NOW, as(reader()))).status).toBe(304);
  });

  it("answers 401 to a guest and 402 to a reader without a purchase", async () => {
    expect((await serveChapter(edition, 8, null, NOW, as(null))).status).toBe(401);
    expect((await serveChapter(edition, 8, null, NOW, as(reader()))).status).toBe(402);
  });

  it("serves a paid chapter to a reader who bought the work", async () => {
    const result = await serveChapter(edition, 8, null, NOW, as(reader(book(WORK))));
    expect(result.status).toBe(200);
  });

  it("never answers 304 to a reader without access, even with the right ETag (cache leak)", async () => {
    const paid = await serveChapter(edition, 8, null, NOW, as(reader(book(WORK))));
    if (paid.status !== 200) throw new Error("expected 200");
    expect((await serveChapter(edition, 8, paid.etag, NOW, as(null))).status).toBe(401);
    expect((await serveChapter(edition, 8, paid.etag, NOW, as(reader()))).status).toBe(402);
    expect((await serveChapter(edition, 8, paid.etag, NOW, as(reader(book(WORK))))).status).toBe(304);
  });

  it("closes a chapter cached during premium once premium has ended", async () => {
    const during = await serveChapter(edition, 8, null, NOW, as(reader(premium(new Date(NOW.getTime() + 60_000)))));
    if (during.status !== 200) throw new Error("expected 200");
    const later = new Date(NOW.getTime() + 120_000);
    const after = await serveChapter(edition, 8, during.etag, later, as(reader(premium(new Date(NOW.getTime() + 60_000)))));
    expect(after.status).toBe(402);
  });

  it("answers 503 when the database fails on a paid chapter", async () => {
    const result = await serveChapter(edition, 8, null, NOW, failingDb);
    expect(result.status).toBe(503);
  });

  it("opens every chapter when the license stops allowing paid access", async () => {
    const free = buildEdition(
      { ...edition.source, license: { ...edition.source.license, allows: { ...edition.source.license.allows, paidAccess: false } } },
      dictionary,
    );
    expect((await serveChapter(free, 9, null, NOW, failingDb)).status).toBe(200);
  });
});
