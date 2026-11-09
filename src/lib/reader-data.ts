import { and, eq, inArray, isNull, lt, or, sql } from "drizzle-orm";
import type { Database } from "../db";
import { paywallEvents, readingDays, readingProgress, savedWords } from "../db/schema";
import { mergeProgress, type Progress, type SavedWord } from "./state";
import { foldOps, type ReaderData, type SyncRequest } from "./sync";

// The server side of POST /api/me/sync (docs/paywall-plan.md, T7). One transaction per call:
//
//   lock this reader ─▶ progress: mergeProgress(server row, queued) ─▶ upsert
//                    ─▶ words: removed → delete, saved → insert (an existing row wins, like addWord)
//                    ─▶ reviews: the later answer (reviewed_at) wins
//                    ─▶ reading days: union
//                    ─▶ anonId? → earlier guest paywall events get this user_id (E1B)
//   pull? ─▶ the reader's whole data back

const CHUNK = 1000;

function chunks<T>(items: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += CHUNK) out.push(items.slice(i, i + CHUNK));
  return out;
}

export async function syncReaderData(db: Database, userId: string, request: SyncRequest): Promise<ReaderData | null> {
  const folded = foldOps(request.ops);

  await db.transaction(async (tx) => {
    // Two tabs syncing at once must not interleave their read-merge-write of progress.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${`sync:${userId}`}))`);

    const slugs = Object.keys(folded.progress);
    if (slugs.length > 0) {
      const existing = await tx
        .select()
        .from(readingProgress)
        .where(and(eq(readingProgress.userId, userId), inArray(readingProgress.slug, slugs)));
      const bySlug = new Map(existing.map((row) => [row.slug, toProgress(row)]));
      const rows = slugs.map((slug) => {
        const merged = mergeProgress(bySlug.get(slug), folded.progress[slug]);
        return { userId, slug, ...merged, updatedAt: new Date(merged.updatedAt) };
      });
      for (const part of chunks(rows)) {
        await tx
          .insert(readingProgress)
          .values(part)
          .onConflictDoUpdate({
            target: [readingProgress.userId, readingProgress.slug],
            set: {
              page: sql`excluded.page`,
              totalPages: sql`excluded.total_pages`,
              finished: sql`excluded.finished`,
              updatedAt: sql`excluded.updated_at`,
            },
          });
      }
    }

    const removed = Object.entries(folded.words).filter(([, word]) => word === null).map(([id]) => id);
    for (const part of chunks(removed)) {
      await tx.delete(savedWords).where(and(eq(savedWords.userId, userId), inArray(savedWords.glossId, part)));
    }

    const saved = Object.values(folded.words).filter((word): word is SavedWord => word !== null);
    for (const part of chunks(saved)) {
      await tx
        .insert(savedWords)
        .values(part.map(({ id, savedAt, ...word }) => ({ ...word, userId, glossId: id, savedAt: new Date(savedAt) })))
        .onConflictDoNothing();
    }

    // After the inserts above, so a word saved and reviewed in one batch gets its review.
    for (const [id, review] of Object.entries(folded.reviews)) {
      if (folded.words[id] === null) continue;
      const reviewedAt = new Date(review.reviewedAt);
      await tx
        .update(savedWords)
        .set({ reviewBox: review.box, reviewDue: new Date(review.due), reviewedAt })
        .where(
          and(
            eq(savedWords.userId, userId),
            eq(savedWords.glossId, id),
            or(isNull(savedWords.reviewedAt), lt(savedWords.reviewedAt, reviewedAt)),
          ),
        );
    }

    const days = Object.keys(folded.days);
    for (const part of chunks(days)) {
      await tx.insert(readingDays).values(part.map((day) => ({ userId, day }))).onConflictDoNothing();
    }

    if (request.anonId) {
      await tx
        .update(paywallEvents)
        .set({ userId })
        .where(and(eq(paywallEvents.anonId, request.anonId), isNull(paywallEvents.userId)));
    }
  });

  return request.pull ? loadReaderData(db, userId) : null;
}

export async function loadReaderData(db: Database, userId: string): Promise<ReaderData> {
  const [progressRows, wordRows, dayRows] = await Promise.all([
    db.select().from(readingProgress).where(eq(readingProgress.userId, userId)),
    db.select().from(savedWords).where(eq(savedWords.userId, userId)),
    db.select({ day: readingDays.day }).from(readingDays).where(eq(readingDays.userId, userId)),
  ]);
  return {
    readingDays: Object.fromEntries(dayRows.map((row) => [row.day, true as const])),
    reviews: Object.fromEntries(
      wordRows
        .filter((row) => row.reviewedAt && row.reviewDue)
        .map((row) => [
          row.glossId,
          { box: row.reviewBox, due: row.reviewDue!.getTime(), reviewedAt: row.reviewedAt!.getTime() },
        ]),
    ),
    progress: Object.fromEntries(progressRows.map((row) => [row.slug, toProgress(row)])),
    words: Object.fromEntries(
      wordRows.map((row): [string, SavedWord] => [
        row.glossId,
        {
          id: row.glossId,
          lemma: row.lemma,
          kk: row.kk,
          ipa: row.ipa,
          pos: row.pos,
          slug: row.slug,
          bookTitle: row.bookTitle,
          page: row.page,
          sentence: row.sentence,
          savedAt: row.savedAt.getTime(),
        },
      ]),
    ),
  };
}

function toProgress(row: typeof readingProgress.$inferSelect): Progress {
  return { page: row.page, totalPages: row.totalPages, finished: row.finished, updatedAt: row.updatedAt.getTime() };
}
