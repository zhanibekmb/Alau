"use client";

import { clearAllData, updateSettings, useAppState } from "@/lib/store";
import { LEVELS } from "@/lib/types";
import { AccountCard } from "./account";

export function Profile() {
  const { progress, words, settings } = useAppState();
  const reading = Object.values(progress);
  const stats = [
    { value: reading.length, label: "кітап" },
    { value: reading.reduce((sum, p) => sum + p.page, 0), label: "бет оқылды" },
    { value: Object.keys(words).length, label: "сөз сөздікте" },
  ];

  return (
    <div className="mx-auto w-full max-w-[680px] px-4 pb-10 pt-6 md:px-8 md:pt-14">
      <h1 className="text-3xl font-bold md:text-4xl">Профиль</h1>

      <AccountCard />

      <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
        {stats.map(({ value, label }) => (
          <div key={label} className="rounded-2xl border border-line p-3">
            <dd className="text-2xl font-bold">{value}</dd>
            <dt className="text-sm text-muted">{label}</dt>
          </div>
        ))}
      </dl>

      <section className="mt-8">
        <h2 className="font-semibold">Менің деңгейім</h2>
        <p className="mt-1 text-sm text-muted">Кітапхана осы деңгейдегі кітаптардан басталады.</p>
        <div className="mt-3 flex gap-2" role="group" aria-label="Менің деңгейім">
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              aria-pressed={settings.level === level}
              onClick={() => updateSettings({ level: settings.level === level ? null : level })}
              className={`h-11 flex-1 rounded-full font-medium ${
                settings.level === level ? "bg-ink text-white" : "bg-chip text-muted"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 border-t border-line pt-6">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Прогресс пен сөздікті осы браузерден өшіру керек пе?")) clearAllData();
          }}
          className="font-medium text-red-700"
        >
          Деректерді өшіру
        </button>
      </section>
    </div>
  );
}
