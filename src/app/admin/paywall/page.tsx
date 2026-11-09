import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getDb } from "@/db";
import type { EntitlementKind } from "@/lib/access";
import { isAdminEmail } from "@/lib/admin";
import { findEdition, findPaidWork, listPaidWorks } from "@/lib/catalog";
import { formatKkDate } from "@/lib/kk-date";
import { listManualGrants, listPlanRequests, type ManualGrant, type PlanRequest } from "@/lib/manual-access";
import { currentPaymentsMode } from "@/lib/payments-mode";
import { findPremiumPlan } from "@/lib/plans";
import { transferDetails } from "@/lib/transfer";
import { getCurrentUser } from "@/lib/dal";
import { loadPaywallStats, type PaywallStats } from "@/lib/paywall-stats";
import { grantRequestAction, revokeAction } from "./actions";
import { GrantForm } from "./grant-form";

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

  const [[week, month], grants, requests] = await Promise.all([
    loadPeriods(),
    listManualGrants(getDb()),
    listPlanRequests(getDb(), new Date()),
  ]);
  const mode = currentPaymentsMode();
  const works = listPaidWorks().map(({ work, title }) => ({ work, title }));
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

      <ModeNote mode={mode} />

      <section className="mt-8" aria-labelledby="requests-title">
        <h2 id="requests-title" className="text-xl font-bold">
          Тариф сұраныстары
        </h2>
        <p className="mt-1 text-sm text-muted">
          Тариф таңдаған оқырмандар. Kaspi-де аударым мен түсініктемедегі email-ды тексеріп, «Ашу» батырмасын басыңыз.
        </p>
        <RequestsTable requests={requests} />
      </section>

      <section className="mt-10" aria-labelledby="grant-title">
        <h2 id="grant-title" className="text-xl font-bold">
          Қолмен қолжетімділік беру
        </h2>
        <p className="mt-1 text-sm text-muted">Тестерлерге тегін немесе аударма арқылы төлегендерге.</p>
        <GrantForm works={works} />
        <GrantsTable grants={grants} />
      </section>

      <h2 className="mt-10 text-xl font-bold">Пэйволл көрсеткіштері</h2>
      <div className="mt-3 overflow-x-auto">
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

/** Which payment mode is on, so the admin knows what readers see. */
function ModeNote({ mode }: { mode: "demo" | "interest" | "transfer" }) {
  const text =
    mode === "demo"
      ? "Режим: demo — тариф таңдаған кезде қолжетімділік бірден ашылады. Тек өз компьютеріңізде қолданыңыз."
      : mode === "transfer"
        ? transferDetails()
          ? "Режим: transfer — оқырман Kaspi аударымы туралы нұсқаулықты көреді, қолжетімділікті сіз ашасыз."
          : "Режим: transfer, бірақ .env ішінде TRANSFER_KASPI, TRANSFER_NAME, TRANSFER_CONTACT толық емес — оқырман нұсқаулықты көрмейді."
        : "Режим: interest — таңдау тек жазылады, оқырман «Төлем жақында ашылады» деген хабарды көреді.";
  const warn = mode === "demo" || (mode === "transfer" && !transferDetails());
  return (
    <p className={`mt-5 rounded-2xl px-4 py-3 text-sm ${warn ? "bg-amber-50 text-amber-900" : "bg-sidebar text-muted"}`}>{text}</p>
  );
}

function requestPrice(request: PlanRequest): number | null {
  if (request.plan === "single_book") return request.work ? (findPaidWork(request.work)?.priceTenge ?? null) : null;
  return findPremiumPlan(request.plan)?.priceTenge ?? null;
}

function RequestsTable({ requests }: { requests: PlanRequest[] }) {
  if (requests.length === 0) return <p className="mt-4 text-sm text-muted">Әзірге сұраныс жоқ.</p>;
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="text-muted">
          <tr className="border-b border-line">
            <th className="py-2 pr-4 font-medium">Оқырман</th>
            <th className="py-2 pr-4 font-medium">Тариф</th>
            <th className="py-2 pr-4 text-right font-medium">Сомасы</th>
            <th className="py-2 pr-4 font-medium">Қашан</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            const price = requestPrice(request);
            const planValue = request.plan === "single_book" ? `book:${request.work}` : request.plan;
            return (
              <tr key={`${request.userId}-${planValue}`} className="border-b border-line">
                <td className="py-2 pr-4">{request.email}</td>
                <td className="py-2 pr-4">
                  {request.work ? `Кітап: ${findPaidWork(request.work)?.title ?? request.work}` : PLAN_NAMES[request.plan]}
                </td>
                <td className="py-2 pr-4 text-right tabular-nums">{price ? `${price.toLocaleString("ru-RU")} ₸` : "—"}</td>
                <td className="py-2 pr-4 text-muted">{formatKkDate(request.at)}</td>
                <td className="py-2 text-right">
                  {request.granted ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">Ашылған</span>
                  ) : (
                    <form action={grantRequestAction}>
                      <input type="hidden" name="email" value={request.email} />
                      <input type="hidden" name="plan" value={planValue} />
                      <button type="submit" className="rounded-lg bg-accent px-3 py-1 font-semibold text-white">
                        Ашу
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GrantsTable({ grants }: { grants: ManualGrant[] }) {
  if (grants.length === 0) return <p className="mt-4 text-sm text-muted">Берілген қолжетімділік әлі жоқ.</p>;
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="text-muted">
          <tr className="border-b border-line">
            <th className="py-2 pr-4 font-medium">Оқырман</th>
            <th className="py-2 pr-4 font-medium">Не берілді</th>
            <th className="py-2 pr-4 font-medium">Қайдан</th>
            <th className="py-2 pr-4 font-medium">Мерзімі</th>
            <th className="py-2 pr-4 font-medium">Берілген күні</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {grants.map((grant) => (
            <tr key={grant.id} className="border-b border-line">
              <td className="py-2 pr-4">{grant.email}</td>
              <td className="py-2 pr-4">
                {grant.work ? `Кітап: ${findPaidWork(grant.work)?.title ?? grant.work}` : PLAN_NAMES[grant.kind]}
              </td>
              <td className="py-2 pr-4">
                <span className={`rounded-full px-2 py-0.5 text-xs ${grant.source === "demo" ? "bg-chip text-muted" : "bg-accent-soft text-amber-800"}`}>
                  {grant.source === "demo" ? "демо" : "қолмен"}
                </span>
              </td>
              <td className="py-2 pr-4">
                {grant.expiresAt ? `${formatKkDate(grant.startsAt)} – ${formatKkDate(grant.expiresAt)}` : "мерзімсіз"}
              </td>
              <td className="py-2 pr-4 text-muted">{formatKkDate(grant.createdAt)}</td>
              <td className="py-2 text-right">
                <form action={revokeAction}>
                  <input type="hidden" name="id" value={grant.id} />
                  <button type="submit" className="rounded-lg px-2 py-1 text-red-700 hover:bg-red-50">
                    Қайтарып алу
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
