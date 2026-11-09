import { and, desc, eq, gt, inArray, ne, sql } from "drizzle-orm";
import type { Database } from "../db";
import { entitlements, paywallEvents, readingProgress, savedWords, user } from "../db/schema";
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

/** Removes one hand-given or demo access. */
export async function revokeGrant(db: Database, id: string): Promise<boolean> {
  const removed = await db
    .delete(entitlements)
    .where(and(eq(entitlements.id, id), inArray(entitlements.source, [...REVOCABLE])))
    .returning({ id: entitlements.id });
  return removed.length > 0;
}

// ---- Admin lists: search by email, filters, 25 rows a page (the database does the paging). ----

export const PAGE_SIZE = 25;

export type Page<T> = { rows: T[]; total: number; page: number; pages: number };

/** "%text%" for ILIKE, with %, _ and \ in the search taken literally. */
function likePattern(query: string): string {
  return `%${query.trim().toLowerCase().replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

function paged<T>(rows: (T & { total: number })[], page: number): Page<T> {
  const total = rows[0]?.total ?? 0;
  return {
    rows: rows.map((row) => {
      const copy: Partial<T & { total: number }> = { ...row };
      delete copy.total;
      return copy as T;
    }),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

const offset = (page: number) => (Math.max(1, page) - 1) * PAGE_SIZE;

export type PlanRequest = {
  userId: string;
  email: string;
  plan: EntitlementKind;
  work: string | null;
  at: Date;
  /** The reader can already read what they asked for (given by hand, or bought). */
  granted: boolean;
};

export type RequestFilter = { query?: string; status?: "pending" | "granted" | "all"; page?: number; now: Date };

/**
 * Readers who chose a tariff (plan_chosen events), newest first, one row per reader and tariff
 * (a book request per work; premium the same whichever book it came from).
 * In PAYMENTS_MODE=transfer these are the people who may have sent money.
 */
export async function listPlanRequests(db: Database, filter: RequestFilter): Promise<Page<PlanRequest>> {
  const page = Math.max(1, filter.page ?? 1);
  const status = filter.status ?? "all";
  const query = filter.query?.trim() ?? "";
  const { rows } = await db.execute<PlanRequest & { total: number }>(sql`
    with latest as (
      select distinct on (e.user_id, e.plan, case when e.plan = 'single_book' then e.work end)
        e.user_id, e.plan, case when e.plan = 'single_book' then e.work end as work, e.created_at
      from ${paywallEvents} e
      where e.type = 'plan_chosen' and e.plan is not null and e.user_id is not null
      order by e.user_id, e.plan, case when e.plan = 'single_book' then e.work end, e.created_at desc
    ),
    marked as (
      select l.user_id, l.plan, l.work, l.created_at, u.email,
        exists (
          select 1 from ${entitlements} x
          where x.user_id = l.user_id
            and ((x.kind <> 'single_book' and x.expires_at > ${filter.now.toISOString()})
              or (l.plan = 'single_book' and x.kind = 'single_book' and x.work = l.work))
        ) as granted
      from latest l join ${user} u on u.id = l.user_id
      where ${query === "" ? sql`true` : sql`u.email ilike ${likePattern(query)}`}
    )
    select user_id as "userId", email, plan, work, created_at as "at", granted, count(*) over()::int as total
    from marked
    where ${status === "pending" ? sql`not granted` : status === "granted" ? sql`granted` : sql`true`}
    order by created_at desc
    limit ${PAGE_SIZE} offset ${offset(page)}
  `);
  return paged(
    rows.map((r) => ({ ...r, at: new Date(r.at) })),
    page,
  );
}

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

export type GrantFilter = {
  query?: string;
  source?: "manual" | "demo" | "all";
  status?: "active" | "expired" | "all";
  page?: number;
  now: Date;
};

/** Hand-given and demo access, newest first. */
export async function listManualGrants(db: Database, filter: GrantFilter): Promise<Page<ManualGrant>> {
  const page = Math.max(1, filter.page ?? 1);
  const query = filter.query?.trim() ?? "";
  const source = filter.source && filter.source !== "all" ? [filter.source] : [...REVOCABLE];
  const active = sql`(${entitlements.kind} = 'single_book' or ${entitlements.expiresAt} > ${filter.now.toISOString()})`;
  const rows = await db
    .select({
      id: entitlements.id,
      source: entitlements.source,
      email: user.email,
      kind: entitlements.kind,
      work: entitlements.work,
      startsAt: entitlements.startsAt,
      expiresAt: entitlements.expiresAt,
      createdAt: entitlements.createdAt,
      total: sql<number>`count(*) over()::int`,
    })
    .from(entitlements)
    .innerJoin(user, eq(user.id, entitlements.userId))
    .where(
      and(
        inArray(entitlements.source, source),
        query === "" ? undefined : sql`${user.email} ilike ${likePattern(query)}`,
        filter.status === "active" ? active : filter.status === "expired" ? sql`not ${active}` : undefined,
      ),
    )
    .orderBy(desc(entitlements.createdAt))
    .limit(PAGE_SIZE)
    .offset(offset(page));
  return paged(rows as (ManualGrant & { total: number })[], page);
}

export type Reader = {
  id: string;
  email: string;
  createdAt: Date;
  /** End of the latest active premium, if any. */
  premiumUntil: Date | null;
  books: number;
  words: number;
  lastRead: Date | null;
};

export type ReaderFilter = { query?: string; access?: "paid" | "free" | "all"; page?: number; now: Date };

/** Every account, newest first, with what it can read and how active it is. */
export async function listReaders(db: Database, filter: ReaderFilter): Promise<Page<Reader>> {
  const page = Math.max(1, filter.page ?? 1);
  const query = filter.query?.trim() ?? "";
  const now = filter.now.toISOString();
  const { rows } = await db.execute<Reader & { total: number }>(sql`
    with readers as (
      select u.id, u.email, u.created_at,
        (select max(x.expires_at) from ${entitlements} x
          where x.user_id = u.id and x.kind <> 'single_book' and x.expires_at > ${now}) as premium_until,
        (select count(*)::int from ${entitlements} x where x.user_id = u.id and x.kind = 'single_book') as books,
        (select count(*)::int from ${savedWords} w where w.user_id = u.id) as words,
        (select max(p.updated_at) from ${readingProgress} p where p.user_id = u.id) as last_read
      from ${user} u
      where ${query === "" ? sql`true` : sql`u.email ilike ${likePattern(query)}`}
    )
    select id, email, created_at as "createdAt", premium_until as "premiumUntil", books, words,
      last_read as "lastRead", count(*) over()::int as total
    from readers
    where ${
      filter.access === "paid"
        ? sql`premium_until is not null or books > 0`
        : filter.access === "free"
          ? sql`premium_until is null and books = 0`
          : sql`true`
    }
    order by created_at desc
    limit ${PAGE_SIZE} offset ${offset(page)}
  `);
  const date = (v: Date | string | null) => (v === null ? null : new Date(v));
  return paged(
    rows.map((r) => ({ ...r, createdAt: new Date(r.createdAt), premiumUntil: date(r.premiumUntil), lastRead: date(r.lastRead) })),
    page,
  );
}
