import { describe, expect, it } from "vitest";
import { parseSignupSource, withSource } from "./signup-source";

describe("parseSignupSource", () => {
  it("accepts only known sources", () => {
    expect(parseSignupSource("chapter_end")).toBe("chapter_end");
    expect(parseSignupSource("gift_paywall")).toBe("gift_paywall");
    expect(parseSignupSource("evil")).toBeNull();
    expect(parseSignupSource(42)).toBeNull();
    expect(parseSignupSource(null)).toBeNull();
  });
});

describe("withSource", () => {
  it("adds the source to a path with or without a query", () => {
    expect(withSource("/read/x", "chapter_end")).toBe("/read/x?from=chapter_end");
    expect(withSource("/read/x?page=12", "gift_paywall")).toBe("/read/x?page=12&from=gift_paywall");
  });

  it("keeps the hash at the end", () => {
    expect(withSource("/profile#week", "other")).toBe("/profile?from=other#week");
  });
});
