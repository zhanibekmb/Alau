import { and, eq } from "drizzle-orm";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getDb, type Database } from "../db";
import * as schema from "../db/schema";
import { passwordResetMail, sendMail, verificationMail } from "./mail";

// Sign-up and sign-in with email and password (plan decision D3), or with Google when its keys
// are set. Accounts live in our own PostgreSQL; Brevo sees an email only when it sends a link.

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

/** Attempts per IP per minute. Better Auth reads the IP from x-forwarded-for. */
export const AUTH_ATTEMPTS_PER_MINUTE = 5;

export class MissingAuthSecretError extends Error {
  constructor() {
    super("BETTER_AUTH_SECRET is not set. Add a random value of 32+ characters to .env (see .env.example).");
  }
}

export type ResetEmailSender = (data: { email: string; url: string }) => Promise<void>;

/** Sends the reset link by email (src/lib/mail.ts). Tests pass their own sender instead. */
const sendResetEmail: ResetEmailSender = ({ email, url }) => sendMail(passwordResetMail(email, url));

/** Sends the "confirm your email" link (src/lib/mail.ts). */
const sendVerifyEmail: ResetEmailSender = ({ email, url }) => sendMail(verificationMail(email, url));

export type GoogleCredentials = { clientId: string; clientSecret: string };

/** Google sign-in is on only when both keys are in .env (Google Cloud Console → Credentials). */
export function googleCredentials(env: NodeJS.ProcessEnv = process.env): GoogleCredentials | null {
  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_CLIENT_SECRET?.trim();
  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

/**
 * Google has just proved that the reader owns this email. If an account with it was never
 * confirmed, its password may have been typed by someone else, so the password and any
 * sessions go, and the email counts as confirmed. A confirmed account is left as it is.
 */
export async function claimUnverifiedAccount(db: Database, userId: string): Promise<void> {
  await db.transaction(async (tx) => {
    const [row] = await tx.select({ verified: schema.user.emailVerified }).from(schema.user).where(eq(schema.user.id, userId));
    if (!row || row.verified) return;
    await tx.delete(schema.account).where(and(eq(schema.account.userId, userId), eq(schema.account.providerId, "credential")));
    await tx.delete(schema.session).where(eq(schema.session.userId, userId));
    await tx.update(schema.user).set({ emailVerified: true }).where(eq(schema.user.id, userId));
  });
}

export function createAuth(
  db: Database,
  options: {
    secret: string;
    baseURL?: string;
    google?: GoogleCredentials | null;
    sendResetEmail?: ResetEmailSender;
    sendVerificationEmail?: ResetEmailSender;
    /** On by default: a new account cannot sign in until its email is confirmed. Tests may turn it off. */
    requireEmailVerification?: boolean;
  },
) {
  const sendReset = options.sendResetEmail ?? sendResetEmail;
  const sendVerify = options.sendVerificationEmail ?? sendVerifyEmail;
  const requireEmailVerification = options.requireEmailVerification ?? true;
  return betterAuth({
    database: drizzleAdapter(db, { provider: "pg", schema }),
    secret: options.secret,
    baseURL: options.baseURL,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: PASSWORD_MIN_LENGTH,
      maxPasswordLength: PASSWORD_MAX_LENGTH,
      // With verification on, sign-up creates the account but no session: the email link signs in.
      autoSignIn: !requireEmailVerification,
      requireEmailVerification,
      // "Құпиясөзді ұмыттым": a one-hour link by email; a new password signs out every device.
      resetPasswordTokenExpiresIn: 60 * 60,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        await sendReset({ email: user.email, url });
      },
    },
    // Confirms that the email belongs to the reader, so nobody signs up with someone else's address.
    // The link lives 24 hours, signs the reader in and returns them where they started.
    emailVerification: {
      sendOnSignUp: true,
      // A sign-in attempt with an unconfirmed email sends a fresh link.
      sendOnSignIn: true,
      autoSignInAfterVerification: true,
      expiresIn: 24 * 60 * 60,
      sendVerificationEmail: async ({ user, url }) => {
        await sendVerify({ email: user.email, url });
      },
    },
    // "Google арқылы кіру". Google has already confirmed the email, so no link is sent. A reader who
    // signed up with a password and later uses Google with the same email lands in the same account.
    // Linking to an unconfirmed account is allowed too (Better Auth refuses it by default), because
    // the account hook below removes the unconfirmed password first: see claimUnverifiedAccount.
    socialProviders: options.google
      ? { google: { clientId: options.google.clientId, clientSecret: options.google.clientSecret, prompt: "select_account" } }
      : {},
    account: { accountLinking: { enabled: true, trustedProviders: ["google"], requireLocalEmailVerified: false } },
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
    databaseHooks: {
      account: {
        create: {
          after: async (created) => {
            if (created.providerId === "google") await claimUnverifiedAccount(db, created.userId);
          },
        },
      },
      user: {
        create: {
          // Counted on /admin/paywall. The guest's earlier paywall events are linked to this
          // user later, when the browser sends its anon id with the first sync (E1B).
          after: async (created) => {
            try {
              await db.insert(schema.paywallEvents).values({ userId: created.id, type: "signup" });
            } catch (error) {
              console.error("[auth] could not record a signup event:", error);
            }
          },
        },
      },
    },
    // Lets server actions set the session cookie through next/headers.
    plugins: [nextCookies()],
  });
}

export type Auth = ReturnType<typeof createAuth>;

const globalForAuth = globalThis as unknown as { alauAuth?: Auth; alauAuthKey?: string };

/** The app's auth instance, created on first use (like getDb). */
export function getAuth(): Auth {
  const google = googleCredentials();
  // The dev server reloads .env without a restart, but the cached instance would keep the old
  // keys ("Provider not found" after adding Google). Rebuild it when the keys change.
  const key = `${process.env.BETTER_AUTH_URL ?? ""}|${google?.clientId ?? ""}|${google?.clientSecret ?? ""}`;
  if (!globalForAuth.alauAuth || globalForAuth.alauAuthKey !== key) {
    const secret = process.env.BETTER_AUTH_SECRET;
    if (!secret) throw new MissingAuthSecretError();
    globalForAuth.alauAuth = createAuth(getDb(), { secret, baseURL: process.env.BETTER_AUTH_URL, google });
    globalForAuth.alauAuthKey = key;
  }
  return globalForAuth.alauAuth;
}
