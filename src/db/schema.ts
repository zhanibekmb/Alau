import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export * from "./auth-schema";

// Reader data. Plan: docs/paywall-plan.md, section "Данные".
//
//   user ─┬─< entitlements     what a reader may read (demo now, Kaspi later)
//         ├─< paywall_events   what readers did at the paywall (user or anonymous)
//         ├─< reading_progress one row per book level the reader opened
//         ├─< saved_words      one row per saved word meaning, with its review box
//         └─< reading_days     one row per local date with reading (the streak)

/** single_book never expires; premium has expires_at. */
export const entitlementKind = pgEnum("entitlement_kind", ["single_book", "premium_monthly", "premium_annual"]);
/** Where the access came from. Only "demo" exists until real payments. */
export const entitlementSource = pgEnum("entitlement_source", ["demo"]);
export const paywallEventType = pgEnum("paywall_event_type", ["paywall_shown", "plan_chosen", "signup", "demo_unlock"]);

const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();

export const entitlements = pgTable(
  "entitlements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: entitlementKind("kind").notNull(),
    /** The work (all levels of one story) for single_book; null for premium. */
    work: text("work"),
    source: entitlementSource("source").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).defaultNow().notNull(),
    /** Null means it never expires. */
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (table) => [
    index("entitlements_user_idx").on(table.userId),
    // A second tap on "buy this book" must not create a second row.
    uniqueIndex("entitlements_one_book_per_user").on(table.userId, table.work).where(sql`${table.kind} = 'single_book'`),
    // A book purchase names its work and never expires; premium covers every work and expires.
    check(
      "entitlements_kind_shape",
      sql`(${table.kind} = 'single_book' AND ${table.work} IS NOT NULL AND ${table.expiresAt} IS NULL)
        OR (${table.kind} <> 'single_book' AND ${table.work} IS NULL AND ${table.expiresAt} IS NOT NULL)`,
    ),
  ],
);

export const paywallEvents = pgTable(
  "paywall_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    /** Filled at sign-in for a guest's earlier events (decision E1B). */
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    /** Random id kept in the guest's browser. */
    anonId: text("anon_id"),
    type: paywallEventType("type").notNull(),
    plan: entitlementKind("plan"),
    work: text("work"),
    slug: text("slug"),
    chapter: integer("chapter"),
    createdAt: createdAt(),
  },
  (table) => [
    index("paywall_events_type_time_idx").on(table.type, table.createdAt),
    index("paywall_events_anon_idx").on(table.anonId),
  ],
);

export const readingProgress = pgTable(
  "reading_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    page: integer("page").notNull(),
    totalPages: integer("total_pages").notNull(),
    finished: boolean("finished").default(false).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.slug] })],
);

/** Mirrors SavedWord in src/lib/state.ts; gloss_id is the lexicon key. */
export const savedWords = pgTable(
  "saved_words",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    glossId: text("gloss_id").notNull(),
    lemma: text("lemma").notNull(),
    kk: text("kk").notNull(),
    ipa: text("ipa").notNull(),
    pos: text("pos").notNull(),
    slug: text("slug").notNull(),
    bookTitle: text("book_title").notNull(),
    page: integer("page").notNull(),
    sentence: text("sentence").notNull(),
    savedAt: timestamp("saved_at", { withTimezone: true }).notNull(),
    /** Leitner box 0..5 (src/lib/review.ts). Null review times mean never reviewed. */
    reviewBox: integer("review_box").default(0).notNull(),
    reviewDue: timestamp("review_due", { withTimezone: true }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.glossId] })],
);

/** A day is the reader's local calendar date ("2026-11-09"), as their browser sees it. */
export const readingDays = pgTable(
  "reading_days",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    day: date("day", { mode: "string" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.day] })],
);
