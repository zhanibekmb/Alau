"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { activeEntitlements, type EntitlementView } from "@/lib/entitlement-view";
import { daysLeft, formatKkDate, remainingText } from "@/lib/kk-date";
import { findPremiumPlan } from "@/lib/plans";
import { flushBeforeSignOut, forgetAccountData } from "@/lib/sync-client";
import { useEntitlements } from "@/lib/use-entitlements";
import { useNow } from "@/lib/use-now";
import { Mascot } from "./brand";
import { LogoutIcon } from "./icons";

/** "Жанатбек Қалниязов" → "ЖҚ"; "aikyn" → "A". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : (parts[0]?.[0] ?? "Қ")).toUpperCase();
}

export function Avatar({ name, className = "size-10" }: { name: string; className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-white ${className}`}>
      {initials(name)}
    </span>
  );
}

/** Sign-out that first sends queued changes, then removes the account's data from this browser. */
export function useSignOut() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const signOut = async () => {
    setSigningOut(true);
    await flushBeforeSignOut();
    const { error } = await authClient.signOut();
    // The account's progress and words are on the server; a shared computer keeps none of them.
    if (!error) forgetAccountData();
    setSigningOut(false);
    router.refresh();
  };
  return { signOut, signingOut };
}

/** Premium still in force, for the "Alau Pro" mark and the subscription card. */
function usePlan() {
  const { signedIn, entitlements } = useEntitlements();
  const now = useNow();
  const active = now ? activeEntitlements(entitlements, now) : [];
  return {
    signedIn,
    now,
    premium: active.filter((item) => item.kind !== "single_book"),
    books: active.filter((item) => item.kind === "single_book"),
  };
}

/** Bottom of the desktop sidebar: who is reading, their plan, and sign-out (Figma, Desktop). */
export function AccountBadge() {
  const { data, isPending } = authClient.useSession();
  const { premium } = usePlan();
  const { signOut, signingOut } = useSignOut();

  if (isPending) return <div className="h-11" aria-hidden="true" />;
  if (!data) {
    return (
      <Link
        href="/login"
        title="Кіру немесе тіркелу"
        className="flex items-center gap-3 rounded-2xl p-1 hover:bg-chip collapsed:justify-center"
      >
        <Avatar name="Қонақ" />
        <span className="collapsed:hidden">
          <span className="block font-semibold">Қонақ</span>
          <span className="block text-xs font-medium text-amber-600">Кіру немесе тіркелу</span>
        </span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 collapsed:flex-col">
      <Link
        href="/profile"
        title={data.user.email}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-1 hover:bg-chip collapsed:flex-none"
      >
        <Avatar name={data.user.name || data.user.email} />
        <span className="min-w-0 collapsed:hidden">
          <span className="block truncate font-semibold">{data.user.name || data.user.email}</span>
          {premium.length > 0 ? (
            <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
              <ProBadge />
              Premium
            </span>
          ) : (
            <span className="block text-xs text-muted">Тегін тариф</span>
          )}
        </span>
      </Link>
      <button
        type="button"
        onClick={signOut}
        disabled={signingOut}
        aria-label="Шығу"
        title="Шығу"
        className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-chip hover:text-ink disabled:opacity-50"
      >
        <LogoutIcon className="size-5" />
      </button>
    </div>
  );
}

/** Small "PRO" plate for Premium readers (replaces the crown emoji from the Figma sidebar). */
export function ProBadge() {
  return (
    <span className="inline-flex h-[18px] items-center rounded-md bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 text-[10px] leading-none font-bold tracking-[0.08em] text-white shadow-sm shadow-orange-500/30">
      PRO
    </span>
  );
}

/** A Premium purchase that ends within this many days is shown in amber. */
const ENDING_SOON_DAYS = 3;

/** Profile: the dark subscription card (Figma, profile). */
export function SubscriptionCard() {
  const { signedIn, now, premium, books } = usePlan();
  const plan = premium[0];

  return (
    <section className="flex min-h-[300px] flex-col overflow-hidden rounded-3xl bg-[#201f4b] p-6 text-white" aria-labelledby="subscription-title">
      {plan && now ? (
        <PremiumInfo item={plan} now={now} />
      ) : (
        <>
          <p className="text-sm text-white/60">Менің тарифім</p>
          <h2 id="subscription-title" className="mt-1 text-2xl font-bold">
            Тегін тариф
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Әр кітаптың кульминацияға дейінгі бөлімі ашық. Толық оқу үшін соңғы тегін тараудан кейін тариф таңдаңыз.
          </p>
          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            {!signedIn ? (
              <Link href="/login?mode=sign-up&next=/profile" className="mb-1 rounded-2xl bg-accent px-5 py-3 font-semibold text-on-accent">
                Тіркелу
              </Link>
            ) : (
              <span />
            )}
            <Mascot pose="subscription" className="-mb-3 -mr-3 size-28 shrink-0" />
          </div>
        </>
      )}

      {books.length > 0 && (
        <ul className="mt-4 flex flex-col gap-1.5 border-t border-white/15 pt-4 text-sm">
          {books.map((item) => (
            <li key={item.work} className="flex items-center gap-2">
              <span aria-hidden="true">📖</span>
              <span className="min-w-0 flex-1 truncate">{item.workTitle}</span>
              <span className="text-white/60">мерзімсіз</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function PremiumInfo({ item, now }: { item: EntitlementView; now: Date }) {
  const end = new Date(item.expiresAt!);
  const plan = findPremiumPlan(item.kind);
  const total = plan?.days ?? 30;
  const left = daysLeft(end, now);
  const share = Math.min(1, Math.max(0, (end.getTime() - now.getTime()) / (total * 24 * 60 * 60 * 1000)));
  const endingSoon = left <= ENDING_SOON_DAYS;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        {item.demo ? (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70" title="Демо режим: нақты төлем болған жоқ">
            демо
          </span>
        ) : (
          <span />
        )}
        <span className="flex items-center gap-1.5 text-sm font-medium text-[#45db00]">
          <span className="size-2.5 rounded-full bg-[#45db00]" aria-hidden="true" />
          Белсенді
        </span>
      </div>
      <h2 id="subscription-title" className="mt-5 text-3xl font-bold">
        Alau Premium
      </h2>
      <p className="mt-1 text-sm text-white/70">
        {item.kind === "premium_annual" ? "Жылдық" : "Айлық"} жазылым · барлық кітап толық ашық
      </p>

      {/* The mascot sits beside the dates, never on top of them. */}
      <div className="mt-auto flex items-end gap-2 pt-6">
        <div className="min-w-0 flex-1">
        <p className={`text-xl font-bold ${endingSoon ? "text-amber-300" : ""}`}>{remainingText(end, now)}</p>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-white/15"
          role="progressbar"
          aria-label="Тарифтің қалған мерзімі"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={left}
        >
          <div
            className={`h-full rounded-full ${endingSoon ? "bg-amber-400" : "bg-accent"}`}
            style={{ width: `${Math.round(share * 100)}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-white/70">
          Аяқталу күні: <span className="font-medium whitespace-nowrap text-white">{formatKkDate(end)}</span>
        </p>
        </div>
        <Mascot pose="subscription" className="-mb-3 -mr-3 size-24 shrink-0 md:size-28" />
      </div>
    </>
  );
}
