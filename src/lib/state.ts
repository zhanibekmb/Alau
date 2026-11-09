import { LEVELS, type Level } from "./types";

// Pure rules for what the browser remembers. src/lib/store.ts keeps them in localStorage.

export type Progress = { page: number; totalPages: number; finished: boolean; updatedAt: number };

export type SavedWord = {
  id: string;
  lemma: string;
  kk: string;
  ipa: string;
  pos: string;
  slug: string;
  bookTitle: string;
  page: number;
  sentence: string;
  savedAt: number;
};

export const READER_THEMES = ["paper", "night", "forest", "sepia"] as const;
export type ReaderTheme = (typeof READER_THEMES)[number];
export const READER_FONTS = ["serif", "sans", "lora"] as const;
export type ReaderFont = (typeof READER_FONTS)[number];
export const MIN_FONT_SIZE = 16;
/** Daily reading goal choices, in minutes (profile, "Күнделікті оқу мақсаты"). */
export const DAILY_GOALS = [5, 10, 15, 20, 30, 45, 60] as const;
export const ACCENTS = ["us", "gb"] as const;
export type Accent = (typeof ACCENTS)[number];
export const MAX_FONT_SIZE = 26;

export type Settings = {
  theme: ReaderTheme;
  font: ReaderFont;
  fontSize: number;
  level: Level | null;
  hintSeen: boolean;
  /** Desktop sidebar shows icons only. */
  sidebarCollapsed: boolean;
  /** Minutes a day; the weekly chart and the profile goal use it. */
  dailyGoal: number;
  /** English voice for pronouncing words. */
  accent: Accent;
};

/** Spaced-repetition state of one saved word (Leitner boxes, src/lib/review.ts). */
export type Review = { box: number; due: number; reviewedAt: number };

export type AppState = {
  progress: Record<string, Progress>;
  savedBooks: Record<string, number>;
  words: Record<string, SavedWord>;
  /** Seconds of reading per local date ("2026-11-09"). Any day above 0 counts for the streak. */
  readingDays: Record<string, number>;
  /** Keyed by word id. A saved word without an entry has never been reviewed. */
  reviews: Record<string, Review>;
  settings: Settings;
};

export const INITIAL_STATE: AppState = {
  progress: {},
  savedBooks: {},
  words: {},
  readingDays: {},
  reviews: {},
  settings: { theme: "paper", font: "serif", fontSize: 20, level: null, hintSeen: false, sidebarCollapsed: false, dailyGoal: 20, accent: "us" },
};

/** Progress never moves back, so an old tab cannot overwrite a newer one. */
export function mergeProgress(previous: Progress | undefined, next: Progress): Progress {
  if (!previous) return next;
  return {
    page: Math.max(previous.page, next.page),
    totalPages: next.totalPages,
    finished: previous.finished || next.finished,
    updatedAt: Math.max(previous.updatedAt, next.updatedAt),
  };
}

/** Saving twice keeps the first record, so a double tap leaves one word. */
export function addWord(words: AppState["words"], word: SavedWord): AppState["words"] {
  return words[word.id] ? words : { ...words, [word.id]: word };
}

export function progressPercent(progress: Progress | undefined): number {
  if (!progress) return 0;
  if (progress.finished) return 100;
  return Math.min(99, Math.round((progress.page / progress.totalPages) * 100));
}

/** Keeps stored data usable if it is damaged or was written by an older version. */
export function parseStoredState(raw: string | null): AppState {
  if (!raw) return INITIAL_STATE;
  try {
    const data = JSON.parse(raw) as Partial<AppState>;
    const settings: Partial<Settings> = data.settings ?? {};
    return {
      progress: data.progress ?? {},
      savedBooks: data.savedBooks ?? {},
      words: data.words ?? {},
      readingDays: parseReadingDays(data.readingDays),
      reviews: data.reviews ?? {},
      settings: {
        ...INITIAL_STATE.settings,
        ...settings,
        theme: READER_THEMES.includes(settings.theme as ReaderTheme)
          ? (settings.theme as ReaderTheme)
          : "paper",
        font: READER_FONTS.includes(settings.font as ReaderFont)
          ? (settings.font as ReaderFont)
          : "serif",
        level: LEVELS.includes(settings.level as Level) ? (settings.level as Level) : null,
        sidebarCollapsed: settings.sidebarCollapsed === true,
        dailyGoal: DAILY_GOALS.includes(settings.dailyGoal as (typeof DAILY_GOALS)[number]) ? settings.dailyGoal! : 20,
        accent: ACCENTS.includes(settings.accent as Accent) ? (settings.accent as Accent) : "us",
      },
    };
  } catch {
    return INITIAL_STATE;
  }
}

/** Older versions stored `true` for a reading day; it counts as one minute. */
function parseReadingDays(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object") return {};
  const days: Record<string, number> = {};
  for (const [day, value] of Object.entries(raw)) {
    if (value === true) days[day] = 60;
    else if (typeof value === "number" && Number.isFinite(value) && value > 0) days[day] = Math.floor(value);
  }
  return days;
}
