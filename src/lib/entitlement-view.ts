import { unlocksWork, type EntitlementKind } from "./access";

/** A purchase as GET /api/me/entitlements sends it to the browser. */
export type EntitlementView = {
  kind: EntitlementKind;
  work: string | null;
  workTitle: string | null;
  /** ISO date; null for a book bought forever. */
  expiresAt: string | null;
  demo: boolean;
  /** Given by an admin on /admin/paywall (tester access or a transfer). */
  manual: boolean;
};

/** Same rule as the server (unlocksWork), applied to what the browser received. */
export function viewUnlocksWork(views: EntitlementView[], work: string, now: Date): boolean {
  return views.some((v) =>
    unlocksWork({ kind: v.kind, work: v.work, expiresAt: v.expiresAt ? new Date(v.expiresAt) : null }, work, now),
  );
}

/** Purchases still in force, for the profile. */
export function activeEntitlements(views: EntitlementView[], now: Date): EntitlementView[] {
  return views.filter((v) => v.kind === "single_book" || (v.expiresAt !== null && new Date(v.expiresAt) > now));
}
