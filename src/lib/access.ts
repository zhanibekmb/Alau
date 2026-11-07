import type { PaywallConfig } from "./types";

// Who may read which chapter. Pure: no database, no clock, so every branch is easy to test.
// Plan: docs/paywall-plan.md, "Решение о доступе к главе".
//
//   chapter <= freeChapters, or no paywall ──────────────▶ ok
//   no reader ───────────────────────────────────────────▶ login_required (401)
//   active premium, or this work bought on any level ────▶ ok
//   otherwise ───────────────────────────────────────────▶ payment_required (402)
//
// The license check (410) happens before this, in serveChapter.

export type EntitlementKind = "single_book" | "premium_monthly" | "premium_annual";

/** What the access rule needs from an entitlements row. */
export type Entitlement = { kind: EntitlementKind; work: string | null; expiresAt: Date | null };

/** A signed-in reader and everything they bought. */
export type ReaderAccess = { userId: string; entitlements: Entitlement[] };

export type AccessDecision = "ok" | "login_required" | "payment_required";

/** True when the chapter is free for everyone, so nobody needs to be looked up. */
export function isFreeChapter(paywall: PaywallConfig | null, chapter: number): boolean {
  return paywall === null || chapter <= paywall.freeChapters;
}

/** A book purchase never expires; premium is valid until expiresAt (exclusive). */
export function unlocksWork(entitlement: Entitlement, work: string, now: Date): boolean {
  if (entitlement.kind === "single_book") return entitlement.work === work;
  return entitlement.expiresAt !== null && entitlement.expiresAt.getTime() > now.getTime();
}

export function canReadChapter(input: {
  paywall: PaywallConfig | null;
  work: string;
  chapter: number;
  reader: ReaderAccess | null;
  now: Date;
}): AccessDecision {
  const { paywall, work, chapter, reader, now } = input;
  if (isFreeChapter(paywall, chapter)) return "ok";
  if (!reader) return "login_required";
  return reader.entitlements.some((e) => unlocksWork(e, work, now)) ? "ok" : "payment_required";
}
