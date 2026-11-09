"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
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
      <Link href="/login" className="flex items-center gap-3 rounded-2xl p-1 hover:bg-chip">
        <Avatar letter="Қ" size="sm" />
        <span>
          <span className="block font-semibold">Қонақ</span>
          <span className="block text-xs text-amber-700">Кіру немесе тіркелу</span>
        </span>
      </Link>
    );
  }
  return (
    <Link href="/profile" className="flex min-w-0 items-center gap-3 rounded-2xl p-1 hover:bg-chip">
      <Avatar letter={data.user.email[0]} size="sm" />
      <span className="min-w-0">
        <span className="block truncate font-semibold">{data.user.email}</span>
        <span className="block text-xs text-muted">Аккаунт</span>
      </span>
    </Link>
  );
}

const KIND_TITLE: Record<EntitlementView["kind"], string> = {
  single_book: "Кітап",
  premium_monthly: "Alau Premium",
  premium_annual: "Alau Premium · жыл",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("kk-KZ", { day: "numeric", month: "long", year: "numeric" });

/** Profile: what the signed-in reader can read beyond the free chapters. */
export function TariffCard() {
  const { signedIn, entitlements } = useEntitlements();
  if (!signedIn) return null;
  const active = activeEntitlements(entitlements, new Date());
  return (
    <section className="mt-4 rounded-3xl border border-line p-5" aria-labelledby="tariff-title">
      <h2 id="tariff-title" className="font-semibold">
        Менің тарифім
      </h2>
      {active.length === 0 ? (
        <p className="mt-1 text-sm text-muted">
          Тегін тариф: әр кітаптың кульминацияға дейінгі бөлімі ашық. Толық оқу үшін кітаптың соңғы тегін тарауынан кейін тариф
          таңдаңыз.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {active.map((item, i) => (
            <li key={`${item.kind}-${item.work ?? ""}-${i}`} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="font-medium">
                {item.kind === "single_book" ? `${KIND_TITLE.single_book}: ${item.workTitle}` : KIND_TITLE[item.kind]}
                {item.demo && <span className="ml-2 rounded-full bg-chip px-2 py-0.5 text-xs font-normal text-muted">демо</span>}
              </span>
              <span className="text-sm text-muted">
                {item.expiresAt ? `${formatDate(item.expiresAt)} дейін` : "мерзімсіз"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
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
          await authClient.signOut();
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
