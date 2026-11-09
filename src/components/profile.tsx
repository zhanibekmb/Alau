"use client";

import Link from "next/link";
import { useRef, type ReactNode, type RefObject } from "react";
import { authClient } from "@/lib/auth-client";
import { learnedCount } from "@/lib/review";
import { ACCENTS, DAILY_GOALS, type Accent } from "@/lib/state";
import { clearAllData, updateSettings, useAppState } from "@/lib/store";
import { formatDuration, minutesToday, streakOf, thisWeek, totalSeconds } from "@/lib/streak";
import { LEVELS, levelLabel, type Level } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { SubscriptionCard, useSignOut } from "./account";
import { Mascot } from "./brand";
import { CaretIcon } from "./icons";

// Profile from the Figma Desktop screen: account, four numbers, this week's reading against the
// daily goal, the subscription, and reading settings.

const ACCENT_NAMES: Record<Accent, string> = { us: "American (US)", gb: "British (UK)" };

export function Profile() {
  const goalRef = useRef<HTMLSelectElement>(null);

  return (
    <div className="mx-auto w-full max-w-[913px] px-5 pb-10 pt-6 md:px-8 md:pt-14">
      <h1 className="text-3xl font-bold md:text-4xl">Профиль</h1>
      <ProfileHeader />
      <StatCards />
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_330px]">
        <WeeklyActivity onChangeGoal={() => goalRef.current?.focus()} />
        <SubscriptionCard />
      </div>
      <Settings goalRef={goalRef} />
    </div>
  );
}

function ProfileHeader() {
  const { data, isPending } = authClient.useSession();
  const { settings } = useAppState();
  const { signOut, signingOut } = useSignOut();

  if (isPending) return <section className="mt-6 h-[168px] rounded-3xl bg-sidebar" aria-hidden="true" />;

  return (
    <section className="mt-6 flex flex-wrap items-center gap-5 rounded-3xl border border-line bg-sidebar p-5 md:p-9">
      <div className="relative shrink-0">
        <span className="flex size-[88px] items-center justify-center overflow-hidden rounded-3xl border-2 border-accent bg-white md:size-[100px]">
          <Mascot className="size-[82px] md:size-[92px]" />
        </span>
        {settings.level && (
          <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-white ring-2 ring-sidebar">
            {settings.level}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-2xl font-bold">{data ? data.user.name || data.user.email : "Қонақ"}</p>
        <p className="truncate text-muted">{data ? data.user.email : "Прогресс пен сөздік осы браузерде сақталады"}</p>
        <p className="mt-1">
          Мақсат: <b className="font-semibold">Күніне {settings.dailyGoal} мин оқу</b>
        </p>
      </div>

      {data ? (
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="rounded-2xl border border-line bg-white px-5 py-3 font-medium transition-colors hover:bg-chip disabled:opacity-60"
        >
          {signingOut ? "Шығып жатырмыз…" : "Шығу"}
        </button>
      ) : (
        <Link href="/login?next=/profile" className="rounded-2xl bg-accent px-5 py-3 font-semibold text-on-accent">
          Кіру
        </Link>
      )}
    </section>
  );
}

function StatCards() {
  const { progress, words, reviews, readingDays } = useAppState();
  const now = useNow();
  const streak = now ? streakOf(readingDays, now).current : 0;
  const reading = Object.values(progress);
  const pages = reading.reduce((sum, p) => sum + p.page, 0);
  const learned = learnedCount(words, reviews);

  const cards = [
    { icon: "🔥", tint: "bg-[#fdf0b8]", value: `${streak} күн`, label: "Үздіксіз оқу" },
    { icon: "📚", tint: "bg-[#d5f5e0]", value: `${reading.length} кітап`, label: `${pages} бет оқылды` },
    {
      icon: "🧠",
      tint: "bg-[#cdeefd]",
      value: `${Object.keys(words).length} сөз`,
      label: learned > 0 ? `Сөздікте · ${learned} үйренілді` : "Сөздікте",
    },
    { icon: "⏱️", tint: "bg-[#dbdbff]", value: formatDuration(totalSeconds(readingDays)), label: "жалпы оқу уақыты" },
  ];

  return (
    <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
      {cards.map(({ icon, tint, value, label }) => (
        <div key={label} className="rounded-3xl border border-line bg-white p-4 shadow-sm shadow-black/[0.03] md:p-5">
          <span className={`flex size-11 items-center justify-center rounded-xl text-xl ${tint}`} aria-hidden="true">
            {icon}
          </span>
          <dd className="mt-4 text-2xl font-bold md:text-3xl">{value}</dd>
          <dt className="mt-1 text-sm text-muted">{label}</dt>
        </div>
      ))}
    </dl>
  );
}

/** Bar colour by share of the daily goal, as in the design: deeper amber the closer to the goal. */
function barColor(minutes: number, goal: number) {
  if (minutes <= 0) return "bg-chip";
  const share = minutes / goal;
  if (share >= 1) return "bg-[#ffbb5c]";
  if (share >= 0.7) return "bg-[#ffef40]";
  if (share >= 0.4) return "bg-[#fff896]";
  return "bg-[#fffbcc]";
}

function WeeklyActivity({ onChangeGoal }: { onChangeGoal: () => void }) {
  const { readingDays, settings } = useAppState();
  const now = useNow();
  const goal = settings.dailyGoal;
  if (!now) return <section className="h-[326px] rounded-3xl border border-line" aria-hidden="true" />;

  const week = thisWeek(readingDays, now);
  const weekMinutes = week.reduce((sum, d) => sum + d.minutes, 0);
  const top = Math.max(goal, ...week.map((d) => d.minutes));
  const left = Math.max(0, goal - minutesToday(readingDays, now));

  return (
    <section className="flex flex-col rounded-3xl border border-line p-5" aria-labelledby="week-title">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="week-title" className="text-xl font-semibold">
            Апталық оқу белсенділігі
          </h2>
          <p className="text-muted">Күнделікті норма: {goal} минут</p>
        </div>
        <span className="rounded-full bg-[#d5ffda] px-3 py-1 text-sm font-medium text-[#23a016]">
          Осы аптада: {weekMinutes} мин
        </span>
      </div>

      <ol className="mt-6 grid h-[150px] grid-cols-7 items-end gap-2 md:gap-4" aria-label="Осы аптадағы оқу минуттары">
        {week.map((day) => (
          <li key={day.key} className="flex h-full flex-col items-center justify-end gap-1.5">
            {!day.future && (
              <span className="text-xs text-muted md:text-sm" aria-hidden="true">
                {day.minutes}м
              </span>
            )}
            <span
              className={`w-full max-w-[50px] rounded-t-[20px] transition-[height] duration-500 ${
                day.future ? "" : barColor(day.minutes, goal)
              } ${day.today ? "ring-2 ring-accent/50 ring-offset-2" : ""}`}
              style={{ height: day.future ? 0 : `${Math.max(12, (day.minutes / top) * 90)}px` }}
              aria-hidden="true"
            />
            <span className="sr-only">
              {day.name}: {day.minutes} минут
            </span>
          </li>
        ))}
      </ol>
      <ol className="mt-2 grid grid-cols-7 gap-2 text-center md:gap-4" aria-hidden="true">
        {week.map((day) => (
          <li key={day.key} className={`text-lg ${day.today ? "font-bold" : ""} ${day.future ? "text-muted" : ""}`}>
            {day.label}
          </li>
        ))}
      </ol>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-sm">
        <p className="text-muted">
          {left > 0 ? (
            <>
              🔥 Бүгінгі норманы орындауға <b className="font-semibold text-ink">{left} минут</b> қалды!
            </>
          ) : (
            <>✅ Бүгінгі норма орындалды. Жарайсыз!</>
          )}
        </p>
        <button type="button" onClick={onChangeGoal} className="font-medium text-amber-600 hover:underline">
          Норманы өзгерту
        </button>
      </div>
    </section>
  );
}

function Settings({ goalRef }: { goalRef: RefObject<HTMLSelectElement | null> }) {
  const { settings } = useAppState();

  return (
    <section className="mt-5 rounded-3xl border border-line bg-sidebar p-5" aria-labelledby="settings-title">
      <h2 id="settings-title" className="text-xl font-semibold">
        <span aria-hidden="true">⚙️ </span>Оқу және аккаунт параметрлері
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SettingRow title="Ағылшын дыбысталу акценті" hint="Сөздіктегі сөздердің дауысы">
          <Select
            label="Акцент"
            value={settings.accent}
            onChange={(value) => updateSettings({ accent: value as Accent })}
            options={ACCENTS.map((a) => [a, ACCENT_NAMES[a]])}
          />
        </SettingRow>
        <SettingRow title="Күнделікті оқу мақсаты" hint="Серия үзілмеуі үшін керекті уақыт">
          <Select
            label="Күнделікті мақсат"
            selectRef={goalRef}
            value={String(settings.dailyGoal)}
            onChange={(value) => updateSettings({ dailyGoal: Number(value) })}
            options={DAILY_GOALS.map((g) => [String(g), `${g} минут / күн`])}
          />
        </SettingRow>
        <SettingRow title="Менің деңгейім" hint="Кітапхана осы деңгейдегі кітаптардан басталады">
          <Select
            label="Деңгей"
            value={settings.level ?? ""}
            onChange={(value) => updateSettings({ level: (value || null) as Level | null })}
            options={[["", "Таңдалмаған"], ...LEVELS.map((l): [string, string] => [l, levelLabel(l)])]}
          />
        </SettingRow>
        <SettingRow title="Күнделікті еске салғыш (Telegram / Email)" hint="Кешкі сағат 20:00-де оқуды еске салу">
          <Soon />
        </SettingRow>
        <SettingRow title="Қараңғы режим" hint="Бағдарлама стилін өзгерту. Кітапта түн тақырыбы қазір де бар">
          <Soon />
        </SettingRow>
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Прогресс пен сөздікті осы браузерден өшіру керек пе?")) clearAllData();
          }}
          className="text-sm font-medium text-red-700 hover:underline"
        >
          Осы браузердегі деректерді өшіру
        </button>
        <p className="mt-3 text-sm text-muted">
          <Link href="/terms" className="hover:text-ink hover:underline">
            Пайдалану шарттары
          </Link>
          {" · "}
          <Link href="/privacy" className="hover:text-ink hover:underline">
            Құпиялылық саясаты
          </Link>
        </p>
      </div>
    </section>
  );
}

function SettingRow({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted">{hint}</p>
      </div>
      {children}
    </div>
  );
}

function Select({ label, value, onChange, options, selectRef }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
  selectRef?: RefObject<HTMLSelectElement | null>;
}) {
  return (
    <label className="relative shrink-0">
      <span className="sr-only">{label}</span>
      <select
        ref={selectRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 appearance-none rounded-xl bg-[#f2f2f2] py-0 pl-3 pr-9 text-sm font-semibold outline-accent focus:ring-2 focus:ring-accent"
      >
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
      <CaretIcon className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2" />
    </label>
  );
}

/** Settings shown in the design that need a service the site does not have yet. */
function Soon() {
  return <span className="shrink-0 rounded-full bg-chip px-3 py-1 text-xs font-medium text-muted">Жақында</span>;
}
