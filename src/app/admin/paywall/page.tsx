import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getDb } from "@/db";
import { isAdminEmail } from "@/lib/admin";
import { findEdition, listPaidWorks } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/dal";
import { listManualGrants, listPlanRequests, listReaders } from "@/lib/manual-access";
import { currentPaymentsMode } from "@/lib/payments-mode";
import { loadPaywallStats, type PaywallStats } from "@/lib/paywall-stats";
import { transferDetails } from "@/lib/transfer";
import { GrantForm } from "./grant-form";
import { GrantsTable, Pager, PLAN_NAMES, ReadersTable, RequestsTable, Toolbar, hrefWith, type Params } from "./parts";

// Admin panel (docs/paywall-plan.md, D11 and T8). Only emails in ADMIN_EMAILS.
//
//   ?tab=requests  readers who chose a tariff; "Ашу" gives exactly that   (default)
//   ?tab=access    give access by email; every hand-given or demo access, with revoke
//   ?tab=readers   every account with what it can read
//   ?tab=stats     paywall numbers for 7 and 30 days
//
// Every list has an email search, filters and 25-row pages, all in the address (?q=…&page=2).
//
// The admin check runs before anything streams, so everyone else gets a real 404 status rather
// than a 200 page that says "not found". That is why this page blocks (instant = false) and lives
// outside the (site) group, whose sidebar Suspense boundary would start the stream early.

export const instant = false;
export const metadata: Metadata = { title: "Әкімші панелі · Alau", robots: { index: false } };

type Tab = "requests" | "access" | "readers" | "stats";
const TABS: { id: Tab; label: string }[] = [
  { id: "requests", label: "Сұраныстар" },
  { id: "access", label: "Қолжетімділік" },
  { id: "readers", label: "Оқырмандар" },
  { id: "stats", label: "Көрсеткіштер" },
];

const DAY_MS = 24 * 60 * 60 * 1000;
const percent = (rate: number | null) => (rate === null ? "—" : `${Math.round(rate * 1000) / 10}%`);

export default async function AdminPage({ searchParams }: { searchParams: Promise<Params> }) {
  await connection();
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) {
    console.warn(`[admin] /admin/paywall refused for ${user ? `user ${user.id}` : "a guest"}`);
    notFound();
  }

  const raw = await searchParams;
  const params: Params = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
  const tab: Tab = TABS.some((t) => t.id === params.tab) ? (params.tab as Tab) : "requests";
  const data = await loadTab(tab, params);

  return (
    <main className="mx-auto w-full max-w-[1100px] px-5 py-8 md:px-8 md:py-12">
      <Link href="/" className="text-sm text-muted hover:text-ink">
        ← Кітапхана
      </Link>
      <h1 className="mt-3 text-3xl font-bold">Әкімші панелі</h1>
      <ModeNote />

      <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-line" aria-label="Бөлімдер">
        {TABS.map(({ id, label }) => (
          <Link
            key={id}
            href={hrefWith({}, { tab: id })}
            aria-current={tab === id ? "page" : undefined}
            className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-2.5 pt-1 font-medium transition-colors ${
              tab === id ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {label}
            {id === "requests" && data.pending > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">{data.pending}</span>
            )}
          </Link>
        ))}
      </nav>

      {data.tab === "requests" && (
        <section>
          <p className="mt-5 text-sm text-muted">
            Тариф таңдаған оқырмандар. Kaspi-де соманы және түсініктемедегі email-ды тексеріп, «Ашу» батырмасын басыңыз.
          </p>
          <Toolbar
            tab="requests"
            params={params}
            filters={[
              {
                name: "status",
                label: "Күйі",
                options: [
                  ["pending", "Күтуде"],
                  ["granted", "Ашылған"],
                  ["all", "Барлығы"],
                ],
              },
            ]}
          />
          <RequestsTable page={data.list} />
          <Pager page={data.list} params={params} />
        </section>
      )}

      {data.tab === "access" && (
        <section>
          <GrantForm works={data.works} defaultEmail={params.email ?? ""} key={params.email ?? ""} />
          <h2 className="mt-8 text-lg font-semibold">Берілген қолжетімділік</h2>
          <Toolbar
            tab="access"
            params={params}
            filters={[
              {
                name: "status",
                label: "Мерзімі",
                options: [
                  ["all", "Барлығы"],
                  ["active", "Белсенді"],
                  ["expired", "Аяқталған"],
                ],
              },
              {
                name: "source",
                label: "Қайдан",
                options: [
                  ["all", "Барлығы"],
                  ["manual", "Қолмен"],
                  ["demo", "Демо"],
                ],
              },
            ]}
          />
          <GrantsTable page={data.list} now={data.now} />
          <Pager page={data.list} params={params} />
        </section>
      )}

      {data.tab === "readers" && (
        <section>
          <Toolbar
            tab="readers"
            params={params}
            filters={[
              {
                name: "access",
                label: "Қолжетімділік",
                options: [
                  ["all", "Барлығы"],
                  ["paid", "Ақылы"],
                  ["free", "Тегін"],
                ],
              },
            ]}
          />
          <ReadersTable page={data.list} />
          <Pager page={data.list} params={params} />
        </section>
      )}

      {data.tab === "stats" && <Stats week={data.week} month={data.month} />}
    </main>
  );
}

const pageOf = (params: Params) => Math.max(1, Number(params.page) || 1);
const oneOf = <T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

/** Loads only what the open tab shows, plus the number of waiting requests for its badge. */
async function loadTab(tab: Tab, params: Params) {
  const db = getDb();
  const now = new Date();
  const query = params.q ?? "";
  const pendingPage = listPlanRequests(db, { status: "pending", now, page: 1 }).then((p) => p.total);

  if (tab === "access") {
    const [list, pending] = await Promise.all([
      listManualGrants(db, {
        query,
        now,
        page: pageOf(params),
        status: oneOf(params.status, ["all", "active", "expired"] as const, "all"),
        source: oneOf(params.source, ["all", "manual", "demo"] as const, "all"),
      }),
      pendingPage,
    ]);
    return { tab, list, pending, now, works: listPaidWorks().map(({ work, title }) => ({ work, title })) } as const;
  }
  if (tab === "readers") {
    const [list, pending] = await Promise.all([
      listReaders(db, { query, now, page: pageOf(params), access: oneOf(params.access, ["all", "paid", "free"] as const, "all") }),
      pendingPage,
    ]);
    return { tab, list, pending } as const;
  }
  if (tab === "stats") {
    const [week, month, pending] = await Promise.all([
      loadPaywallStats(db, new Date(now.getTime() - 7 * DAY_MS)),
      loadPaywallStats(db, new Date(now.getTime() - 30 * DAY_MS)),
      pendingPage,
    ]);
    return { tab, week, month, pending } as const;
  }
  const status = oneOf(params.status, ["pending", "granted", "all"] as const, "pending");
  const [list, pending] = await Promise.all([listPlanRequests(db, { query, status, now, page: pageOf(params) }), pendingPage]);
  return { tab: "requests" as const, list, pending };
}

/** Which payment mode is on, so the admin knows what readers see. */
function ModeNote() {
  const mode = currentPaymentsMode();
  const ready = transferDetails() !== null;
  const text =
    mode === "demo"
      ? "Режим: demo — тариф таңдаған кезде қолжетімділік бірден ашылады. Тек өз компьютеріңізде қолданыңыз."
      : mode === "transfer"
        ? ready
          ? "Режим: transfer — оқырман Kaspi аударымы туралы нұсқаулықты көреді, қолжетімділікті сіз ашасыз."
          : "Режим: transfer, бірақ .env ішінде TRANSFER_KASPI, TRANSFER_NAME, TRANSFER_CONTACT толық емес — оқырман нұсқаулықты көрмейді."
        : "Режим: interest — таңдау тек жазылады, оқырман «Төлем жақында ашылады» деген хабарды көреді.";
  const warn = mode === "demo" || (mode === "transfer" && !ready);
  return (
    <p className={`mt-4 rounded-2xl px-4 py-3 text-sm ${warn ? "bg-amber-50 text-amber-900" : "bg-sidebar text-muted"}`}>{text}</p>
  );
}

function Stats({ week, month }: { week: PaywallStats; month: PaywallStats }) {
  const periods: [string, PaywallStats][] = [
    ["7 күн", week],
    ["30 күн", month],
  ];
  return (
    <section>
      <p className="mt-5 text-sm text-muted">
        Адам — аккаунт немесе кірмеген браузер. «Тариф таңдады»: interest/transfer режиміндегі таңдау немесе демо ашу.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {[
          ["Пэйволлды көрді", month.shown.people],
          ["Тариф таңдады", month.chose.people],
          ["Таңдау үлесі", percent(month.rate)],
          ["Тіркелді", month.signups],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line p-4">
            <p className="text-sm text-muted">{label} · 30 күн</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-sidebar text-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">Көрсеткіш</th>
              {periods.map(([label]) => (
                <th key={label} className="px-4 py-2.5 text-right font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            <Row label="Пэйволлды көрді (адам)" values={periods.map(([, s]) => s.shown.people)} />
            <Row label="Пэйволл көрсетілді (рет)" values={periods.map(([, s]) => s.shown.events)} />
            <Row label="Тариф таңдады (адам)" values={periods.map(([, s]) => s.chose.people)} />
            <Row label="Таңдау үлесі" values={periods.map(([, s]) => percent(s.rate))} strong />
            <Row label="Тіркелді" values={periods.map(([, s]) => s.signups)} />
            {week.byPlan.map(({ plan }, i) => (
              <Row key={plan} label={`Таңдады: ${PLAN_NAMES[plan]}`} values={periods.map(([, s]) => s.byPlan[i].people)} muted />
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Кітап пен деңгей бойынша · 30 күн</h2>
      {month.byBook.length === 0 ? (
        <p className="mt-3 text-muted">Әзірге оқиға жоқ.</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-sidebar text-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">Кітап</th>
                <th className="px-4 py-2.5 font-medium">Деңгей</th>
                <th className="px-4 py-2.5 text-right font-medium">Көрді</th>
                <th className="px-4 py-2.5 text-right font-medium">Таңдады</th>
                <th className="px-4 py-2.5 text-right font-medium">Үлес</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {month.byBook.map((row) => {
                const info = findEdition(row.slug)?.info;
                return (
                  <tr key={row.slug}>
                    <td className="px-4 py-2.5">{info?.title ?? row.slug}</td>
                    <td className="px-4 py-2.5">{info?.level ?? "—"}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{row.shown}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{row.chose}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{percent(row.rate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Row({ label, values, strong, muted }: { label: string; values: (number | string)[]; strong?: boolean; muted?: boolean }) {
  return (
    <tr className={muted ? "text-muted" : ""}>
      <td className={`px-4 py-2.5 ${strong ? "font-semibold" : ""}`}>{label}</td>
      {values.map((value, i) => (
        <td key={i} className={`px-4 py-2.5 text-right tabular-nums ${strong ? "font-semibold" : ""}`}>
          {value}
        </td>
      ))}
    </tr>
  );
}
