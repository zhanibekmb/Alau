import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "../db";
import { account, paywallEvents, user } from "../db/schema";
import { createTestDb, resetDb } from "../db/test-db";
import { AUTH_ATTEMPTS_PER_MINUTE, createAuth, type Auth } from "./auth";

// Sign-up and sign-in through Better Auth's real HTTP handler, against alau_test.

const ORIGIN = "http://localhost:3000";
let db: Database;
let auth: Auth;
let ipCounter = 0;

beforeAll(() => {
  db = createTestDb();
  auth = createAuth(db, { secret: "test-secret-that-is-long-enough-0123456789", baseURL: ORIGIN });
});
beforeEach(async () => {
  await resetDb(db);
});
afterAll(async () => {
  await db.$client.end();
});

/** Each test gets its own IP, so the rate limiter of one test does not affect another. */
const freshIp = () => `10.0.0.${++ipCounter}`;

async function post(path: string, body: object, ip: string, cookie?: string) {
  const response = await auth.handler(
    new Request(`${ORIGIN}/api/auth${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: ORIGIN,
        "x-forwarded-for": ip,
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(body),
    }),
  );
  const json = (await response.json().catch(() => null)) as { code?: string } | null;
  return { status: response.status, json, setCookie: response.headers.get("set-cookie") ?? "" };
}

const signUp = (email: string, password: string, ip = freshIp()) =>
  post("/sign-up/email", { email, password, name: email.split("@")[0] }, ip);
const signIn = (email: string, password: string, ip = freshIp()) => post("/sign-in/email", { email, password }, ip);

describe("sign-up", () => {
  it("creates the reader and stores only a hash of the password", async () => {
    const result = await signUp("aikyn@example.kz", "ballet-2024");
    expect(result.status).toBe(200);
    expect(result.setCookie).toMatch(/session_token/);

    const [row] = await db.select().from(user).where(eq(user.email, "aikyn@example.kz"));
    const [credentials] = await db.select().from(account).where(eq(account.userId, row.id));
    expect(credentials.providerId).toBe("credential");
    expect(credentials.password).toBeTruthy();
    expect(credentials.password).not.toContain("ballet-2024");
  });

  it("refuses a second account with the same email", async () => {
    await signUp("askar@example.kz", "history-2024");
    const again = await signUp("askar@example.kz", "another-2024");
    expect(again.status).toBeGreaterThanOrEqual(400);
    expect(again.json?.code).toMatch(/^USER_ALREADY_EXISTS/);
    expect(await db.$count(user)).toBe(1);
  });

  it("refuses a password shorter than 8 characters", async () => {
    const result = await signUp("short@example.kz", "1234567");
    expect(result.status).toBe(400);
    expect(result.json?.code).toBe("PASSWORD_TOO_SHORT");
    expect(await db.$count(user)).toBe(0);
  });
});

describe("sign-in", () => {
  beforeEach(async () => {
    await signUp("koktem@example.kz", "laboratory-2108");
  });

  it("signs in with the right password and the session knows the reader", async () => {
    const result = await signIn("koktem@example.kz", "laboratory-2108");
    expect(result.status).toBe(200);
    const cookie = result.setCookie.split(";")[0];
    const session = await auth.api.getSession({ headers: new Headers({ cookie }) });
    expect(session?.user.email).toBe("koktem@example.kz");
  });

  it("gives the same answer for a wrong password and an unknown email", async () => {
    const wrongPassword = await signIn("koktem@example.kz", "wrong-password");
    const unknownEmail = await signIn("nobody@example.kz", "laboratory-2108");
    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    expect(wrongPassword.json?.code).toBe("INVALID_EMAIL_OR_PASSWORD");
    expect(unknownEmail.json?.code).toBe("INVALID_EMAIL_OR_PASSWORD");
  });

  it(`blocks the attempt after ${AUTH_ATTEMPTS_PER_MINUTE} tries in a minute from one address`, async () => {
    const ip = freshIp();
    for (let i = 0; i < AUTH_ATTEMPTS_PER_MINUTE; i++) {
      expect((await signIn("koktem@example.kz", `guess-${i}-password`, ip)).status).toBe(401);
    }
    expect((await signIn("koktem@example.kz", "laboratory-2108", ip)).status).toBe(429);
    // Another address is not affected.
    expect((await signIn("koktem@example.kz", "laboratory-2108")).status).toBe(200);
  });
});

describe("sign-out", () => {
  it("ends the session", async () => {
    const { setCookie } = await signUp("zhanna@example.kz", "capsule-2108");
    const cookie = setCookie.split(";")[0];
    expect((await post("/sign-out", {}, freshIp(), cookie)).status).toBe(200);
    expect(await auth.api.getSession({ headers: new Headers({ cookie }) })).toBeNull();
  });
});

describe("signup event (counted on /admin/paywall)", () => {
  it("records one signup event for a new account and none for a refused one", async () => {
    expect((await signUp("new@example.kz", "long-password-1")).status).toBe(200);
    expect((await signUp("new@example.kz", "long-password-1")).status).not.toBe(200);
    const [created] = await db.select().from(user).where(eq(user.email, "new@example.kz"));
    const events = await db.select().from(paywallEvents);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: "signup", userId: created.id });
  });
});

describe("password reset", () => {
  const sent: { email: string; url: string }[] = [];
  const resetAuth = () =>
    createAuth(db, {
      secret: "test-secret-that-is-long-enough-0123456789",
      baseURL: ORIGIN,
      sendResetEmail: async (data) => {
        sent.push(data);
      },
    });
  const call = (instance: Auth, path: string, body: object, cookie?: string) =>
    instance.handler(
      new Request(`${ORIGIN}/api/auth${path}`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: ORIGIN, "x-forwarded-for": freshIp(), ...(cookie ? { cookie } : {}) },
        body: JSON.stringify(body),
      }),
    );

  it("emails a one-time link that sets a new password and signs out other devices", async () => {
    sent.length = 0;
    const instance = resetAuth();
    const signedUp = await call(instance, "/sign-up/email", { email: "reset@example.kz", password: "old-password-1", name: "reset" });
    const oldCookie = (signedUp.headers.get("set-cookie") ?? "").split(";")[0];

    expect((await call(instance, "/request-password-reset", { email: "reset@example.kz", redirectTo: "/reset-password" })).status).toBe(200);
    expect(sent).toHaveLength(1);
    expect(sent[0].email).toBe("reset@example.kz");
    const token = sent[0].url.split("/reset-password/")[1].split("?")[0];
    expect(token.length).toBeGreaterThan(10);

    expect((await call(instance, "/reset-password", { newPassword: "new-password-2", token })).status).toBe(200);
    expect((await call(instance, "/sign-in/email", { email: "reset@example.kz", password: "old-password-1" })).status).toBe(401);
    expect((await call(instance, "/sign-in/email", { email: "reset@example.kz", password: "new-password-2" })).status).toBe(200);
    expect(await instance.api.getSession({ headers: new Headers({ cookie: oldCookie }) })).toBeNull();
    // The link works once.
    expect((await call(instance, "/reset-password", { newPassword: "third-password-3", token })).status).not.toBe(200);
  });

  it("answers the same for an unknown email and sends nothing", async () => {
    sent.length = 0;
    const response = await call(resetAuth(), "/request-password-reset", { email: "nobody@example.kz", redirectTo: "/reset-password" });
    expect(response.status).toBe(200);
    expect(sent).toHaveLength(0);
  });
});
