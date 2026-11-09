"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { Mascot, type MascotPose } from "./brand";

// The two interactive parts of the landing page: the book carousel and the "why Alau" list.

export function Carousel({ children }: { children: ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const move = (direction: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: direction * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };
  const arrow =
    "absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl font-bold shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 md:flex";
  return (
    <div className="relative">
      <button type="button" onClick={() => move(-1)} aria-label="Алдыңғы кітаптар" className={`${arrow} -left-3`}>
        ‹
      </button>
      <ul
        ref={track}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-4 pt-2 [scrollbar-width:none]"
      >
        {children}
      </ul>
      <button type="button" onClick={() => move(1)} aria-label="Келесі кітаптар" className={`${arrow} -right-3`}>
        ›
      </button>
    </div>
  );
}

const REASONS: { title: string; text: string; pose: MascotPose; note: string }[] = [
  {
    title: "Нағыз әдебиет",
    text: "Оқулықтағы жасанды мәтін емес — қазақ авторларының шынайы шығармалары, деңгейге бейімделген.",
    pose: "audio-book",
    note: "Әр кітаптың кульминацияға дейінгі бөлімі тегін",
  },
  {
    title: "Сөзді контексте түсіну",
    text: "Аударма сөйлемдегі мағынасына қарай беріледі, тұрақты тіркестер бірге шығады.",
    pose: "reader-tooltip",
    note: "Бір басқанда: аударма, айтылуы, сөз табы",
  },
  {
    title: "Есте қалатын сөздер",
    text: "Сақталған сөздер карточкаға айналады, жүйе ұмыта бастаған сөзіңізді өзі қайта сұрайды.",
    pose: "flashcards",
    note: "1, 3, 7, 14, 30 күннен кейін қайталау",
  },
  {
    title: "Күн сайынғы әдет",
    text: "Күнделікті мақсат, серия және апталық белсенділік — оқуды тастамауға көмектеседі.",
    pose: "streak",
    note: "Күніне 10–20 минут жеткілікті",
  },
];

/** "Неге Alau?": one open item at a time, the picture follows it. */
export function Reasons() {
  const [open, setOpen] = useState(0);
  const current = REASONS[open];
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
      <ul className="flex flex-col gap-3">
        {REASONS.map((reason, i) => {
          const active = i === open;
          return (
            <li key={reason.title}>
              <button
                type="button"
                aria-expanded={active}
                onClick={() => setOpen(i)}
                className={`w-full rounded-3xl px-6 py-5 text-left transition-all duration-300 ${
                  active ? "bg-white text-[#201f4b] shadow-xl" : "bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                <span className="font-display text-xl font-extrabold md:text-2xl">{reason.title}</span>
                <span
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                    active ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70"
                  }`}
                >
                  <span className="overflow-hidden">{reason.text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[#f59e0b]/25 [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]" />
        <div className="absolute inset-8 rounded-full bg-white/10" />
        <Mascot key={current.pose} pose={current.pose} className="relative size-64 animate-pop md:size-72" />
        <p className="absolute bottom-2 left-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-full bg-white px-4 py-2 text-center text-sm font-bold text-[#201f4b] shadow-lg">
          {current.note}
        </p>
      </div>
      <div className="lg:col-span-2">
        <Link
          href="/library"
          className="inline-flex rounded-full bg-[#f59e0b] px-8 py-4 font-display text-lg font-extrabold text-[#201f4b] shadow-lg shadow-black/20 transition-transform hover:scale-[1.03]"
        >
          Тегін оқуды бастау
        </Link>
      </div>
    </div>
  );
}
