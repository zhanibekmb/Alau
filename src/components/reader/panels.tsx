"use client";

import type { ReactNode } from "react";
import { MAX_FONT_SIZE, MIN_FONT_SIZE, type ReaderFont, type ReaderTheme, type Settings } from "@/lib/state";
import { updateSettings } from "@/lib/store";
import type { BookInfo } from "@/lib/types";
import { CloseIcon } from "../icons";

function Overlay({ label, onClose, children, position }: {
  label: string;
  onClose: () => void;
  children: ReactNode;
  position: string;
}) {
  return (
    <div className={`fixed inset-0 z-40 flex justify-center bg-black/45 p-3 ${position}`} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(event) => event.stopPropagation()}
        className="max-h-full w-full max-w-[446px] overflow-y-auto rounded-3xl bg-[var(--r-surface)] p-5 shadow-2xl"
      >
        {children}
      </div>
    </div>
  );
}

export function ChapterMenu({ book, currentChapter, onPick, onClose }: {
  book: BookInfo;
  currentChapter: number;
  onPick: (firstPage: number) => void;
  onClose: () => void;
}) {
  return (
    <Overlay label="Тараулар тізімі" onClose={onClose} position="items-start pt-20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--r-muted)]">Тараулар тізімі</p>
          <h2 className="text-xl font-bold">Кітап мазмұны</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Жабу" className="-m-1 p-1">
          <CloseIcon className="size-6" />
        </button>
      </div>
      <ol className="mt-4 flex flex-col gap-1.5">
        {book.chapters.map((chapter) => {
          const current = chapter.n === currentChapter;
          return (
            <li key={chapter.n}>
              <button
                type="button"
                aria-current={current ? "true" : undefined}
                onClick={() => onPick(chapter.firstPage)}
                className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left hover:bg-[var(--r-line)]"
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full font-semibold ${
                    current ? "bg-accent text-on-accent" : "bg-[var(--r-line)]"
                  }`}
                >
                  {chapter.n}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium">{chapter.n}-тарау: {chapter.title}</span>
                  <span className="block text-sm text-[var(--r-muted)]">
                    {chapter.firstPage === chapter.lastPage
                      ? `${chapter.firstPage}-бет`
                      : `${chapter.firstPage}–${chapter.lastPage} беттер`}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </Overlay>
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

const THEMES: { id: ReaderTheme; label: string; color: string }[] = [
  { id: "paper", label: "Paper Light", color: "#fcfbf7" },
  { id: "night", label: "Night Dark", color: "#15161a" },
  { id: "forest", label: "Forest Sage", color: "#1e2b24" },
  { id: "sepia", label: "Warm Sepia", color: "#3a2a1d" },
];

export function SettingsPanel({ settings, onClose }: { settings: Settings; onClose: () => void }) {
  return (
    <Overlay label="Оқу баптаулары" onClose={onClose} position="items-end">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--r-muted)]">ОҚУ БАПТАУЛАРЫ</h2>
        <button type="button" onClick={onClose} aria-label="Жабу" className="-m-1 p-1">
          <CloseIcon className="size-6" />
        </button>
      </div>

      <p className="mt-4 text-center text-sm font-medium">Шрифт түрі</p>
      <div className="mt-2 grid grid-cols-3 gap-1 rounded-2xl bg-[var(--r-line)] p-1" role="group" aria-label="Шрифт түрі">
        {FONTS.map(({ id, label, family }) => (
          <button
            key={id}
            type="button"
            aria-pressed={settings.font === id}
            onClick={() => updateSettings({ font: id })}
            style={{ fontFamily: family }}
            className={`h-10 rounded-xl ${settings.font === id ? "bg-[var(--r-surface)] font-semibold shadow-sm" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="mt-5 flex items-center gap-3">
        <span aria-hidden="true" className="text-sm">Aa</span>
        <span className="sr-only">Әріп өлшемі</span>
        <input
          type="range"
          min={MIN_FONT_SIZE}
          max={MAX_FONT_SIZE}
          step={1}
          value={settings.fontSize}
          onChange={(event) => updateSettings({ fontSize: Number(event.target.value) })}
          className="h-6 flex-1 accent-[var(--color-accent)]"
        />
        <span aria-hidden="true" className="text-xl">Aa</span>
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
            className={`size-[50px] rounded-full border ${
              settings.theme === id ? "border-transparent ring-3 ring-accent" : "border-[var(--r-line)]"
            }`}
          />
        ))}
      </div>
    </Overlay>
  );
}
