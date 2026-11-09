"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { EntitlementKind } from "@/lib/access";
import { getAnonId } from "@/lib/anon-id";
import { PREMIUM_PLANS, SINGLE_BOOK_TITLE } from "@/lib/plans";
import type { BookInfo } from "@/lib/types";
import { LEGAL } from "@/content/legal";
import { Mascot } from "../brand";
import { CheckIcon } from "../icons";

// The paywall at the first paid chapter (docs/paywall-plan.md, T6).
//
//   guest      → choose → /login?mode=sign-up&next=<this chapter>   (choice is made again after sign-in)
//   signed in  → choose → POST /api/paywall/choice
//                           ├─ unlocked (demo)      → onUnlocked(): the reader loads the chapter
//                           ├─ not unlocked (interest) → "payment opens soon"
//                           └─ 401 / 429 / 503 / offline → message, button works again

type Option = { kind: EntitlementKind; title: string; price: number; per: string; note: string; best?: boolean };

const formatTenge = (n: number) => `${n.toLocaleString("ru-RU")} ₸`;

function options(book: BookInfo): Option[] {
  const [monthly, annual] = PREMIUM_PLANS;
  return [
    {
      kind: "single_book",
      title: SINGLE_BOOK_TITLE,
      price: book.paywall?.priceTenge ?? 0,
      per: "бір рет",
      note: "Барлық деңгейде, мерзімсіз",
    },
    { kind: monthly.kind, title: monthly.title, price: monthly.priceTenge, per: "/ ай", note: monthly.note, best: true },
    { kind: annual.kind, title: annual.title, price: annual.priceTenge, per: "/ жыл", note: annual.note },
  ];
}

const post = (url: string, body: object) =>
  fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

export function Paywall({
  book,
  chapter,
  needsLogin,
  onUnlocked,
}: {
  book: BookInfo;
  chapter: number;
  needsLogin: boolean;
  onUnlocked: () => void;
}) {
  const router = useRouter();
  const choices = options(book);
  const [selected, setSelected] = useState<EntitlementKind>("premium_monthly");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interestSaved, setInterestSaved] = useState(false);
  const firstPage = book.chapters.find((c) => c.n === chapter)?.firstPage ?? 1;
  const returnTo = `/read/${book.slug}?page=${firstPage}`;
  const loginHref = `/login?mode=sign-up&next=${encodeURIComponent(returnTo)}`;

  // Count the view once per chapter (React may run effects twice in development).
  const counted = useRef<string | null>(null);
  useEffect(() => {
    const key = `${book.slug}/${chapter}`;
    if (counted.current === key) return;
    counted.current = key;
    post("/api/paywall/seen", { work: book.work, slug: book.slug, chapter, anonId: getAnonId() }).catch(() => {});
  }, [book.slug, book.work, chapter]);

  const choose = async () => {
    if (busy) return;
    if (needsLogin) {
      router.push(loginHref);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await post("/api/paywall/choice", {
        plan: selected,
        work: book.work,
        slug: book.slug,
        chapter,
        anonId: getAnonId(),
      });
      if (response.status === 401) {
        router.push(loginHref);
        return;
      }
      if (!response.ok) {
        setError(response.status === 429 ? "Тым көп әрекет. Бір минуттан кейін қайталаңыз." : "Бір нәрсе дұрыс болмады. Қайталап көріңіз.");
        return;
      }
      const result = (await response.json()) as { unlocked: boolean };
      if (result.unlocked) onUnlocked();
      else setInterestSaved(true);
    } catch {
      setError("Байланыс жоқ. Интернетті тексеріп, қайталаңыз.");
    } finally {
      setBusy(false);
    }
  };

  if (interestSaved) {
    return (
      <section className="flex flex-col items-center gap-3 py-12 text-center" aria-live="polite">
        <Mascot pose="subscription" className="size-24" />
        <h2 className="text-2xl font-bold">Рақмет!</h2>
        <p className="max-w-sm text-[var(--r-muted)]">
          Таңдауыңызды сақтадық. Төлем жақында ашылады, сонда осы кітапты бірден жалғастыра аласыз.
        </p>
        {/* Testers get early access by hand on /admin/paywall. */}
        <p className="max-w-sm text-sm text-[var(--r-muted)]">
          Ерте қолжетімділік керек болса, жазыңыз:{" "}
          <a href={`mailto:${LEGAL.contactEmail}`} className="font-medium text-amber-700 underline underline-offset-2">
            {LEGAL.contactEmail}
          </a>
        </p>
        <Link href="/" className="mt-2 rounded-2xl border border-[var(--r-line)] px-5 py-3 font-medium">
          Кітапханаға оралу
        </Link>
      </section>
    );
  }

  const current = choices.find((c) => c.kind === selected)!;

  return (
    <section className="py-6 md:py-10" aria-labelledby="paywall-title">
      <div className="flex flex-col items-center text-center">
        <Mascot pose="subscription" className="size-20" />
        <h2 id="paywall-title" className="mt-3 text-2xl font-bold md:text-3xl">
          Тегін бөлім осы жерде аяқталды
        </h2>
        <p className="mt-2 max-w-md text-[var(--r-muted)]">
          Алғашқы {book.paywall?.freeChapters ?? ""} тарау тегін болды. Жалғасын оқу үшін тариф таңдаңыз.
        </p>
      </div>

      <div role="radiogroup" aria-label="Тариф" className="mt-6 flex flex-col gap-3">
        {choices.map((option) => {
          const active = option.kind === selected;
          return (
            <button
              key={option.kind}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(option.kind)}
              className={`relative flex items-center gap-3 rounded-2xl border-2 bg-[var(--r-panel)] p-4 text-left transition-colors ${
                active ? "border-accent" : "border-[var(--r-line)]"
              }`}
            >
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  active ? "border-accent bg-accent text-on-accent" : "border-[var(--r-line)]"
                }`}
              >
                {active && <CheckIcon className="size-4" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2 font-semibold">
                  {option.title}
                  {option.best && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-on-accent">Тиімді</span>
                  )}
                </span>
                <span className="block text-sm text-[var(--r-muted)]">{option.note}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-bold">{formatTenge(option.price)}</span>
                <span className="block text-xs text-[var(--r-muted)]">{option.per}</span>
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={choose}
        disabled={busy}
        className="mt-5 h-14 w-full rounded-2xl bg-accent text-lg font-semibold text-on-accent disabled:opacity-60"
      >
        {busy ? "Күте тұрыңыз…" : needsLogin ? "Тіркеліп, жалғастыру" : `Таңдау · ${formatTenge(current.price)}`}
      </button>
      {needsLogin && (
        <p className="mt-3 text-center text-sm text-[var(--r-muted)]">
          Аккаунтыңыз бар ма?{" "}
          <Link href={`/login?next=${encodeURIComponent(returnTo)}`} className="font-medium text-amber-700 underline underline-offset-2">
            Кіру
          </Link>
        </p>
      )}
    </section>
  );
}
