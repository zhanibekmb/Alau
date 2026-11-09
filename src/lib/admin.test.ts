import { describe, expect, it } from "vitest";
import { isAdminEmail, parseAdminEmails } from "./admin";

describe("ADMIN_EMAILS", () => {
  it("nobody is an admin when the variable is empty or missing", () => {
    expect(isAdminEmail("team@alau.kz", undefined)).toBe(false);
    expect(isAdminEmail("team@alau.kz", "")).toBe(false);
  });

  it("matches listed emails regardless of case and spaces", () => {
    const raw = " Team@Alau.kz , second@alau.kz,,";
    expect(isAdminEmail("team@alau.kz", raw)).toBe(true);
    expect(isAdminEmail("SECOND@alau.kz ", raw)).toBe(true);
    expect(isAdminEmail("reader@alau.kz", raw)).toBe(false);
    expect([...parseAdminEmails(raw)]).toEqual(["team@alau.kz", "second@alau.kz"]);
  });

  it("does not match part of an email", () => {
    expect(isAdminEmail("team@alau.kz.evil.com", "team@alau.kz")).toBe(false);
    expect(isAdminEmail("am@alau.kz", "team@alau.kz")).toBe(false);
  });
});
