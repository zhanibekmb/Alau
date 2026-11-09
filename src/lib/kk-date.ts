// Dates in Kazakh. The browser's kk-KZ format writes "2026 ж. 9 желтоқсан", which reads
// awkwardly in a sentence; the app writes "9 желтоқсан 2026" instead.

const MONTHS = [
  "қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым",
  "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан",
];

const DAY_MS = 24 * 60 * 60 * 1000;

/** "9 желтоқсан 2026", or "9 желтоқсан" when `year` is false. Local time. */
export function formatKkDate(date: Date, { year = true }: { year?: boolean } = {}): string {
  const text = `${date.getDate()} ${MONTHS[date.getMonth()]}`;
  return year ? `${text} ${date.getFullYear()}` : text;
}

/** Whole days until `end`, rounded up; 0 once it has passed. */
export function daysLeft(end: Date, now: Date): number {
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / DAY_MS));
}

/** "29 күн қалды", "Ертең аяқталады", "Бүгін аяқталады". */
export function remainingText(end: Date, now: Date): string {
  const hours = (end.getTime() - now.getTime()) / (60 * 60 * 1000);
  if (hours <= 0) return "Аяқталды";
  if (end.toDateString() === now.toDateString()) return "Бүгін аяқталады";
  if (end.toDateString() === new Date(now.getTime() + DAY_MS).toDateString()) return "Ертең аяқталады";
  return `${daysLeft(end, now)} күн қалды`;
}
