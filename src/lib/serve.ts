import { createHash } from "node:crypto";
import { canReadChapter, isFreeChapter, type ReaderAccess } from "./access";
import type { Edition } from "./publish";
import type { License } from "./types";

/** The only gate for reading: a book without a valid permission is never shown or served. */
export function isLicenseValid(license: License, now: Date): boolean {
  if (license.status !== "active") return false;
  if (!license.allows.translation || !license.allows.adaptation) return false;
  if (license.validUntil === null) return true;
  return new Date(license.validUntil).getTime() > now.getTime();
}

export type ChapterResponse =
  | { status: 200; body: string; etag: string }
  | { status: 304; etag: string }
  | { status: 401 | 402 | 404 | 410 }
  | { status: 503; error: unknown };

/** Looks up the signed-in reader and their purchases. Called only for paid chapters. */
export type LoadReader = () => Promise<ReaderAccess | null>;

const etags = new WeakMap<object, { body: string; etag: string }>();

function encode(chapter: object) {
  let entry = etags.get(chapter);
  if (!entry) {
    const body = JSON.stringify(chapter);
    const etag = `"${createHash("sha1").update(body).digest("base64url")}"`;
    entry = { body, etag };
    etags.set(chapter, entry);
  }
  return entry;
}

/**
 * Order matters: license (410) → chapter exists (404) → access (401/402) → cache (304).
 * Access is checked before 304, otherwise a browser holding a cached paid chapter could
 * revalidate it without paying.
 */
export async function serveChapter(
  edition: Edition | undefined,
  chapterNumber: number,
  ifNoneMatch: string | null,
  now: Date,
  loadReader: LoadReader,
): Promise<ChapterResponse> {
  if (!edition) return { status: 404 };
  if (!isLicenseValid(edition.source.license, now)) return { status: 410 };
  const chapter = edition.chapters.find((c) => c.chapter === chapterNumber);
  if (!chapter) return { status: 404 };

  const { paywall, work } = edition.info;
  if (!isFreeChapter(paywall, chapterNumber)) {
    let reader: ReaderAccess | null;
    try {
      reader = await loadReader();
    } catch (error) {
      return { status: 503, error };
    }
    const decision = canReadChapter({ paywall, work, chapter: chapterNumber, reader, now });
    if (decision === "login_required") return { status: 401 };
    if (decision === "payment_required") return { status: 402 };
  }

  const { body, etag } = encode(chapter);
  if (ifNoneMatch === etag) return { status: 304, etag };
  return { status: 200, body, etag };
}

/** Fixed-window limiter per client. In memory is enough for the single-server plan. */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (key: string, nowMs: number): boolean => {
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= nowMs) {
      if (hits.size > 10_000) hits.clear();
      hits.set(key, { count: 1, resetAt: nowMs + windowMs });
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}
