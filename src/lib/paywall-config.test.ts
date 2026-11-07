import { describe, expect, it } from "vitest";
import { SOURCE_BOOKS } from "../content/books";
import { IRREGULAR_FORMS, LEXICON } from "../content/lexicon";
import { InvalidPaywallError, bookPaywall, buildEdition } from "./publish";
import type { SourceBook } from "./types";

// Where each book's free part ends (plan D9) and what the reader UI is told about it (E1A).

const dictionary = { lexicon: LEXICON, irregular: IRREGULAR_FORMS };
const bySlug = (slug: string) => SOURCE_BOOKS.find((b) => b.slug === slug)!;

const threeChapters = (change: Partial<SourceBook> = {}): SourceBook => ({
  ...bySlug("the-little-foal"),
  slug: "test",
  work: "test",
  chapters: ["One", "Two", "Three"].map((title) => ({ title, paragraphs: ["Dana is ten."] })),
  ...change,
});

describe("free part of each real book", () => {
  it.each([
    ["secret-of-lake-bakaly-a1", 6, 490],
    ["secret-of-lake-bakaly-a2", 6, 490],
    ["secret-of-lake-bakaly-b1", 6, 490],
    ["secret-of-lake-bakaly-b2", 6, 490],
    ["institute-of-artificial-consciousness-a1", 17, 690],
    ["institute-of-artificial-consciousness-a2", 12, 690],
    ["institute-of-artificial-consciousness-b1", 9, 690],
    ["institute-of-artificial-consciousness-b2", 7, 690],
  ])("%s is free to chapter %i and costs %i ₸", (slug, freeChapters, priceTenge) => {
    expect(bookPaywall(bySlug(slug))).toEqual({ freeChapters, priceTenge });
  });

  it("ends the Institute's free part on the same story moment at each level", () => {
    const lastFree = (slug: string) => {
      const source = bySlug(slug);
      return source.chapters[source.paywall!.freeChapters - 1].title;
    };
    expect(lastFree("institute-of-artificial-consciousness-a1")).toBe("Experiment and Awakening");
    expect(lastFree("institute-of-artificial-consciousness-b1")).toBe("The Gladiator Dream and Virtual Reality");
    expect(lastFree("institute-of-artificial-consciousness-b2")).toBe("Gladiator Dream and Virtual Reality");
  });

  it("groups the four levels of a story into one work", () => {
    const works = new Set(SOURCE_BOOKS.filter((b) => b.slug.startsWith("secret-of-lake-bakaly")).map((b) => b.work));
    expect(works).toEqual(new Set(["secret-of-lake-bakaly"]));
  });

  it("keeps the demo stories completely free", () => {
    for (const slug of ["the-little-foal", "the-eagle-girl", "the-silent-dombra", "the-salt-road"]) {
      expect(bookPaywall(bySlug(slug))).toBeNull();
    }
  });
});

describe("bookPaywall", () => {
  it("makes everything free when the license does not allow paid access", () => {
    const source = threeChapters({ paywall: { freeChapters: 1, priceTenge: 490 } });
    const noPaidAccess = { ...source, license: { ...source.license, allows: { ...source.license.allows, paidAccess: false } } };
    expect(bookPaywall(source)).not.toBeNull();
    expect(bookPaywall(noPaidAccess)).toBeNull();
  });

  it("tells the reader UI exactly what the server will use", () => {
    for (const source of SOURCE_BOOKS) {
      expect(buildEdition(source, dictionary).info.paywall).toEqual(bookPaywall(source));
    }
  });
});

describe("paywall settings that would lock readers out or sell nothing", () => {
  it.each([
    ["no free chapter", { freeChapters: 0, priceTenge: 490 }],
    ["no paid chapter", { freeChapters: 3, priceTenge: 490 }],
    ["half a chapter", { freeChapters: 1.5, priceTenge: 490 }],
    ["free price", { freeChapters: 1, priceTenge: 0 }],
    ["fractional price", { freeChapters: 1, priceTenge: 490.5 }],
  ])("rejects %s", (_, paywall) => {
    expect(() => buildEdition(threeChapters({ paywall }), dictionary)).toThrow(InvalidPaywallError);
  });

  it("rejects a book without a work", () => {
    expect(() => buildEdition(threeChapters({ work: " " }), dictionary)).toThrow(InvalidPaywallError);
  });

  it("accepts a valid paywall", () => {
    const info = buildEdition(threeChapters({ paywall: { freeChapters: 2, priceTenge: 490 } }), dictionary).info;
    expect(info.paywall).toEqual({ freeChapters: 2, priceTenge: 490 });
    expect(info.work).toBe("test");
  });
});
