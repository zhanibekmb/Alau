import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getDb, type Database } from "../db";
import * as schema from "../db/schema";

// Sign-up and sign-in with email and password (plan decision D3). Everything stays in our
// own PostgreSQL; no outside service sees the reader's email.

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

/** Attempts per IP per minute. Better Auth reads the IP from x-forwarded-for. */
export const AUTH_ATTEMPTS_PER_MINUTE = 5;

export class MissingAuthSecretError extends Error {
  constructor() {
    super("BETTER_AUTH_SECRET is not set. Add a random value of 32+ characters to .env (see .env.example).");
  }
}

export function createAuth(db: Database, options: { secret: string; baseURL?: string }) {
  return betterAuth({
    database: drizzleAdapter(db, { provider: "pg", schema }),
    secret: options.secret,
    baseURL: options.baseURL,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: PASSWORD_MIN_LENGTH,
      maxPasswordLength: PASSWORD_MAX_LENGTH,
      autoSignIn: true,
    },
    rateLimit: {
      // On in every environment, so tests and local runs behave like production.
      enabled: true,
      window: 60,
      max: 100,
      customRules: {
        "/sign-in/email": { window: 60, max: AUTH_ATTEMPTS_PER_MINUTE },
        "/sign-up/email": { window: 60, max: AUTH_ATTEMPTS_PER_MINUTE },
      },
    },
    // Lets server actions set the session cookie through next/headers.
    plugins: [nextCookies()],
  });
}

export type Auth = ReturnType<typeof createAuth>;

const globalForAuth = globalThis as unknown as { alauAuth?: Auth };

/** The app's auth instance, created on first use (like getDb). */
export function getAuth(): Auth {
  if (!globalForAuth.alauAuth) {
    const secret = process.env.BETTER_AUTH_SECRET;
    if (!secret) throw new MissingAuthSecretError();
    globalForAuth.alauAuth = createAuth(getDb(), { secret, baseURL: process.env.BETTER_AUTH_URL });
  }
  return globalForAuth.alauAuth;
}
