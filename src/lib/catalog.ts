import { SOURCE_BOOKS } from "../content/books";
import { IRREGULAR_FORMS, LEXICON } from "../content/lexicon";
import { buildEdition, type Edition } from "./publish";
import { isLicenseValid } from "./serve";
import type { BookInfo } from "./types";

// Built once when the server starts. A word without a translation fails the build.
const EDITIONS: Edition[] = SOURCE_BOOKS.map((source) =>
  buildEdition(source, { lexicon: LEXICON, irregular: IRREGULAR_FORMS }),
);

export const findEdition = (slug: string) => EDITIONS.find((e) => e.source.slug === slug);

export const listAvailableBooks = (now: Date): BookInfo[] =>
  EDITIONS.filter((e) => isLicenseValid(e.source.license, now)).map((e) => e.info);

/** A work that can be bought: all its level slugs and its price. Undefined if nothing is for sale. */
export type PaidWork = { work: string; title: string; priceTenge: number; slugs: string[] };

export function findPaidWork(work: string, editions: Edition[] = EDITIONS): PaidWork | undefined {
  const levels = editions.filter((e) => e.info.work === work && e.info.paywall);
  if (levels.length === 0) return undefined;
  return {
    work,
    title: levels[0].info.title,
    priceTenge: levels[0].info.paywall!.priceTenge,
    slugs: levels.map((e) => e.info.slug),
  };
}

export function findAvailableBook(slug: string, now: Date): BookInfo | null {
  const edition = findEdition(slug);
  return edition && isLicenseValid(edition.source.license, now) ? edition.info : null;
}

/** Every work that can be bought, once each (for the admin's "give access" form). */
export function listPaidWorks(editions: Edition[] = EDITIONS): PaidWork[] {
  const works = [...new Set(editions.filter((e) => e.info.paywall).map((e) => e.info.work))];
  return works.map((work) => findPaidWork(work, editions)!).filter(Boolean);
}
