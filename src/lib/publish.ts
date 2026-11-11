import type {
  BookInfo,
  ChapterFile,
  Gloss,
  Page,
  Paragraph,
  PaywallConfig,
  Sentence,
  SourceBook,
  Token,
} from "./types";
import { GIFT_CHAPTERS } from "./access";

/** Words that never open a translation, so they do not need one. */
const NO_GLOSS = new Set(["a", "an", "the", "to", "of"]);

/** Pages are counted by text volume, so "4/9" means the same on every screen. */
export const WORDS_PER_PAGE = 75;
const READING_WORDS_PER_MINUTE = 80;

export type Dictionary = {
  lexicon: Record<string, string>;
  irregular: Record<string, string>;
};

export class MissingGlossError extends Error {
  constructor(public readonly words: string[]) {
    super(`Words without a translation: ${words.join(", ")}`);
  }
}

export function resolveLemma(word: string, { lexicon, irregular }: Dictionary): string | null {
  const w = word.toLowerCase().replace(/’/g, "'").replace(/'s$/, "").replace(/s'$/, "s");
  const has = (key: string): boolean => Object.hasOwn(lexicon, key);

  if (has(w)) return w;
  if (Object.hasOwn(irregular, w) && has(irregular[w])) return irregular[w];

  const candidates: string[] = [];
  if (w.endsWith("ies")) candidates.push(`${w.slice(0, -3)}y`);
  if (w.endsWith("es")) candidates.push(w.slice(0, -2));
  if (w.endsWith("s")) candidates.push(w.slice(0, -1));
  if (w.endsWith("ied")) candidates.push(`${w.slice(0, -3)}y`);
  if (w.endsWith("ed")) {
    const stem = w.slice(0, -2);
    candidates.push(stem, `${stem}e`, stem.slice(0, -1));
  }
  if (w.endsWith("ing")) {
    const stem = w.slice(0, -3);
    candidates.push(stem, `${stem}e`, stem.slice(0, -1));
  }
  return candidates.find(has) ?? null;
}

function parseGloss(key: string, lexicon: Record<string, string>): Gloss {
  const [kk, ipa, pos] = lexicon[key].split("|");
  return { id: key, lemma: key.split(":")[0], kk, ipa, pos };
}

const MARKUP = /\{([^|}]+)\|([^}]+)\}/g;
// Latin letters with accents count as letters, so "fouetté" stays one word.
const WORD = /[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’-][A-Za-zÀ-ÖØ-öø-ÿ]+)*/g;

type Context = {
  dictionary: Dictionary;
  glosses: Record<string, Gloss>;
  missing: Set<string>;
  nextPhrase: number;
};

function includeGloss(key: string, ctx: Context): void {
  if (!ctx.glosses[key]) ctx.glosses[key] = parseGloss(key, ctx.dictionary.lexicon);
}

function tokenizePlain(text: string, ctx: Context): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const match of text.matchAll(WORD)) {
    if (match.index > last) tokens.push({ t: text.slice(last, match.index) });
    const word = match[0];
    last = match.index + word.length;
    if (NO_GLOSS.has(word.toLowerCase())) {
      tokens.push({ t: word });
      continue;
    }
    const lemma = resolveLemma(word, ctx.dictionary);
    if (lemma) {
      includeGloss(lemma, ctx);
      tokens.push({ t: word, g: lemma });
    } else {
      ctx.missing.add(word.toLowerCase());
      tokens.push({ t: word });
    }
  }
  if (last < text.length) tokens.push({ t: text.slice(last) });
  return tokens;
}

function tokenizeMarked(surface: string, key: string, ctx: Context): Token[] {
  if (!Object.hasOwn(ctx.dictionary.lexicon, key)) {
    ctx.missing.add(`{${surface}|${key}}`);
    return [{ t: surface }];
  }
  includeGloss(key, ctx);
  const isPhrase = /\s/.test(surface.trim());
  const ph = isPhrase ? ctx.nextPhrase++ : undefined;
  return surface.split(/(\s+)/).map((part) =>
    /^\s+$/.test(part) ? { t: part } : { t: part, g: key, ...(isPhrase ? { ph } : {}) },
  );
}

export function tokenize(text: string, ctx: Context): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const match of text.matchAll(MARKUP)) {
    tokens.push(...tokenizePlain(text.slice(last, match.index), ctx));
    tokens.push(...tokenizeMarked(match[1], match[2], ctx));
    last = match.index + match[0].length;
  }
  tokens.push(...tokenizePlain(text.slice(last), ctx));
  return tokens;
}

/** Sense keys use ":", never ".", so a full stop always ends a sentence. */
export function splitSentences(paragraph: string): string[] {
  return paragraph.match(/[^.!?]+[.!?]*["”]?\s*/g) ?? [];
}

const wordCount = (tokens: Token[]) => tokens.filter((t) => /[A-Za-z]/.test(t.t)).length;

export function paginate(paragraphs: Paragraph[], firstPage: number, perPage = WORDS_PER_PAGE): Page[] {
  const pages: Page[] = [];
  let current: Paragraph[] = [];
  let words = 0;

  const flush = () => {
    if (current.length) pages.push({ number: firstPage + pages.length, paragraphs: current });
    current = [];
    words = 0;
  };

  for (const paragraph of paragraphs) {
    let open: Sentence[] = [];
    for (const sentence of paragraph) {
      const size = wordCount(sentence.tokens);
      if (words > 0 && words + size > perPage) {
        if (open.length) current.push(open);
        open = [];
        flush();
      }
      open.push(sentence);
      words += size;
    }
    if (open.length) current.push(open);
  }
  flush();
  return pages;
}

export type Edition = { info: BookInfo; source: SourceBook; chapters: ChapterFile[] };

export class InvalidPaywallError extends Error {}

/**
 * The paywall that applies to a book, or null when every chapter is free.
 * The reader UI (BookInfo.paywall) and the server's access check both use this, so they always agree.
 */
export function bookPaywall(source: SourceBook): PaywallConfig | null {
  if (!source.paywall || !source.license.allows.paidAccess) return null;
  return source.paywall;
}

function checkPaywall(source: SourceBook): void {
  const { paywall, chapters, slug } = source;
  if (!source.work.trim()) throw new InvalidPaywallError(`${slug}: work is empty`);
  if (!paywall) return;
  const { freeChapters, priceTenge } = paywall;
  // After the free part and the sign-up gift (GIFT_CHAPTERS), at least one chapter must stay paid.
  const maxFree = chapters.length - 1 - GIFT_CHAPTERS;
  if (!Number.isInteger(freeChapters) || freeChapters < 1 || freeChapters > maxFree) {
    throw new InvalidPaywallError(
      `${slug}: freeChapters must leave at least one free chapter, ${GIFT_CHAPTERS} gift chapter(s) for an account and one paid chapter (1..${maxFree}), got ${freeChapters}`,
    );
  }
  if (!Number.isInteger(priceTenge) || priceTenge <= 0) {
    throw new InvalidPaywallError(`${slug}: priceTenge must be a positive whole number, got ${priceTenge}`);
  }
}

/** Builds the chapter files. Throws if any meaningful word has no translation. */
export function buildEdition(source: SourceBook, dictionary: Dictionary): Edition {
  checkPaywall(source);
  const missing = new Set<string>();
  const chapters: ChapterFile[] = [];
  let nextPage = 1;
  let totalWords = 0;

  source.chapters.forEach((chapter, index) => {
    const ctx: Context = { dictionary, glosses: {}, missing, nextPhrase: 0 };
    const n = index + 1;
    let sentenceIndex = 0;
    const paragraphs: Paragraph[] = chapter.paragraphs.map((text) =>
      splitSentences(text).map((raw) => {
        const tokens = tokenize(raw, ctx);
        totalWords += wordCount(tokens);
        return { id: `c${n}-s${sentenceIndex++}`, tokens };
      }),
    );
    const pages = paginate(paragraphs, nextPage);
    nextPage += pages.length;
    chapters.push({
      slug: source.slug,
      version: source.version,
      chapter: n,
      title: chapter.title,
      pages,
      glosses: ctx.glosses,
      ...(chapter.original ? { original: chapter.original } : {}),
    });
  });

  for (const key of source.keyWords) {
    if (!Object.hasOwn(dictionary.lexicon, key)) missing.add(`keyword:${key}`);
  }
  if (missing.size > 0) throw new MissingGlossError([...missing].sort());

  const info: BookInfo = {
    slug: source.slug,
    work: source.work,
    paywall: bookPaywall(source),
    title: source.title,
    author: source.author,
    level: source.level,
    genre: source.genre,
    cover: source.cover,
    description: source.description,
    minutes: Math.max(1, Math.ceil(totalWords / READING_WORDS_PER_MINUTE)),
    totalPages: nextPage - 1,
    keyWords: source.keyWords.map((key) => {
      const gloss = parseGloss(key, dictionary.lexicon);
      return { en: gloss.lemma, kk: gloss.kk };
    }),
    chapters: chapters.map((c) => ({
      n: c.chapter,
      title: c.title,
      firstPage: c.pages[0].number,
      lastPage: c.pages[c.pages.length - 1].number,
    })),
  };

  return { info, source, chapters };
}
