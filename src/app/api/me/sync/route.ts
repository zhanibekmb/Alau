import { getDb } from "@/db";
import { getCurrentUser } from "@/lib/dal";
import { syncReaderData } from "@/lib/reader-data";
import { createRateLimiter } from "@/lib/serve";
import { MAX_SYNC_BYTES, parseSyncRequest } from "@/lib/sync";

// POST { ops, anonId?, pull? }: the browser's queued changes to progress and saved words (T7).
// 200 { progress, words } when pull · 204 saved · 400 bad request · 401 not signed in
// 413 too big · 429 too many · 503 database down. On any error the browser keeps its queue and retries.

const allow = createRateLimiter(60, 60_000);

export async function POST(request: Request) {
  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!allow(client, Date.now())) return Response.json({ error: "too many requests" }, { status: 429 });

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_SYNC_BYTES) return Response.json({ error: "too big" }, { status: 413 });
  const text = await request.text();
  if (text.length > MAX_SYNC_BYTES) return Response.json({ error: "too big" }, { status: 413 });

  let body: unknown = null;
  try {
    body = JSON.parse(text);
  } catch {
    // Falls through to the 400 below.
  }
  const parsed = parseSyncRequest(body);
  if (!parsed.ok) {
    console.warn(`[sync] refused: ${parsed.error}`);
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "sign in first" }, { status: 401 });
    if (parsed.dropped > 0) console.warn(`[sync] dropped ${parsed.dropped} damaged entries for user ${user.id}`);
    const data = await syncReaderData(getDb(), user.id, parsed.value);
    if (!data) return new Response(null, { status: 204 });
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[sync] failed:", error);
    return Response.json({ error: "try again" }, { status: 503 });
  }
}
