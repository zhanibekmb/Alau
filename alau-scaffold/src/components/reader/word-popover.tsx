"use client";

import { useEffect, useRef } from "react";
import { POS_LABELS, type Gloss } from "@/lib/types";
import { BookmarkIcon, CheckIcon, CloseIcon } from "../icons";

const WIDTH = 300;
const ESTIMATED_HEIGHT = 190;
const GAP = 8;

export type PopoverPlace = { left: number; top: number };

/** Keeps the card on screen: above the word when there is room, otherwise below it. */
export function placePopover(word: DOMRect, viewportWidth: number, viewportHeight: number): PopoverPlace {
  const left = Math.min(
    Math.max(GAP, word.left + word.width / 2 - WIDTH / 2),
    Math.max(GAP, viewportWidth - WIDTH - GAP),
  );
  const above = word.top - ESTIMATED_HEIGHT - GAP;
  const below = word.bottom + GAP;
  const fitsBelow = below + ESTIMATED_HEIGHT <= viewportHeight;
  return { left, top: above >= GAP || !fitsBelow ? Math.max(GAP, above) : below };
}

export function WordPopover({
  gloss,
  surface,
  place,
  saved,
  onSave,
  onClose,
}: {
  gloss: Gloss;
  surface: string;
  place: PopoverPlace;
  saved: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!card.current?.contains(target) && !target.closest("[data-t]")) onClose();
    };
    // On desktop the card is tied to the word's position, so it closes when the text moves.
    const onScroll = () => {
      if (window.innerWidth >= 640) onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [onClose]);

  const differs = surface.toLowerCase() !== gloss.lemma.toLowerCase();

  return (
    <div
      ref={card}
      role="dialog"
      aria-label={`${gloss.lemma}: аудармасы`}
      style={{ left: place.left, top: place.top, width: WIDTH }}
      className="fixed z-40 rounded-2xl border border-[var(--r-line)] bg-[var(--r-surface)] p-4 shadow-xl max-sm:inset-x-0! max-sm:top-auto! max-sm:bottom-0! max-sm:w-full! max-sm:rounded-b-none max-sm:pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-lg font-bold leading-tight" lang="en">
            {gloss.lemma}
            {differs && <span className="ml-2 text-sm font-normal text-[var(--r-muted)]">{surface}</span>}
          </p>
          <p className="mt-0.5 text-xs text-[var(--r-muted)]">
            {gloss.ipa && <span>[{gloss.ipa}] · </span>}
            {POS_LABELS[gloss.pos] ?? gloss.pos}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Жабу" className="-m-1.5 p-1.5">
          <CloseIcon className="size-5" />
        </button>
      </div>
      <p className="mt-2 text-xl font-semibold text-amber-600" lang="kk">{gloss.kk}</p>
      <button
        type="button"
        onClick={onSave}
        disabled={saved}
        className={`mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl font-medium ${
          saved ? "border border-[var(--r-line)] text-[var(--r-muted)]" : "bg-accent text-on-accent"
        }`}
      >
        {saved ? <CheckIcon className="size-5" /> : <BookmarkIcon className="size-5" />}
        {saved ? "Сөздікте сақталды" : "Сөздікке сақтау"}
      </button>
    </div>
  );
}
