import Link from "next/link";
import type { ReactNode } from "react";
import type { EntitlementKind } from "@/lib/access";
import { findPaidWork } from "@/lib/catalog";
import { formatKkDate } from "@/lib/kk-date";
import type { ManualGrant, Page, PlanRequest, Reader } from "@/lib/manual-access";
import { findPremiumPlan } from "@/lib/plans";
import { grantRequestAction, revokeAction } from "./actions";

// Building blocks of the admin panel: search bar, pager and the three tables.

export const PLAN_NAMES: Record<EntitlementKind, string> = {
  single_book: "Осы кітап",
  premium_monthly: "Premium · ай",
  premium_annual: "Premium · жыл",
};

export type Params = Record<string, string | undefined>;

/** The current address with some parameters changed (empty values are dropped). */
export function hrefWith(params: Params, changes: Params): string {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...params, ...changes })) if (value) next.set(key, value);
  const query = next.toString();
  return `/admin/paywall${query ? `?${query}` : ""}`;
}

const planLabel = (kind: EntitlementKind, work: string | null) =>
  work ? `Кітап: ${findPaidWork(work)?.title ?? work}` : PLAN_NAMES[kind];

const tenge = (n: number | null | undefined) => (n ? `${n.toLocaleString("ru-RU")} ₸` : "—");

/**
 * Search and filters as a plain GET form: works without JavaScript, and the address can be
 * bookmarked or sent to someone on the team.
 */
export function Toolbar({ tab, params, filters }: {
  tab: string;
  params: Params;
  filters: { name: string; label: string; options: [string, string][] }[];
}) {
  const active = Boolean(params.q) || filters.some((f) => params[f.name] && params[f.name] !== f.options[0][0]);
  return (
    <form method="get" action="/admin/paywall" className="mt-5 flex flex-wrap items-end gap-3">
      <input type="hidden" name="tab" value={tab} />
      <label className="block min-w-[220px] flex-1">
        <span className="text-xs font-medium text-muted">Email бойынша іздеу</span>
        <input
          type="search"
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="name@example.kz"
          className="mt-1 h-10 w-full rounded-xl border border-line bg-white px-3 outline-accent"
        />
      </label>
      {filters.map((filter) => (
        <label key={filter.name} className="block">
          <span className="text-xs font-medium text-muted">{filter.label}</span>
          <select
            name={filter.name}
            defaultValue={params[filter.name] ?? filter.options[0][0]}
            className="mt-1 block h-10 rounded-xl border border-line bg-white px-3 outline-accent"
          >
            {filter.options.map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
      ))}
      <button type="submit" className="h-10 rounded-xl bg-ink px-4 font-medium text-white">
        Көрсету
      </button>
      {active && (
        <Link href={hrefWith({}, { tab })} className="flex h-10 items-center rounded-xl px-3 text-sm text-muted hover:bg-chip hover:text-ink">
          Тазалау
        </Link>
      )}
    </form>
  );
}

export function Pager({ page, params }: { page: Page<unknown>; params: Params }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
      <span>
        Барлығы: <b className="font-semibold text-ink">{page.total}</b>
        {page.pages > 1 && ` · ${page.page}/${page.pages}-бет`}
      </span>
      {page.pages > 1 && (
        <span className="flex gap-2">
          {page.page > 1 ? (
            <Link href={hrefWith(params, { page: String(page.page - 1) })} className="rounded-xl border border-line px-3 py-1.5 hover:bg-chip">
              ← Алдыңғы
            </Link>
          ) : null}
          {page.page < page.pages ? (
            <Link href={hrefWith(params, { page: String(page.page + 1) })} className="rounded-xl border border-line px-3 py-1.5 hover:bg-chip">
              Келесі →
            </Link>
          ) : null}
        </span>
      )}
    </div>
  );
}

function Table({ head, children, empty, isEmpty }: { head: ReactNode; children: ReactNode; empty: string; isEmpty: boolean }) {
  if (isEmpty) return <p className="mt-6 rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">{empty}</p>;
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-sidebar text-muted">{head}</thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

const th = "px-4 py-2.5 font-medium";
const td = "px-4 py-2.5";

/** Link that opens the access tab with this email filled in. */
const giveHref = (email: string) => hrefWith({}, { tab: "access", email });

export function RequestsTable({ page }: { page: Page<PlanRequest> }) {
  return (
    <Table
      isEmpty={page.rows.length === 0}
      empty="Бұл сүзгі бойынша сұраныс жоқ."
      head={
        <tr>
          <th className={th}>Оқырман</th>
          <th className={th}>Тариф</th>
          <th className={`${th} text-right`}>Сомасы</th>
          <th className={th}>Қашан</th>
          <th className={th} />
        </tr>
      }
    >
      {page.rows.map((request) => {
        const price =
          request.plan === "single_book"
            ? request.work
              ? findPaidWork(request.work)?.priceTenge
              : null
            : findPremiumPlan(request.plan)?.priceTenge;
        const planValue = request.plan === "single_book" ? `book:${request.work}` : request.plan;
        return (
          <tr key={`${request.userId}-${planValue}`} className="hover:bg-sidebar/60">
            <td className={`${td} font-medium`}>{request.email}</td>
            <td className={td}>{planLabel(request.plan, request.work)}</td>
            <td className={`${td} text-right tabular-nums`}>{tenge(price)}</td>
            <td className={`${td} text-muted`}>{formatKkDate(request.at)}</td>
            <td className={`${td} text-right`}>
              {request.granted ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">Ашылған</span>
              ) : (
                <form action={grantRequestAction}>
                  <input type="hidden" name="email" value={request.email} />
                  <input type="hidden" name="plan" value={planValue} />
                  <button type="submit" className="rounded-lg bg-accent px-3 py-1.5 font-semibold text-white">
                    Ашу
                  </button>
                </form>
              )}
            </td>
          </tr>
        );
      })}
    </Table>
  );
}

export function GrantsTable({ page, now }: { page: Page<ManualGrant>; now: Date }) {
  return (
    <Table
      isEmpty={page.rows.length === 0}
      empty="Бұл сүзгі бойынша қолжетімділік жоқ."
      head={
        <tr>
          <th className={th}>Оқырман</th>
          <th className={th}>Не берілді</th>
          <th className={th}>Қайдан</th>
          <th className={th}>Мерзімі</th>
          <th className={th} />
        </tr>
      }
    >
      {page.rows.map((grant) => {
        const expired = grant.expiresAt !== null && grant.expiresAt <= now;
        return (
          <tr key={grant.id} className={`hover:bg-sidebar/60 ${expired ? "text-muted" : ""}`}>
            <td className={`${td} font-medium`}>{grant.email}</td>
            <td className={td}>{planLabel(grant.kind, grant.work)}</td>
            <td className={td}>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${grant.source === "demo" ? "bg-chip text-muted" : "bg-accent-soft text-amber-800"}`}
              >
                {grant.source === "demo" ? "демо" : "қолмен"}
              </span>
            </td>
            <td className={td}>
              {grant.expiresAt ? (
                <>
                  {formatKkDate(grant.startsAt)} – {formatKkDate(grant.expiresAt)}
                  {expired && <span className="ml-2 rounded-full bg-chip px-2 py-0.5 text-xs">аяқталған</span>}
                </>
              ) : (
                "мерзімсіз"
              )}
            </td>
            <td className={`${td} text-right`}>
              <form action={revokeAction}>
                <input type="hidden" name="id" value={grant.id} />
                <button type="submit" className="rounded-lg px-2 py-1 text-red-700 hover:bg-red-50">
                  Қайтарып алу
                </button>
              </form>
            </td>
          </tr>
        );
      })}
    </Table>
  );
}

export function ReadersTable({ page }: { page: Page<Reader> }) {
  return (
    <Table
      isEmpty={page.rows.length === 0}
      empty="Бұл сүзгі бойынша оқырман жоқ."
      head={
        <tr>
          <th className={th}>Email</th>
          <th className={th}>Тіркелді</th>
          <th className={th}>Қолжетімділік</th>
          <th className={`${th} text-right`}>Сөз</th>
          <th className={th}>Соңғы оқу</th>
          <th className={th} />
        </tr>
      }
    >
      {page.rows.map((reader) => (
        <tr key={reader.id} className="hover:bg-sidebar/60">
          <td className={`${td} font-medium`}>{reader.email}</td>
          <td className={`${td} text-muted`}>{formatKkDate(reader.createdAt)}</td>
          <td className={td}>
            <span className="flex flex-wrap gap-1.5">
              {reader.premiumUntil && (
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-amber-800">
                  Premium · {formatKkDate(reader.premiumUntil)} дейін
                </span>
              )}
              {reader.books > 0 && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">{reader.books} кітап</span>
              )}
              {!reader.premiumUntil && reader.books === 0 && <span className="text-xs text-muted">тегін</span>}
            </span>
          </td>
          <td className={`${td} text-right tabular-nums`}>{reader.words}</td>
          <td className={`${td} text-muted`}>{reader.lastRead ? formatKkDate(reader.lastRead) : "—"}</td>
          <td className={`${td} text-right`}>
            <Link href={giveHref(reader.email)} className="whitespace-nowrap rounded-lg px-2 py-1 font-medium text-amber-700 hover:bg-accent-soft">
              Қолжетімділік беру
            </Link>
          </td>
        </tr>
      ))}
    </Table>
  );
}
