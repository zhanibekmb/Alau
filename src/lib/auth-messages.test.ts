import { describe, expect, it } from "vitest";
import { authErrorMessage, safeNextPath } from "./auth-messages";

describe("safeNextPath", () => {
  it.each([
    ["/read/secret-of-lake-bakaly-a2", "/read/secret-of-lake-bakaly-a2"],
    ["/profile?tab=words", "/profile?tab=words"],
    [undefined, "/library"],
    [null, "/library"],
    ["", "/library"],
    ["https://evil.example", "/library"],
    ["//evil.example", "/library"],
    ["/\\evil.example", "/library"],
    ["javascript:alert(1)", "/library"],
  ])("%s → %s", (input, expected) => {
    expect(safeNextPath(input)).toBe(expected);
  });
});

describe("authErrorMessage", () => {
  it("does not say whether the email or the password was wrong", () => {
    expect(authErrorMessage({ code: "INVALID_EMAIL_OR_PASSWORD", status: 401 })).toBe("Email немесе құпиясөз қате.");
  });

  it("asks to wait when there are too many attempts", () => {
    expect(authErrorMessage({ status: 429 })).toMatch(/минуттан кейін/);
  });

  it("sends people with an existing account to sign in", () => {
    expect(authErrorMessage({ code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" })).toMatch(/Кіріңіз/);
  });

  it("falls back to a general message", () => {
    expect(authErrorMessage({ code: "SOMETHING_NEW" })).toMatch(/Қайталап/);
    expect(authErrorMessage(null)).toMatch(/Қайталап/);
  });
});
