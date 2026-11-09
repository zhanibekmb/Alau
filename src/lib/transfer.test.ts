import { describe, expect, it } from "vitest";
import { transferDetails } from "./transfer";

const base = { TRANSFER_KASPI: "+7 777 123 45 67", TRANSFER_NAME: "Жанибек М." };

describe("transferDetails", () => {
  it("is off until all three settings are filled", () => {
    expect(transferDetails({})).toBeNull();
    expect(transferDetails({ ...base })).toBeNull();
    expect(transferDetails({ ...base, TRANSFER_CONTACT: "   " })).toBeNull();
  });

  it("accepts a Telegram or WhatsApp link", () => {
    expect(transferDetails({ ...base, TRANSFER_CONTACT: "https://t.me/alau_support" })).toEqual({
      account: "+7 777 123 45 67",
      recipient: "Жанибек М.",
      contactHref: "https://t.me/alau_support",
      contactLabel: "t.me/alau_support",
    });
  });

  it("turns an email into a mailto link", () => {
    expect(transferDetails({ ...base, TRANSFER_CONTACT: "pay@example.kz" })?.contactHref).toBe("mailto:pay@example.kz");
  });

  it("refuses anything that is not a safe link or an email", () => {
    expect(transferDetails({ ...base, TRANSFER_CONTACT: "javascript:alert(1)" })).toBeNull();
    expect(transferDetails({ ...base, TRANSFER_CONTACT: "http://t.me/x" })).toBeNull();
  });
});
