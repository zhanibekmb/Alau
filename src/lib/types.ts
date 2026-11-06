export const LEVELS = ["A1", "A2", "B1", "B2"] as const;
export type Level = (typeof LEVELS)[number];

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

export type Cover = { sky: string; sun: string; hills: [string, string] };

export type SourceBook = {
  slug: string;
  title: string;
  author: string;
  level: Level;
  genre: string;
  version: number;
  cover: Cover;
  description: { kk: string; en: string };
  keyWords: string[];
  license: License;
  chapters: { title: string; paragraphs: string[] }[];
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
};

export type ChapterOutline = { n: number; title: string; firstPage: number; lastPage: number };

/** Everything the UI needs about a book, without its text. */
export type BookInfo = {
  slug: string;
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
