"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { daysLeft, formatKkDate, remainingText } from "@/lib/kk-date";
import { findPremiumPlan } from "@/lib/plans";
import { useNow } from "@/lib/use-now";
import { flushBeforeSignOut, forgetAccountData } from "@/lib/sync-client";
import { activeEntitlements, type EntitlementView } from "@/lib/entitlement-view";
import { useEntitlements } from "@/lib/use-entitlements";

function Avatar({ letter, size }: { letter: string; size: "sm" | "lg" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-on-accent ${
        size === "lg" ? "size-16 text-2xl" : "size-10"
      }`}
    >
      {letter.toUpperCase()}
    </span>
  );
}

/** Bottom of the sidebar: who is reading. */
export function AccountBadge() {
  const { data, isPending } = authClient.useSession();
  if (isPending) return <div className="h-10" aria-hidden="true" />;
  if (!data) {
    return (
      <Link href="/login" title="Кіру немесе тіркелу" className="flex items-center gap-3 rounded-2xl p-1 hover:bg-chip collapsed:justify-center">
        <Avatar letter="Қ" size="sm" />
        <span className="collapsed:hidden">
          <span className="block font-semibold">Қонақ</span>
          <span className="block text-xs text-amber-700">Кіру немесе тіркелу</span>
        </span>
      </Link>
    );
  }
  return (
    <Link href="/profile" title={data.user.email} className="flex min-w-0 items-center gap-3 rounded-2xl p-1 hover:bg-chip collapsed:justify-center">
      <Avatar letter={data.user.email[0]} size="sm" />
      <span className="min-w-0 collapsed:hidden">
        <span className="block truncate font-semibold">{data.user.email}</span>
        <span className="block text-xs text-muted">Аккаунт</span>
      </span>
    </Link>
  );
}

/** A Premium purchase that ends within this many days is shown in amber. */
const ENDING_SOON_DAYS = 3;

/** Profile: what the signed-in reader can read beyond the free chapters. */
export function TariffCard() {
  const { signedIn, entitlements } = useEntitlements();
  const now = useNow();
  if (!signedIn || !now) return null;
  const active = activeEntitlements(entitlements, now);
  const premium = active.filter((item) => item.kind !== "single_book");
  const books = active.filter((item) => item.kind === "single_book");

  return (
    <section className="mt-4 rounded-3xl border border-line p-5" aria-labelledby="tariff-title">
      <h2 id="tariff-title" className="font-semibold">
        Менің тарифім
      </h2>

      {active.length === 0 && (
        <div className="mt-3 rounded-2xl bg-sidebar p-4">
          <p className="font-semibold">Тегін тариф</p>
          <p className="mt-1 text-sm text-muted">
            Әр кітаптың кульминацияға дейінгі бөлімі ашық. Толық оқу үшін соңғы тегін тараудан кейін тариф таңдаңыз.
          </p>
        </div>
      )}

      {premium.map((item, i) => (
        <PremiumRow key={`${item.kind}-${i}`} item={item} now={now} />
      ))}

      {books.length > 0 && (
        <ul className="mt-3 flex flex-col divide-y divide-line rounded-2xl border border-line">
          {books.map((item) => (
            <li key={item.work} className="flex items-center gap-3 p-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-lg" aria-hidden="true">
                📖
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{item.workTitle}</span>
                <span className="block text-sm text-muted">Барлық деңгей · мерзімсіз, кітап сізде қалады</span>
              </span>
              {item.demo && <DemoBadge />}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function PremiumRow({ item, now }: { item: EntitlementView; now: Date }) {
  const end = new Date(item.expiresAt!);
  const total = findPremiumPlan(item.kind)?.days ?? 30;
  const left = daysLeft(end, now);
  const share = Math.min(1, Math.max(0, (end.getTime() - now.getTime()) / (total * 24 * 60 * 60 * 1000)));
  const endingSoon = left <= ENDING_SOON_DAYS;
  const title = findPremiumPlan(item.kind)?.title ?? "Alau Premium";

  return (
    <div className="mt-3 rounded-2xl bg-gradient-to-br from-accent-soft to-white p-4 ring-1 ring-accent/30">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">⭐</span>
        <p className="font-semibold">{title}</p>
        <span className="ml-auto flex items-center gap-1.5">
          {item.demo && <DemoBadge />}
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">Белсенді</span>
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">Барлық кітап толық ашық</p>

      <p className={`mt-4 text-2xl font-bold ${endingSoon ? "text-amber-700" : ""}`}>{remainingText(end, now)}</p>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-white ring-1 ring-line"
        role="progressbar"
        aria-label="Тарифтің қалған мерзімі"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={left}
      >
        <div
          className={`h-full rounded-full ${endingSoon ? "bg-amber-500" : "bg-accent"}`}
          style={{ width: `${Math.round(share * 100)}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-muted">
        Аяқталу күні: <span className="font-medium text-ink">{formatKkDate(end)}</span>
      </p>
    </div>
  );
}

function DemoBadge() {
  return (
    <span className="rounded-full bg-chip px-2 py-0.5 text-xs text-muted" title="Демо режим: нақты төлем болған жоқ">
      демо
    </span>
  );
}


/** Top of the profile page: guest invitation or account with sign-out. */
export function AccountCard() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [signingOut, setSigningOut] = useState(false);

  if (isPending) return <section className="mt-6 h-[104px] rounded-3xl bg-sidebar" aria-hidden="true" />;

  if (!data) {
    return (
      <section className="mt-6 flex flex-wrap items-center gap-4 rounded-3xl bg-sidebar p-5">
        <Avatar letter="Қ" size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-xl font-bold">Қонақ</p>
          <p className="text-sm text-muted">Прогресс пен сөздік осы браузерде сақталады.</p>
        </div>
        <Link href="/login?next=/profile" className="rounded-2xl bg-accent px-5 py-3 font-medium text-on-accent">
          Кіру
        </Link>
      </section>
    );
  }

  return (
    <section className="mt-6 flex flex-wrap items-center gap-4 rounded-3xl bg-sidebar p-5">
      <Avatar letter={data.user.email[0]} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xl font-bold">{data.user.email}</p>
        <p className="text-sm text-muted">Аккаунтқа кірдіңіз.</p>
      </div>
      <button
        type="button"
        disabled={signingOut}
        onClick={async () => {
          setSigningOut(true);
          await flushBeforeSignOut();
          const { error } = await authClient.signOut();
          // The account's progress and words are on the server; a shared computer keeps none of them.
          if (!error) forgetAccountData();
          setSigningOut(false);
          router.refresh();
        }}
        className="rounded-2xl border border-line bg-white px-5 py-3 font-medium disabled:opacity-60"
      >
        {signingOut ? "Шығып жатырмыз…" : "Шығу"}
      </button>
    </section>
  );
}
