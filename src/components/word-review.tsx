"use client";

import { useEffect, useState } from "react";
import { recordReview, useAppState } from "@/lib/store";
import { POS_LABELS } from "@/lib/types";
import { Mascot } from "./brand";
import { CloseIcon } from "./icons";

// Word review session ("Сөздерді қайталау"). Rules: src/lib/review.ts.
//
//   word in English ─ «Аудармасын көру» ─▶ translation ─┬─ «Білемін»   ─▶ next box, back later
//                                                     └─ «Есімде жоқ» ─▶ box 0, again at the end
//
// Keys: Space shows the translation, 1 = «Есімде жоқ», 2 = «Білемін», Esc closes.

export function WordReview({ initialQueue, onClose }: { initialQueue: string[]; onClose: () => void }) {
  const { words } = useAppState();
  const [queue, setQueue] = useState(initialQueue);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);
  const [again, setAgain] = useState(0);

  // A word removed in another tab is skipped.
  const rest = queue.slice(index).filter((id) => words[id]);
  const word = rest.length > 0 ? words[rest[0]] : undefined;
  const total = initialQueue.length;
  const done = Math.min(known, total);

  const answerCard = (knew: boolean) => {
    if (!word || !revealed) return;
    recordReview(word.id, knew);
    if (knew) setKnown((n) => n + 1);
    else {
      setAgain((n) => n + 1);
      setQueue((q) => [...q, word.id]);
    }
    setRevealed(false);
    setIndex(queue.indexOf(word.id, index) + 1);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === " " && word && !revealed) {
        event.preventDefault();
        setRevealed(true);
      } else if (event.key === "1") answerCard(false);
      else if (event.key === "2") answerCard(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 md:items-center md:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Сөздерді қайталау"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92dvh] w-full flex-col rounded-t-3xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl md:max-w-[520px] md:rounded-3xl md:p-6"
      >
        <div className="flex items-center gap-3">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-chip"
            role="progressbar"
            aria-label="Қайталау барысы"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
          >
            <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${(done / Math.max(total, 1)) * 100}%` }} />
          </div>
          <span className="text-sm font-medium tabular-nums text-muted">
            {done}/{total}
          </span>
          <button type="button" onClick={onClose} aria-label="Жабу" className="-m-1 rounded-full p-1 hover:bg-chip">
            <CloseIcon className="size-6" />
          </button>
        </div>

        {word ? (
          <div key={`${word.id}-${index}`} className="mt-6 flex animate-card-in flex-col">
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl bg-sidebar px-5 py-8 text-center">
              <p className="text-sm text-muted">{POS_LABELS[word.pos] ?? word.pos}</p>
              <p className="mt-2 text-4xl font-bold" lang="en">
                {word.lemma}
              </p>
              {word.ipa && <p className="mt-1 text-muted">[{word.ipa}]</p>}
              <p className="mt-5 max-w-sm font-serif leading-relaxed text-ink/80" lang="en">
                «{word.sentence}»
              </p>
              <p className="mt-2 text-xs text-muted">
                {word.bookTitle} · {word.page}-бет
              </p>

              {revealed && (
                <div className="mt-6 w-full animate-card-in border-t border-dashed border-line pt-5">
                  <p className="text-sm text-muted">Аудармасы</p>
                  <p className="mt-1 text-2xl font-bold text-amber-800">{word.kk}</p>
                </div>
              )}
            </div>

            {revealed ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => answerCard(false)}
                  className="h-14 rounded-2xl border-2 border-line font-semibold transition-colors hover:border-red-300 hover:bg-red-50"
                >
                  Есімде жоқ
                  <span className="ml-1.5 hidden text-xs font-normal text-muted md:inline">1</span>
                </button>
                <button
                  type="button"
                  onClick={() => answerCard(true)}
                  className="h-14 rounded-2xl bg-accent font-semibold text-on-accent shadow-md shadow-accent/30 transition-transform active:scale-[0.98]"
                >
                  Білемін
                  <span className="ml-1.5 hidden text-xs font-normal opacity-70 md:inline">2</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                autoFocus
                className="mt-4 h-14 rounded-2xl bg-ink font-semibold text-white transition-transform active:scale-[0.98]"
              >
                Аудармасын көру
                <span className="ml-1.5 hidden text-xs font-normal opacity-60 md:inline">Space</span>
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 flex animate-card-in flex-col items-center py-6 text-center">
            <Mascot className="size-24 animate-pop" />
            <h2 className="mt-4 text-2xl font-bold">Жарайсыз!</h2>
            <p className="mt-1 text-muted">Бүгінгі қайталау аяқталды.</p>
            <dl className="mt-5 grid w-full max-w-xs grid-cols-2 gap-3">
              <div className="rounded-2xl bg-accent-soft p-3">
                <dd className="text-2xl font-bold">{known}</dd>
                <dt className="text-sm text-muted">білемін</dt>
              </div>
              <div className="rounded-2xl bg-sidebar p-3">
                <dd className="text-2xl font-bold">{again}</dd>
                <dt className="text-sm text-muted">қайта қаралды</dt>
              </div>
            </dl>
            <button type="button" onClick={onClose} className="mt-6 h-12 w-full max-w-xs rounded-2xl bg-accent font-semibold text-on-accent">
              Сөздікке оралу
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
