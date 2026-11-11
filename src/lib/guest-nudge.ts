import { withSource, type SignupSource } from "./signup-source";

// Gentle reminders that turn guests into accounts. A guest's words and progress live only in this
// browser; the reminders say so at the moments that matter, never on every action.

/** Saved-word counts after which a guest sees the "sign up to keep them" toast: 1, 5, 10, 20, 30… */
export function nudgeAfterSave(wordCount: number): boolean {
  return wordCount === 1 || wordCount === 5 || (wordCount >= 10 && wordCount % 10 === 0);
}

/** The sign-up page, coming back to where the guest was, tagged with where they pressed it. */
export function signUpHref(next: string, source: SignupSource = "other"): string {
  return `/login?mode=sign-up&next=${encodeURIComponent(withSource(next, source))}`;
}

/** "12 сөз", "3 кітап" and so on; empty parts are left out. */
export function guestStashText(words: number, books: number): string {
  const parts = [words > 0 && `${words} сөз`, books > 0 && `${books} кітап`].filter(Boolean);
  return parts.join(" және ");
}

/** A streak this long is worth protecting, so a guest hears it can be lost. */
export const STREAK_NUDGE_DAYS = 2;

/** "Серияңыз 3 күн…" once a guest has a streak worth keeping, else null. */
export function streakNudgeText(streakDays: number): string | null {
  return streakDays >= STREAK_NUDGE_DAYS
    ? `Серияңыз ${streakDays} күн — тіркелмесеңіз, браузер тазаланғанда жоғалуы мүмкін.`
    : null;
}
