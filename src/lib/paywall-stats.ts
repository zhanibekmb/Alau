import { sql } from "drizzle-orm";
import type { Database } from "../db";
import { paywallEvents } from "../db/schema";
import type { EntitlementKind } from "./access";

// Numbers for /admin/paywall (docs/paywall-plan.md, "Наблюдаемость").
//
// A person is the user id, or the guest's anon id before sign-in. Sign-in links a guest's
// events to the account (E1B), so one reader is counted once across both.
// "Chose a tariff" is plan_chosen (interest mode) or demo_unlock (demo mode).

export type PaywallStats = {
  shown: { people: number; events: number };
  chose: { people: number; events: number };
  /** chose.people / shown.people; null when nobody saw the paywall. */
  rate: number | null;
  signups: number;
  byPlan: { plan: EntitlementKind; people: number }[];
  byBook: { slug: string; shown: number; chose: number; rate: number | null }[];
};

const PLANS: EntitlementKind[] = ["single_book", "premium_monthly", "premium_annual"];
const person = sql`coalesce(${paywallEvents.userId}, ${paywallEvents.anonId})`;
const kind = sql`case when ${paywallEvents.type} in ('plan_chosen', 'demo_unlock') then 'chose' else ${paywallEvents.type}::text end`;
const rate = (chose: number, shown: number) => (shown > 0 ? chose / shown : null);

export async function loadPaywallStats(db: Database, since: Date): Promise<PaywallStats> {
  const after = sql`${paywallEvents.createdAt} >= ${since.toISOString()}`;
  const [totals, plans, books] = await Promise.all([
    db.execute<{ kind: string; events: number; people: number }>(sql`
      select ${kind} as kind, count(*)::int as events, count(distinct ${person})::int as people
      from ${paywallEvents} where ${after} group by 1`),
    db.execute<{ plan: EntitlementKind; people: number }>(sql`
      select ${paywallEvents.plan} as plan, count(distinct ${person})::int as people
      from ${paywallEvents}
      where ${after} and ${paywallEvents.type} in ('plan_chosen', 'demo_unlock') and ${paywallEvents.plan} is not null
      group by 1`),
    db.execute<{ slug: string; kind: string; people: number }>(sql`
      select ${paywallEvents.slug} as slug, ${kind} as kind, count(distinct ${person})::int as people
      from ${paywallEvents}
      where ${after} and ${paywallEvents.slug} is not null and ${paywallEvents.type} <> 'signup'
      group by 1, 2`),
  ]);

  const total = (k: string) => totals.rows.find((row) => row.kind === k) ?? { events: 0, people: 0 };
  const shown = total("paywall_shown");
  const chose = total("chose");

  const bySlug = new Map<string, { shown: number; chose: number }>();
  for (const row of books.rows) {
    const entry = bySlug.get(row.slug) ?? { shown: 0, chose: 0 };
    if (row.kind === "paywall_shown") entry.shown = row.people;
    if (row.kind === "chose") entry.chose = row.people;
    bySlug.set(row.slug, entry);
  }

  return {
    shown: { people: shown.people, events: shown.events },
    chose: { people: chose.people, events: chose.events },
    rate: rate(chose.people, shown.people),
    signups: total("signup").events,
    byPlan: PLANS.map((plan) => ({ plan, people: plans.rows.find((row) => row.plan === plan)?.people ?? 0 })),
    byBook: [...bySlug.entries()]
      .map(([slug, n]) => ({ slug, ...n, rate: rate(n.chose, n.shown) }))
      .sort((a, b) => b.shown - a.shown || a.slug.localeCompare(b.slug)),
  };
}
