import type { EntitlementKind } from "./access";
import type { PaidWork } from "./catalog";

// Checks what the browser sends to the paywall endpoints. Nothing from the request decides a
// price or a duration: those come from plans.ts and the book itself.

const PLANS: readonly EntitlementKind[] = ["single_book", "premium_monthly", "premium_annual"];
const MAX_ANON_ID = 64;
const MAX_CHAPTER = 1000;

/** Where the reader was when they saw the paywall or chose a plan. */
export type PaywallPlace = { work: string; slug: string; chapter: number; anonId: string | null };
export type PlanChoice = PaywallPlace & { plan: EntitlementKind };

export type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

export function parsePaywallPlace(body: unknown, findWork: (work: string) => PaidWork | undefined): Parsed<PaywallPlace> {
  if (typeof body !== "object" || body === null) return { ok: false, error: "body must be a JSON object" };
  const { work, slug, chapter, anonId } = body as Record<string, unknown>;
  if (typeof work !== "string") return { ok: false, error: "work is required" };
  const paid = findWork(work);
  if (!paid) return { ok: false, error: "this work is not for sale" };
  if (typeof slug !== "string" || !paid.slugs.includes(slug)) return { ok: false, error: "slug does not belong to this work" };
  if (typeof chapter !== "number" || !Number.isInteger(chapter) || chapter < 1 || chapter > MAX_CHAPTER) {
    return { ok: false, error: "chapter must be a whole number" };
  }
  if (anonId !== undefined && anonId !== null && (typeof anonId !== "string" || anonId.length === 0 || anonId.length > MAX_ANON_ID)) {
    return { ok: false, error: "anonId is invalid" };
  }
  return { ok: true, value: { work, slug, chapter, anonId: typeof anonId === "string" ? anonId : null } };
}

export function parsePlanChoice(body: unknown, findWork: (work: string) => PaidWork | undefined): Parsed<PlanChoice> {
  const place = parsePaywallPlace(body, findWork);
  if (!place.ok) return place;
  const { plan } = body as Record<string, unknown>;
  if (typeof plan !== "string" || !PLANS.includes(plan as EntitlementKind)) return { ok: false, error: "unknown plan" };
  return { ok: true, value: { ...place.value, plan: plan as EntitlementKind } };
}
