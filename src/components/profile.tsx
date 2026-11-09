"use client";

import { learnedCount } from "@/lib/review";
import { clearAllData, updateSettings, useAppState } from "@/lib/store";
import { LEVELS, levelLabel } from "@/lib/types";
import { AccountCard, TariffCard } from "./account";
import { StreakCard } from "./streak";

export function Profile() {
  const { progress, words, reviews, settings } = useAppState();
  const reading = Object.values(progress);
  const stats = [
    { value: reading.length, label: "кітап" },
    { value: reading.reduce((sum, p) => sum + p.page, 0), label: "бет оқылды" },
    { value: Object.keys(words).length, label: "сөз сөздікте" },
    { value: learnedCount(words, reviews), label: "сөз үйренілді" },
  ];

  return (
    <div className="mx-auto w-full max-w-[680px] px-4 pb-10 pt-6 md:px-8 md:pt-14">
      <h1 className="text-3xl font-bold md:text-4xl">Профиль</h1>

      <AccountCard />
      <StreakCard />
      <TariffCard />

      <dl className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
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
              aria-label={levelLabel(level)}
              onClick={() => updateSettings({ level: settings.level === level ? null : level })}
              className={`h-11 flex-1 rounded-full font-medium transition-colors duration-300 ${
                settings.level === level ? "bg-ink text-white" : "bg-chip text-muted"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="mt-2 h-5 text-sm font-medium" aria-live="polite">
          {settings.level ? levelLabel(settings.level) : <span className="text-muted">Деңгей таңдалмаған</span>}
        </p>
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
