import { getDb } from "@/db";
import { findPaidWork } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/dal";
import { recordPaywallShown } from "@/lib/paywall";
import { parsePaywallPlace } from "@/lib/paywall-request";
import { createRateLimiter } from "@/lib/serve";

// POST { work, slug, chapter, anonId? } when the paywall appears. Guests are counted by anonId.
// 204 recorded · 400 bad request · 429 too many · 503 database down (the reader never sees this)

const allow = createRateLimiter(30, 60_000);

export async function POST(request: Request) {
  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!allow(client, Date.now())) return new Response(null, { status: 429 });

  const body: unknown = await request.json().catch(() => null);
  const parsed = parsePaywallPlace(body, findPaidWork);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  try {
    const user = await getCurrentUser();
    await recordPaywallShown(getDb(), user?.id ?? null, parsed.value, new Date());
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`[paywall] could not record a view of ${parsed.value.slug}/${parsed.value.chapter}:`, error);
    return new Response(null, { status: 503 });
  }
}
