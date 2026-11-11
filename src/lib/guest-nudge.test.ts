import { describe, expect, it } from "vitest";
import { guestStashText, nudgeAfterSave, signUpHref, streakNudgeText } from "./guest-nudge";

describe("nudgeAfterSave", () => {
  it("reminds on the first, fifth and every tenth word only", () => {
    const hits = Array.from({ length: 40 }, (_, i) => i + 1).filter(nudgeAfterSave);
    expect(hits).toEqual([1, 5, 10, 20, 30, 40]);
  });
});

describe("signUpHref", () => {
  it("returns the guest to the page they were on", () => {
    expect(signUpHref("/read/x?ch=2")).toBe("/login?mode=sign-up&next=%2Fread%2Fx%3Fch%3D2%26from%3Dother");
    expect(signUpHref("/read/x", "gift_paywall")).toBe("/login?mode=sign-up&next=%2Fread%2Fx%3Ffrom%3Dgift_paywall");
  });
});

describe("guestStashText", () => {
  it("names only what the guest has", () => {
    expect(guestStashText(12, 3)).toBe("12 сөз және 3 кітап");
    expect(guestStashText(0, 2)).toBe("2 кітап");
    expect(guestStashText(0, 0)).toBe("");
  });
});

describe("streakNudgeText", () => {
  it("speaks up from a two-day streak", () => {
    expect(streakNudgeText(0)).toBeNull();
    expect(streakNudgeText(1)).toBeNull();
    expect(streakNudgeText(3)).toMatch(/^Серияңыз 3 күн/);
  });
});
