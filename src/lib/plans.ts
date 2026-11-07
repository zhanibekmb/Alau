import type { EntitlementKind } from "./access";

// The tariffs on the paywall (docs/paywall-plan.md, "Тарифы на экране").
// A single book's price lives on the book (SourceBook.paywall.priceTenge); premium prices live here.
// The server always takes prices and durations from this file, never from the request.

export type PremiumPlan = {
  kind: Exclude<EntitlementKind, "single_book">;
  title: string;
  priceTenge: number;
  /** How long one purchase lasts. */
  days: number;
  note: string;
};

export const PREMIUM_PLANS: readonly PremiumPlan[] = [
  { kind: "premium_monthly", title: "Alau Premium", priceTenge: 1490, days: 30, note: "Барлық кітап, 30 күн" },
  { kind: "premium_annual", title: "Alau Premium · жыл", priceTenge: 11900, days: 365, note: "Айына шамамен 990 ₸" },
];

export const SINGLE_BOOK_TITLE = "Осы кітап";

const DAY_MS = 24 * 60 * 60 * 1000;

/** When a premium purchase made at `start` stops working. */
export function premiumExpiresAt(plan: PremiumPlan, start: Date): Date {
  return new Date(start.getTime() + plan.days * DAY_MS);
}

export function findPremiumPlan(kind: string): PremiumPlan | undefined {
  return PREMIUM_PLANS.find((p) => p.kind === kind);
}
