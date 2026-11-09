import { getDb } from "@/db";
import { findPaidWork } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/dal";
import { currentPaymentsMode } from "@/lib/payments-mode";
import { choosePlan } from "@/lib/paywall";
import { parsePlanChoice } from "@/lib/paywall-request";
import { transferDetails } from "@/lib/transfer";
import { createRateLimiter } from "@/lib/serve";

// POST { plan, work, slug, chapter, anonId? } from the paywall's "Buy" button.
// 200 { unlocked, mode, transfer?, email? } (transfer: how to pay, in PAYMENTS_MODE=transfer) · 400 bad request · 401 not signed in · 429 too many · 503 database down

const allow = createRateLimiter(30, 60_000);

export async function POST(request: Request) {
  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!allow(client, Date.now())) return Response.json({ error: "too many requests" }, { status: 429 });

  const body: unknown = await request.json().catch(() => null);
  const parsed = parsePlanChoice(body, findPaidWork);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "sign in first" }, { status: 401 });
    const mode = currentPaymentsMode();
    const result = await choosePlan(getDb(), user.id, parsed.value, mode, new Date());
    const transfer = mode === "transfer" ? transferDetails() : null;
    if (mode === "transfer" && !transfer) console.warn("[paywall] PAYMENTS_MODE=transfer but TRANSFER_* is incomplete in .env");
    // The email goes back so the reader can copy it into the transfer comment.
    return Response.json({ ...result, mode, transfer, email: transfer ? user.email : undefined });
  } catch (error) {
    console.error(`[paywall] choice failed for ${parsed.value.plan} ${parsed.value.work}:`, error);
    return Response.json({ error: "try again" }, { status: 503 });
  }
}
