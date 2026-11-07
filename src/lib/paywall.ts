import { and, eq, gt, ne, sql } from "drizzle-orm";
import type { Database } from "../db";
import { entitlements, paywallEvents } from "../db/schema";
import type { PaymentsMode } from "./payments-mode";
import type { PaywallPlace, PlanChoice } from "./paywall-request";
import { findPremiumPlan, premiumExpiresAt } from "./plans";

// What happens when a reader picks a tariff (docs/paywall-plan.md, "Поток кнопки «Купить»").
//
//   interest ─▶ paywall_events: plan_chosen ─▶ { unlocked: false }
//   demo     ─▶ lock this reader ─▶ already has it? ─ yes ─▶ { unlocked: true }
//                                        │ no
//                                        ▼
//                     entitlements row + paywall_events: demo_unlock ─▶ { unlocked: true }

export type ChoiceResult = { unlocked: boolean };

export async function choosePlan(
  db: Database,
  userId: string,
  choice: PlanChoice,
  mode: PaymentsMode,
  now: Date,
): Promise<ChoiceResult> {
  const event = { userId, anonId: choice.anonId, plan: choice.plan, work: choice.work, slug: choice.slug, chapter: choice.chapter };

  if (mode === "interest") {
    await db.insert(paywallEvents).values({ ...event, type: "plan_chosen", createdAt: now });
    return { unlocked: false };
  }

  await db.transaction(async (tx) => {
    // One purchase at a time per reader, so a double tap cannot create two rows.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${userId}))`);

    if (choice.plan === "single_book") {
      const created = await tx
        .insert(entitlements)
        .values({ userId, kind: "single_book", work: choice.work, source: "demo", startsAt: now })
        .onConflictDoNothing()
        .returning({ id: entitlements.id });
      if (created.length > 0) await tx.insert(paywallEvents).values({ ...event, type: "demo_unlock", createdAt: now });
      return;
    }

    const plan = findPremiumPlan(choice.plan);
    if (!plan) throw new Error(`unknown premium plan ${choice.plan}`);
    const active = await tx
      .select({ id: entitlements.id })
      .from(entitlements)
      .where(and(eq(entitlements.userId, userId), ne(entitlements.kind, "single_book"), gt(entitlements.expiresAt, now)))
      .limit(1);
    if (active.length > 0) return;
    await tx.insert(entitlements).values({
      userId,
      kind: plan.kind,
      source: "demo",
      startsAt: now,
      expiresAt: premiumExpiresAt(plan, now),
    });
    await tx.insert(paywallEvents).values({ ...event, type: "demo_unlock", createdAt: now });
  });
  return { unlocked: true };
}

/** A reader (signed in or not) saw the paywall. */
export async function recordPaywallShown(db: Database, userId: string | null, place: PaywallPlace, now: Date): Promise<void> {
  await db.insert(paywallEvents).values({
    userId,
    anonId: place.anonId,
    type: "paywall_shown",
    work: place.work,
    slug: place.slug,
    chapter: place.chapter,
    createdAt: now,
  });
}
