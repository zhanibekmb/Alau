"use client";

import type { ReactNode } from "react";
import { MAX_FONT_SIZE, MIN_FONT_SIZE, type ReaderFont, type ReaderTheme, type Settings } from "@/lib/state";
import { updateSettings } from "@/lib/store";
import type { BookInfo } from "@/lib/types";
import { CloseIcon, LockIcon } from "../icons";

function Overlay({ label, onClose, children, position }: {
  label: string;
  onClose: () => void;
  children: ReactNode;
  position: string;
}) {
  return (
    <div
      className={`fixed inset-0 z-40 flex justify-center bg-black/45 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-3 md:pb-3 ${position}`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(event) => event.stopPropagation()}
        className="max-h-full w-full max-w-[446px] overflow-y-auto rounded-3xl bg-[var(--r-panel)] p-5 shadow-2xl"
      >
        {children}
      </div>
    </div>
  );
}

/** Table of contents: a drawer from the left (Figma, reader-chapters-block). */
export function ChapterMenu({ book, currentChapter, isLocked, onPick, onClose }: {
  book: BookInfo;
  currentChapter: number;
  /** Paid chapters this reader has not bought: shown with a lock, still clickable (opens the paywall). */
  isLocked: (chapter: number) => boolean;
  onPick: (firstPage: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 animate-[fade-in_0.2s] bg-black/30 motion-reduce:animate-none" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Тараулар тізімі"
        onClick={(event) => event.stopPropagation()}
        className="flex h-full w-[min(380px,88vw)] animate-[drawer-in_0.25s_ease-out] flex-col motion-reduce:animate-none bg-[var(--r-panel)] shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 px-6 pb-5 pt-10 md:px-[30px] md:pt-16">
          <div>
            <p className="text-sm font-medium text-amber-600">Кітап мазмұны</p>
            <h2 className="mt-0.5 text-2xl font-semibold">Тараулар тізімі</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Жабу"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--r-soft)] transition-opacity hover:opacity-80"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
        <div className="mx-6 border-t border-[var(--r-soft)] md:mx-[30px]" />

        <ol className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-6 py-6 md:px-[30px] md:py-10">
          {book.chapters.map((chapter) => {
            const current = chapter.n === currentChapter;
            const locked = isLocked(chapter.n);
            return (
              <li key={chapter.n}>
                <button
                  type="button"
                  aria-current={current ? "true" : undefined}
                  onClick={() => onPick(chapter.firstPage)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors hover:border-accent ${
                    current ? "border-accent/60" : "border-[var(--r-soft)]"
                  }`}
                >
                  <span
                    className={`flex size-[30px] shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      current ? "bg-accent text-white" : "bg-[var(--r-soft)]"
                    }`}
                  >
                    {chapter.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      {chapter.n}-тарау: {chapter.title}
                    </span>
                    <span className="block text-sm text-[var(--r-muted)]">
                      {chapter.firstPage === chapter.lastPage
                        ? `${chapter.firstPage}-бет`
                        : `${chapter.firstPage}–${chapter.lastPage} беттер`}
                    </span>
                  </span>
                  {locked && (
                    <>
                      <LockIcon className="size-5 shrink-0 text-[var(--r-muted)]" />
                      <span className="sr-only">Ақылы тарау</span>
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}

export function OriginalPanel({ chapter, title, paragraphs, onClose }: {
  chapter: number;
  title: string;
  paragraphs: string[];
  onClose: () => void;
}) {
  return (
    <Overlay label="Қазақша нұсқа" onClose={onClose} position="items-start pt-20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--r-muted)]">Қазақша нұсқа · {chapter}-тарау</p>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Жабу" className="-m-1 p-1">
          <CloseIcon className="size-6" />
        </button>
      </div>
      <div lang="kk" className="mt-4 space-y-3 leading-relaxed">
        {paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </Overlay>
  );
}

const FONTS: { id: ReaderFont; label: string; family: string }[] = [
  { id: "serif", label: "Serif", family: "var(--ff-pt-serif)" },
  { id: "sans", label: "Sans", family: "var(--ff-inter)" },
  { id: "lora", label: "Lora", family: "var(--ff-lora)" },
];

/** Swatch colours match the theme backgrounds in globals.css. */
const THEMES: { id: ReaderTheme; label: string; color: string }[] = [
  { id: "paper", label: "Paper Light", color: "#fcfbf7" },
  { id: "night", label: "Night Dark", color: "#141414" },
  { id: "forest", label: "Forest Sage", color: "#263529" },
  { id: "sepia", label: "Warm Sepia", color: "#ede4d3" },
];

/** Reading settings sheet (Figma, reader-settings-page): same on phone and desktop. Tap outside closes it. */
export function SettingsPanel({ settings, onClose }: { settings: Settings; onClose: () => void }) {
  return (
    <Overlay label="Оқу баптаулары" onClose={onClose} position="items-end">
      <div className="mx-auto -mt-1 mb-3 h-[5px] w-[60px] rounded-full bg-[var(--r-soft)]" aria-hidden="true" />
      <h2 className="text-center text-sm font-medium tracking-wide text-[var(--r-muted)]">ОҚУ БАПТАУЛАРЫ</h2>
      <button type="button" onClick={onClose} className="sr-only">
        Жабу
      </button>

      <p className="mt-6 text-center text-sm text-[var(--r-muted)]">Шрифт түрі (Font)</p>
      <div className="mt-3 grid grid-cols-3 gap-1 rounded-2xl bg-[var(--r-soft)] p-1" role="group" aria-label="Шрифт түрі">
        {FONTS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={settings.font === id}
            onClick={() => updateSettings({ font: id })}
            className={`h-10 rounded-xl text-sm transition-colors ${
              settings.font === id ? "bg-[var(--r-panel)] font-medium shadow-sm" : "text-[var(--r-muted)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="mt-6 flex items-center gap-3">
        <span aria-hidden="true" className="text-xs text-[var(--r-muted)]">Aa</span>
        <span className="sr-only">Әріп өлшемі</span>
        <input
          type="range"
          min={MIN_FONT_SIZE}
          max={MAX_FONT_SIZE}
          step={1}
          value={settings.fontSize}
          onChange={(event) => updateSettings({ fontSize: Number(event.target.value) })}
          className="h-6 flex-1 accent-[var(--r-fg)]"
        />
        <span aria-hidden="true" className="text-xl text-[var(--r-muted)]">Aa</span>
      </label>

      <div className="mt-5 flex justify-center gap-5" role="group" aria-label="Түс тақырыбы">
        {THEMES.map(({ id, label, color }) => (
          <button
            key={id}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={settings.theme === id}
            onClick={() => updateSettings({ theme: id })}
            style={{ background: color }}
            className={`size-[50px] rounded-full transition-shadow ${
              settings.theme === id ? "ring-2 ring-accent ring-offset-2 ring-offset-[var(--r-panel)]" : "ring-1 ring-black/10"
            }`}
          />
        ))}
      </div>
    </Overlay>
  );
}
