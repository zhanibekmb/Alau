import { describe, expect, it } from "vitest";
import { SOURCE_BOOKS } from "../content/books";
import { IRREGULAR_FORMS, LEXICON } from "../content/lexicon";
import { MissingGlossError, buildEdition, paginate, resolveLemma } from "./publish";
import { createRateLimiter, isLicenseValid, serveChapter } from "./serve";
import { INITIAL_STATE, addWord, mergeProgress, parseStoredState, progressPercent } from "./state";
import type { License, SourceBook } from "./types";

const dictionary = { lexicon: LEXICON, irregular: IRREGULAR_FORMS };
const NOW = new Date("2026-11-06T12:00:00Z");

const license = (change: Partial<License> = {}): License => ({
  holder: "Test",
  status: "active",
  validUntil: null,
  allows: { translation: true, adaptation: true, aiProcessing: true, paidAccess: false },
  ...change,
});

const book = (paragraphs: string[], change: Partial<SourceBook> = {}): SourceBook => ({
  slug: "test",
  work: "test",
  title: "Test",
  author: "Test",
  level: "A1",
  genre: "Test",
  version: 1,
  cover: { sky: "#fff", sun: "#fff", hills: ["#fff", "#fff"] },
  description: { kk: "", en: "" },
  keyWords: [],
  license: license(),
  chapters: [{ title: "One", paragraphs }],
  ...change,
});

describe("content", () => {
  it.each(SOURCE_BOOKS.map((b) => [b.slug, b] as const))("%s has a translation for every word", (_, source) => {
    expect(() => buildEdition(source, dictionary)).not.toThrow();
  });

  it("blocks a chapter that has a word without a translation", () => {
    expect(() => buildEdition(book(["The zzzqx ran."]), dictionary)).toThrow(MissingGlossError);
  });

  it("blocks a phrase that points at an unknown dictionary key", () => {
    expect(() => buildEdition(book(["{ran off|run off} now."]), dictionary)).toThrow(MissingGlossError);
  });

  it("finds the base form of regular and irregular words", () => {
    expect(resolveLemma("horses", dictionary)).toBe("horse");
    expect(resolveLemma("went", dictionary)).toBe("go");
    expect(resolveLemma("stopped", dictionary)).toBe("stop");
    expect(resolveLemma("carries", dictionary)).toBe("carry");
    expect(resolveLemma("grandfather's", dictionary)).toBe("grandfather");
    expect(resolveLemma("constructor", dictionary)).toBeNull();
  });

  it("gives every word of a set expression the same translation and phrase id", () => {
    const edition = buildEdition(book(["They {look for|look for} it."]), dictionary);
    const tokens = edition.chapters[0].pages[0].paragraphs[0][0].tokens.filter((t) => t.ph !== undefined);
    expect(tokens.map((t) => t.t)).toEqual(["look", "for"]);
    expect(new Set(tokens.map((t) => t.g))).toEqual(new Set(["look for"]));
    expect(new Set(tokens.map((t) => t.ph)).size).toBe(1);
  });

  it("keeps the text unchanged after tokenizing", () => {
    const edition = buildEdition(book(['She said, "{Come back|come back}!" Then she ran.']), dictionary);
    const text = edition.chapters[0].pages
      .flatMap((p) => p.paragraphs.flat().flatMap((s) => s.tokens.map((t) => t.t)))
      .join("");
    expect(text).toBe('She said, "Come back!" Then she ran.');
  });

  it("numbers pages through the whole book and never splits a sentence", () => {
    const sentence = (id: string, words: number) => ({
      id,
      tokens: Array.from({ length: words }, () => ({ t: "word " })),
    });
    const pages = paginate([[sentence("a", 6), sentence("b", 6)], [sentence("c", 6)]], 4, 10);
    expect(pages.map((p) => p.number)).toEqual([4, 5, 6]);
    expect(pages[0].paragraphs).toHaveLength(1);
    expect(pages[0].paragraphs[0].map((s) => s.id)).toEqual(["a"]);
  });

  it("continues page numbers between chapters", () => {
    const { info } = buildEdition(SOURCE_BOOKS[1], dictionary);
    info.chapters.slice(1).forEach((chapter, i) => {
      expect(chapter.firstPage).toBe(info.chapters[i].lastPage + 1);
    });
    expect(info.chapters.at(-1)?.lastPage).toBe(info.totalPages);
  });
});

describe("licenses", () => {
  it("accepts an active permission with no end date", () => {
    expect(isLicenseValid(license(), NOW)).toBe(true);
  });

  it("rejects a revoked permission", () => {
    expect(isLicenseValid(license({ status: "revoked" }), NOW)).toBe(false);
  });

  it("rejects an expired permission with no manual action", () => {
    expect(isLicenseValid(license({ validUntil: "2026-11-05" }), NOW)).toBe(false);
    expect(isLicenseValid(license({ validUntil: "2026-11-07" }), NOW)).toBe(true);
  });

  it("rejects a permission that does not cover adaptation", () => {
    const allows = { translation: true, adaptation: false, aiProcessing: true, paidAccess: true };
    expect(isLicenseValid(license({ allows }), NOW)).toBe(false);
  });
});

describe("serving a chapter", () => {
  const edition = buildEdition(SOURCE_BOOKS[0], dictionary);
  /** Demo books are free, so the reader must never be looked up. */
  const noLookup = async () => {
    throw new Error("a free chapter must not look up the reader");
  };

  it("returns the chapter with an ETag, then 304 when nothing changed", async () => {
    const first = await serveChapter(edition, 1, null, NOW, noLookup);
    expect(first.status).toBe(200);
    if (first.status !== 200) return;
    expect(JSON.parse(first.body).chapter).toBe(1);
    expect((await serveChapter(edition, 1, first.etag, NOW, noLookup)).status).toBe(304);
  });

  it("returns 410 once the license is revoked, even with a cached copy", async () => {
    const first = await serveChapter(edition, 1, null, NOW, noLookup);
    if (first.status !== 200) throw new Error("expected 200");
    const revoked = { ...edition, source: { ...edition.source, license: license({ status: "revoked" }) } };
    expect((await serveChapter(revoked, 1, first.etag, NOW, noLookup)).status).toBe(410);
  });

  it("returns 404 for an unknown book or chapter", async () => {
    expect((await serveChapter(undefined, 1, null, NOW, noLookup)).status).toBe(404);
    expect((await serveChapter(edition, 99, null, NOW, noLookup)).status).toBe(404);
  });

  it("limits request rate per client and resets after the window", () => {
    const allow = createRateLimiter(2, 1000);
    expect([allow("a", 0), allow("a", 1), allow("a", 2)]).toEqual([true, true, false]);
    expect(allow("b", 2)).toBe(true);
    expect(allow("a", 1000)).toBe(true);
  });
});

describe("reader state", () => {
  const at = (page: number, finished = false) => ({ page, totalPages: 10, finished, updatedAt: page });

  it("does not move progress back when an old tab writes", () => {
    expect(mergeProgress(at(7), at(3)).page).toBe(7);
    expect(mergeProgress(at(3), at(7)).page).toBe(7);
  });

  it("keeps a finished book finished", () => {
    expect(mergeProgress(at(10, true), at(2)).finished).toBe(true);
  });

  it("shows 100% only for a finished book", () => {
    expect(progressPercent(undefined)).toBe(0);
    expect(progressPercent(at(10))).toBe(99);
    expect(progressPercent(at(10, true))).toBe(100);
  });

  it("saves a word once when it is tapped twice", () => {
    const word = {
      id: "eagle", lemma: "eagle", kk: "бүркіт", ipa: "", pos: "n",
      slug: "x", bookTitle: "X", page: 1, sentence: "", savedAt: 1,
    };
    const once = addWord({}, word);
    const twice = addWord(once, { ...word, savedAt: 2 });
    expect(Object.keys(twice)).toEqual(["eagle"]);
    expect(twice.eagle.savedAt).toBe(1);
  });

  it("survives damaged stored data", () => {
    expect(parseStoredState("{not json")).toEqual(INITIAL_STATE);
    expect(parseStoredState(null)).toEqual(INITIAL_STATE);
    expect(parseStoredState('{"settings":{"theme":"pink"}}').settings.theme).toBe("paper");
  });
});
