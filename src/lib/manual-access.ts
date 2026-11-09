import { and, desc, eq, gt, inArray, ne, sql } from "drizzle-orm";
import type { Database } from "../db";
import { entitlements, user } from "../db/schema";
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
