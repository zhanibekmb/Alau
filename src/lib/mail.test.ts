import { afterEach, describe, expect, it, vi } from "vitest";
import { passwordResetMail, sendMail } from "./mail";

describe("password reset email", () => {
  it("carries the link in both text and HTML, escaped in HTML", () => {
    const mail = passwordResetMail("a@example.kz", 'https://alau.kz/x?a=1&b="2"');
    expect(mail.subject).toContain("құпиясөз");
    expect(mail.text).toContain('https://alau.kz/x?a=1&b="2"');
    expect(mail.html).toContain("https://alau.kz/x?a=1&amp;b=&quot;2&quot;");
  });
});

describe("sendMail", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("prints instead of sending when no key is set", async () => {
    vi.stubEnv("BREVO_API_KEY", "");
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    await sendMail(passwordResetMail("a@example.kz", "https://x"));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalled();
  });

  it("posts to Brevo with the key and sender", async () => {
    vi.stubEnv("BREVO_API_KEY", "key-1");
    vi.stubEnv("MAIL_FROM", "alau@example.kz");
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 201 }));
    await sendMail(passwordResetMail("a@example.kz", "https://x"));
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect((init?.headers as Record<string, string>)["api-key"]).toBe("key-1");
    expect(JSON.parse(String(init?.body))).toMatchObject({ sender: { email: "alau@example.kz" }, to: [{ email: "a@example.kz" }] });
  });
});
