"use server";

import { refresh } from "next/cache";
import { getDb } from "@/db";
import type { EntitlementKind } from "@/lib/access";
import { isAdminEmail } from "@/lib/admin";
import { findPaidWork } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/dal";
import { findUserByEmail, grantAccess, revokeGrant } from "@/lib/manual-access";

// Admin actions on /admin/paywall. Each one checks the admin role again: a Server Action is a
// public endpoint, so hiding the form is not enough.

export type GrantState = { ok: boolean; message: string } | null;

async function isAdmin(): Promise<string | null> {
  const current = await getCurrentUser();
  return current && isAdminEmail(current.email) ? current.id : null;
}

/** Form value: "premium_monthly", "premium_annual" or "book:<work>". */
function parsePlan(value: string): { kind: EntitlementKind; work: string | null } | null {
  if (value === "premium_monthly" || value === "premium_annual") return { kind: value, work: null };
  if (value.startsWith("book:") && findPaidWork(value.slice(5))) return { kind: "single_book", work: value.slice(5) };
  return null;
}

export async function grantAction(_previous: GrantState, form: FormData): Promise<GrantState> {
  const adminId = await isAdmin();
  if (!adminId) return { ok: false, message: "Рұқсат жоқ." };

  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const plan = parsePlan(String(form.get("plan") ?? ""));
  if (!email.includes("@")) return { ok: false, message: "Email дұрыс емес." };
  if (!plan) return { ok: false, message: "Тарифті таңдаңыз." };

  try {
    const db = getDb();
    const reader = await findUserByEmail(db, email);
    if (!reader) return { ok: false, message: `${email} әлі тіркелмеген. Алдымен сайтта аккаунт ашсын.` };
    const result = await grantAccess(db, { userId: reader.id, ...plan, now: new Date() });
    console.info(`[admin] ${adminId} gave ${plan.kind}${plan.work ? ` ${plan.work}` : ""} to user ${reader.id}: ${result}`);
    refresh();
    const messages = {
      granted: `${email}: қолжетімділік берілді.`,
      extended: `${email}: Premium мерзімі ұзартылды.`,
      already: `${email}: бұл кітап онда бұрыннан бар.`,
    };
    return { ok: true, message: messages[result] };
  } catch (error) {
    console.error("[admin] grant failed:", error);
    return { ok: false, message: "Қате болды, қайталап көріңіз." };
  }
}

export async function revokeAction(form: FormData): Promise<void> {
  const adminId = await isAdmin();
  if (!adminId) return;
  const id = String(form.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/.test(id)) return;
  const removed = await revokeGrant(getDb(), id);
  if (removed) console.info(`[admin] ${adminId} revoked grant ${id}`);
  refresh();
}
