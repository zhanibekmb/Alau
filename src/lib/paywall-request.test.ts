import { describe, expect, it } from "vitest";
import { findPaidWork } from "./catalog";
import { paymentsMode } from "./payments-mode";
import { parsePaywallPlace, parsePlanChoice } from "./paywall-request";

const valid = {
  plan: "single_book",
  work: "secret-of-lake-bakaly",
  slug: "secret-of-lake-bakaly-b1",
  chapter: 7,
  anonId: "a1b2c3",
};

describe("paymentsMode", () => {
  it("unlocks only for exactly 'demo'", () => {
    expect(paymentsMode("demo")).toBe("demo");
    expect(paymentsMode("interest")).toBe("interest");
    expect(paymentsMode("transfer")).toBe("transfer");
    expect(paymentsMode("Transfer")).toBe("interest");
    expect(paymentsMode(undefined)).toBe("interest");
    expect(paymentsMode("")).toBe("interest");
    expect(paymentsMode("Demo")).toBe("interest");
    expect(paymentsMode("demo ")).toBe("interest");
  });
});

describe("findPaidWork", () => {
  it("lists every level of a story and its price", () => {
    expect(findPaidWork("secret-of-lake-bakaly")).toEqual({
      work: "secret-of-lake-bakaly",
      title: "The Secret of Lake Bakaly",
      priceTenge: 490,
      slugs: ["secret-of-lake-bakaly-a1", "secret-of-lake-bakaly-a2", "secret-of-lake-bakaly-b1", "secret-of-lake-bakaly-b2"],
    });
  });

  it("does not sell free demo stories or unknown works", () => {
    expect(findPaidWork("the-little-foal")).toBeUndefined();
    expect(findPaidWork("harry-potter")).toBeUndefined();
  });
});

describe("parsePlanChoice", () => {
  it("accepts a valid choice", () => {
    expect(parsePlanChoice(valid, findPaidWork)).toEqual({ ok: true, value: valid });
  });

  it("treats a missing anonId as a signed-in-only choice", () => {
    const withoutAnonId = { ...valid, anonId: undefined };
    expect(parsePlanChoice(withoutAnonId, findPaidWork)).toEqual({ ok: true, value: { ...valid, anonId: null } });
  });

  it.each([
    ["no body", null],
    ["a string body", "single_book"],
    ["an unknown plan", { ...valid, plan: "premium_forever" }],
    ["a free work", { ...valid, work: "the-little-foal", slug: "the-little-foal" }],
    ["a slug from another work", { ...valid, slug: "institute-of-artificial-consciousness-b1" }],
    ["chapter as text", { ...valid, chapter: "7" }],
    ["chapter 0", { ...valid, chapter: 0 }],
    ["half a chapter", { ...valid, chapter: 7.5 }],
    ["a huge anonId", { ...valid, anonId: "x".repeat(65) }],
    ["an empty anonId", { ...valid, anonId: "" }],
  ])("rejects %s", (_, body) => {
    expect(parsePlanChoice(body, findPaidWork).ok).toBe(false);
  });

  it("ignores a price sent by the browser", () => {
    const result = parsePlanChoice({ ...valid, priceTenge: 1 }, findPaidWork);
    expect(result.ok && "priceTenge" in result.value).toBe(false);
  });
});

describe("parsePaywallPlace", () => {
  it("does not need a plan", () => {
    const place = { work: valid.work, slug: valid.slug, chapter: valid.chapter, anonId: valid.anonId };
    expect(parsePaywallPlace(place, findPaidWork)).toEqual({ ok: true, value: place });
  });
});
