import { and, desc, eq, gt, inArray, isNotNull, ne, sql } from "drizzle-orm";
import type { Database } from "../db";
import { entitlements, paywallEvents, user } from "../db/schema";
import type { EntitlementKind } from "./access";
import { findPremiumPlan, premiumExpiresAt } from "./plans";

// Access given by hand on /admin/paywall: free access for testers, or access paid by transfer.
// Same table and rules as the demo purchase (src/lib/paywall.ts), with source "manual".
//
//   single_book ─▶ one row per reader and work (a second grant changes nothing)
//   premium     ─▶ starts when the current premium ends, so a grant always adds its full term

export type GrantResult = "granted" | "extended" | "already";

export async function findUserByEmail(db: Database, email: string) {
  const [found] = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.email, email.trim().toLowerCase()))
    .limit(1);
  return found ?? null;
}

export async function grantAccess(
  db: Database,
  input: { userId: string; kind: EntitlementKind; work: string | null; now: Date },
): Promise<GrantResult> {
  const { userId, kind, work, now } = input;
  return db.transaction(async (tx) => {
    // Same per-reader lock as a demo purchase, so the two never race.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${userId}))`);

    if (kind === "single_book") {
      if (!work) throw new Error("a book grant needs a work");
      const created = await tx
        .insert(entitlements)
        .values({ userId, kind, work, source: "manual", startsAt: now })
        .onConflictDoNothing()
        .returning({ id: entitlements.id });
      return created.length > 0 ? "granted" : "already";
    }

    const plan = findPremiumPlan(kind);
    if (!plan) throw new Error(`unknown premium plan ${kind}`);
    const [current] = await tx
      .select({ expiresAt: entitlements.expiresAt })
      .from(entitlements)
      .where(and(eq(entitlements.userId, userId), ne(entitlements.kind, "single_book"), gt(entitlements.expiresAt, now)))
      .orderBy(desc(entitlements.expiresAt))
      .limit(1);
    const start = current?.expiresAt ?? now;
    await tx.insert(entitlements).values({
      userId,
      kind: plan.kind,
      source: "manual",
      startsAt: start,
      expiresAt: premiumExpiresAt(plan, start),
    });
    return current ? "extended" : "granted";
  });
}

/** Access the admin may take back: given by hand, or from the demo paywall. Real purchases never. */
const REVOCABLE = ["demo", "manual"] as const;

export type ManualGrant = {
  id: string;
  source: (typeof REVOCABLE)[number];
  email: string;
  kind: EntitlementKind;
  work: string | null;
  startsAt: Date;
  expiresAt: Date | null;
  createdAt: Date;
};

/** The latest hand-given and demo access, newest first, for the admin table. */
export async function listManualGrants(db: Database, limit = 100): Promise<ManualGrant[]> {
  return db
    .select({
      id: entitlements.id,
      source: entitlements.source,
      email: user.email,
      kind: entitlements.kind,
      work: entitlements.work,
      startsAt: entitlements.startsAt,
      expiresAt: entitlements.expiresAt,
      createdAt: entitlements.createdAt,
    })
    .from(entitlements)
    .innerJoin(user, eq(user.id, entitlements.userId))
    .where(inArray(entitlements.source, [...REVOCABLE]))
    .orderBy(desc(entitlements.createdAt))
    .limit(limit);
}

/** Removes one hand-given or demo access. */
export async function revokeGrant(db: Database, id: string): Promise<boolean> {
  const removed = await db
    .delete(entitlements)
    .where(and(eq(entitlements.id, id), inArray(entitlements.source, [...REVOCABLE])))
    .returning({ id: entitlements.id });
  return removed.length > 0;
}

export type PlanRequest = {
  userId: string;
  email: string;
  plan: EntitlementKind;
  work: string | null;
  at: Date;
  /** The reader can already read what they asked for (given by hand, or bought). */
  granted: boolean;
};

/**
 * Readers who chose a tariff (plan_chosen events), newest first, one row per reader and tariff.
 * In PAYMENTS_MODE=transfer these are the people who may have sent money.
 */
export async function listPlanRequests(db: Database, now: Date, limit = 50): Promise<PlanRequest[]> {
  const events = await db
    .select({
      userId: paywallEvents.userId,
      email: user.email,
      plan: paywallEvents.plan,
      work: paywallEvents.work,
      at: paywallEvents.createdAt,
    })
    .from(paywallEvents)
    .innerJoin(user, eq(user.id, paywallEvents.userId))
    .where(and(eq(paywallEvents.type, "plan_chosen"), isNotNull(paywallEvents.plan)))
    .orderBy(desc(paywallEvents.createdAt))
    .limit(limit * 4);

  const seen = new Set<string>();
  const latest = events.filter((e) => {
    // A book request is per work; premium requests are the same whichever book they came from.
    const key = `${e.userId}|${e.plan}|${e.plan === "single_book" ? e.work : ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);

  const userIds = [...new Set(latest.map((e) => e.userId!))];
  const owned =
    userIds.length === 0
      ? []
      : await db
          .select({ userId: entitlements.userId, kind: entitlements.kind, work: entitlements.work, expiresAt: entitlements.expiresAt })
          .from(entitlements)
          .where(inArray(entitlements.userId, userIds));

  return latest.map((e) => {
    const mine = owned.filter((o) => o.userId === e.userId);
    const premium = mine.some((o) => o.kind !== "single_book" && o.expiresAt !== null && o.expiresAt > now);
    const book = e.plan === "single_book" && mine.some((o) => o.kind === "single_book" && o.work === e.work);
    return {
      userId: e.userId!,
      email: e.email,
      plan: e.plan!,
      work: e.plan === "single_book" ? e.work : null,
      at: e.at,
      granted: premium || book,
    };
  });
}
