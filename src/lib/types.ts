export const LEVELS = ["A1", "A2", "B1", "B2"] as const;
export type Level = (typeof LEVELS)[number];

/** CEFR level names in Kazakh, as on the Kazakh language test (Қазтест): A1 is from the Figma design. */
export const LEVEL_TITLES: Record<Level, string> = {
  A1: "Бастауыш",
  A2: "Базалық",
  B1: "Орта",
  B2: "Ортадан жоғары",
};

/** "A1 – Бастауыш" */
export const levelLabel = (level: Level) => `${level} – ${LEVEL_TITLES[level]}`;

export type License = {
  holder: string;
  status: "active" | "revoked";
  /** ISO date, or null when the permission has no end date. */
  validUntil: string | null;
  allows: {
    translation: boolean;
    adaptation: boolean;
    aiProcessing: boolean;
    paidAccess: boolean;
  };
};

/** Colors draw the default cover. `image` is a path in /public and replaces the drawing. */
export type Cover = { sky: string; sun: string; hills: [string, string]; image?: string };

/**
 * Where the free part ends and what the whole work costs (docs/paywall-plan.md, D5 and D9).
 * Chapters 1..freeChapters are free on every level; the price buys all levels of the work.
 */
export type PaywallConfig = { freeChapters: number; priceTenge: number };

export type SourceBook = {
  slug: string;
  /** One story told at several levels shares one work id. A purchase unlocks the whole work. */
  work: string;
  /** No paywall means the whole book is free. */
  paywall?: PaywallConfig;
  title: string;
  author: string;
  level: Level;
  genre: string;
  version: number;
  cover: Cover;
  description: { kk: string; en: string };
  keyWords: string[];
  license: License;
  /** `original` is the chapter in the language the book was written in (Kazakh), shown on request. */
  chapters: { title: string; paragraphs: string[]; original?: string[] }[];
};

export type Gloss = { id: string; lemma: string; kk: string; ipa: string; pos: string };

/** A word carries a gloss id. Punctuation and spaces do not. */
export type Token = { t: string; g?: string; ph?: number };
export type Sentence = { id: string; tokens: Token[] };
export type Paragraph = Sentence[];
export type Page = { number: number; paragraphs: Paragraph[] };

/** The one file a reader downloads for a chapter. A tap needs nothing else. */
export type ChapterFile = {
  slug: string;
  version: number;
  chapter: number;
  title: string;
  pages: Page[];
  glosses: Record<string, Gloss>;
  original?: string[];
};

export type ChapterOutline = { n: number; title: string; firstPage: number; lastPage: number };

/** Everything the UI needs about a book, without its text. */
export type BookInfo = {
  slug: string;
  work: string;
  /**
   * Null when every chapter is free: no paywall configured, or the license does not allow paid access.
   * The server decides access with the same rule (bookPaywall in src/lib/publish.ts).
   */
  paywall: PaywallConfig | null;
  title: string;
  author: string;
  level: Level;
  genre: string;
  cover: Cover;
  minutes: number;
  totalPages: number;
  description: { kk: string; en: string };
  keyWords: { en: string; kk: string }[];
  chapters: ChapterOutline[];
};

export const POS_LABELS: Record<string, string> = {
  n: "зат есім",
  v: "етістік",
  adj: "сын есім",
  adv: "үстеу",
  prep: "септеулік",
  conj: "шылау",
  pron: "есімдік",
  det: "анықтауыш",
  num: "сан есім",
  name: "жалқы есім",
  phr: "тұрақты тіркес",
};
