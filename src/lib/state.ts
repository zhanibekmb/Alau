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
export const MAX_FONT_SIZE = 26;

export type Settings = {
  theme: ReaderTheme;
  font: ReaderFont;
  fontSize: number;
  level: Level | null;
  hintSeen: boolean;
};

export type AppState = {
  progress: Record<string, Progress>;
  savedBooks: Record<string, number>;
  words: Record<string, SavedWord>;
  settings: Settings;
};

export const INITIAL_STATE: AppState = {
  progress: {},
  savedBooks: {},
  words: {},
  settings: { theme: "paper", font: "serif", fontSize: 20, level: null, hintSeen: false },
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
      },
    };
  } catch {
    return INITIAL_STATE;
  }
}
