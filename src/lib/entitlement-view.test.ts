import { describe, expect, it } from "vitest";
import { activeEntitlements, viewUnlocksWork, type EntitlementView } from "./entitlement-view";

const NOW = new Date("2026-11-09T12:00:00Z");
const book: EntitlementView = {
  kind: "single_book",
  work: "secret-of-lake-bakaly",
  workTitle: "The Secret of Lake Bakaly",
  expiresAt: null,
  demo: true,
};
const premium = (expiresAt: string): EntitlementView => ({
  kind: "premium_monthly",
  work: null,
  workTitle: null,
  expiresAt,
  demo: true,
});

describe("viewUnlocksWork (lock icons in the chapter menu)", () => {
  it("removes locks for the bought work only", () => {
    expect(viewUnlocksWork([book], "secret-of-lake-bakaly", NOW)).toBe(true);
    expect(viewUnlocksWork([book], "institute-of-artificial-consciousness", NOW)).toBe(false);
  });

  it("removes every lock during premium and brings them back after it ends", () => {
    expect(viewUnlocksWork([premium("2026-12-09T12:00:00Z")], "institute-of-artificial-consciousness", NOW)).toBe(true);
    expect(viewUnlocksWork([premium("2026-11-09T12:00:00Z")], "institute-of-artificial-consciousness", NOW)).toBe(false);
  });

  it("keeps locks for a guest", () => {
    expect(viewUnlocksWork([], "secret-of-lake-bakaly", NOW)).toBe(false);
  });
});

describe("activeEntitlements (the profile)", () => {
  it("lists books and running premium, hides ended premium", () => {
    const ended = premium("2026-10-01T00:00:00Z");
    const running = premium("2026-12-09T12:00:00Z");
    expect(activeEntitlements([book, ended, running], NOW)).toEqual([book, running]);
  });
});
