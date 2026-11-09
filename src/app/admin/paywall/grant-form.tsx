"use client";

import { useActionState } from "react";
import { grantAction, type GrantState } from "./actions";

/** "Give access" form. Works can be bought separately; premium opens every book. */
export function GrantForm({ works, defaultEmail = "" }: { works: { work: string; title: string }[]; defaultEmail?: string }) {
  const [state, action, pending] = useActionState<GrantState, FormData>(grantAction, null);

  return (
    <form action={action} className="mt-4 flex flex-col gap-3 rounded-3xl border border-line bg-sidebar p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_260px_auto]">
        <label className="block">
          <span className="text-sm font-medium">Оқырманның email-ы</span>
          <input
            name="email"
            type="email"
            required
            placeholder="reader@example.kz"
            defaultValue={defaultEmail}
            autoFocus={Boolean(defaultEmail)}
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 outline-accent"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Не беру керек</span>
          <select name="plan" required defaultValue="premium_monthly" className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 outline-accent">
            <option value="premium_monthly">Premium · 30 күн</option>
            <option value="premium_annual">Premium · 365 күн</option>
            {works.map(({ work, title }) => (
              <option key={work} value={`book:${work}`}>
                Кітап: {title} (мерзімсіз)
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="h-11 self-end rounded-xl bg-accent px-5 font-semibold text-white shadow-md shadow-accent/30 disabled:opacity-60"
        >
          {pending ? "Беріп жатырмыз…" : "Қолжетімділік беру"}
        </button>
      </div>
      {state && (
        <p
          role="status"
          className={`rounded-xl px-3 py-2 text-sm ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}
        >
          {state.message}
        </p>
      )}
      <p className="text-xs text-muted">
        Оқырман алдымен сайтта тіркелуі керек. Premium әлі бітпеген болса, жаңа мерзім соның соңынан қосылады.
      </p>
    </form>
  );
}
