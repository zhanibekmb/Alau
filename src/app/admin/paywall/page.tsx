import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getDb } from "@/db";
import type { EntitlementKind } from "@/lib/access";
import { isAdminEmail } from "@/lib/admin";
import { findEdition } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/dal";
import { loadPaywallStats, type PaywallStats } from "@/lib/paywall-stats";

// Paywall results for the team (docs/paywall-plan.md, D11 and T8). Only emails in ADMIN_EMAILS.
//
// The check runs before anything streams, so everyone else gets a real 404 status rather than a
// 200 page that says "not found". That is why this page blocks (instant = false) and lives outside
// the (site) group, whose sidebar Suspense boundary would start the stream early.

export const instant = false;
export const metadata: Metadata = { title: "Пэйволл нәтижелері · Alau", robots: { index: false } };

const PLAN_NAMES: Record<EntitlementKind, string> = {
  single_book: "Осы кітап",
  premium_monthly: "Premium · ай",
  premium_annual: "Premium · жыл",
};

const DAY_MS = 24 * 60 * 60 * 1000;
const percent = (rate: number | null) => (rate === null ? "—" : `${Math.round(rate * 1000) / 10}%`);

export default async function PaywallResultsPage() {
  await connection();
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) {
    console.warn(`[admin] /admin/paywall refused for ${user ? `user ${user.id}` : "a guest"}`);
    notFound();
  }

  const [week, month] = await loadPeriods();
  const periods: [string, PaywallStats][] = [
    ["7 күн", week],
    ["30 күн", month],
  ];

  return (
    <main className="mx-auto w-full max-w-[913px] px-5 py-8 md:px-8 md:py-12">
      <Link href="/" className="text-sm text-muted hover:text-ink">
        ← Кітапхана
      </Link>
      <h1 className="mt-3 text-3xl font-bold">Пэйволл нәтижелері</h1>
      <p className="mt-1 text-sm text-muted">
        Адам — аккаунт немесе кірмеген браузер. «Тариф таңдады»: interest режиміндегі таңдау немесе демо ашу.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="text-muted">
            <tr className="border-b border-line">
              <th className="py-2 pr-4 font-medium">Көрсеткіш</th>
              {periods.map(([label]) => (
                <th key={label} className="py-2 pr-4 text-right font-medium">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label="Пэйволлды көрді (адам)" values={periods.map(([, s]) => s.shown.people)} />
            <Row label="Пэйволл көрсетілді (рет)" values={periods.map(([, s]) => s.shown.events)} />
            <Row label="Тариф таңдады (адам)" values={periods.map(([, s]) => s.chose.people)} />
            <Row label="Таңдау үлесі" values={periods.map(([, s]) => percent(s.rate))} strong />
            <Row label="Тіркелді" values={periods.map(([, s]) => s.signups)} />
            {week.byPlan.map(({ plan }, i) => (
              <Row
                key={plan}
                label={`Таңдады: ${PLAN_NAMES[plan]}`}
                values={periods.map(([, s]) => s.byPlan[i].people)}
                muted
              />
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">Кітап пен деңгей бойынша · 30 күн</h2>
      {month.byBook.length === 0 ? (
        <p className="mt-3 text-muted">Әзірге оқиға жоқ.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="text-muted">
              <tr className="border-b border-line">
                <th className="py-2 pr-4 font-medium">Кітап</th>
                <th className="py-2 pr-4 font-medium">Деңгей</th>
                <th className="py-2 pr-4 text-right font-medium">Көрді</th>
                <th className="py-2 pr-4 text-right font-medium">Таңдады</th>
                <th className="py-2 text-right font-medium">Үлес</th>
              </tr>
            </thead>
            <tbody>
              {month.byBook.map((row) => {
                const info = findEdition(row.slug)?.info;
                return (
                  <tr key={row.slug} className="border-b border-line">
                    <td className="py-2 pr-4">{info?.title ?? row.slug}</td>
                    <td className="py-2 pr-4">{info?.level ?? "—"}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{row.shown}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{row.chose}</td>
                    <td className="py-2 text-right tabular-nums">{percent(row.rate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

/** The last 7 and 30 days, counted back from this request. */
function loadPeriods() {
  const now = Date.now();
  const db = getDb();
  return Promise.all([
    loadPaywallStats(db, new Date(now - 7 * DAY_MS)),
    loadPaywallStats(db, new Date(now - 30 * DAY_MS)),
  ]);
}

function Row({ label, values, strong, muted }: { label: string; values: (number | string)[]; strong?: boolean; muted?: boolean }) {
  return (
    <tr className={`border-b border-line ${muted ? "text-muted" : ""}`}>
      <td className={`py-2 pr-4 ${strong ? "font-semibold" : ""}`}>{label}</td>
      {values.map((value, i) => (
        <td key={i} className={`py-2 pr-4 text-right tabular-nums ${strong ? "font-semibold" : ""}`}>
          {value}
        </td>
      ))}
    </tr>
  );
}
