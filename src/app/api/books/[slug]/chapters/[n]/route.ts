import type { NextRequest } from "next/server";
import { getDb } from "@/db";
import { findEdition } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/dal";
import { loadEntitlements } from "@/lib/entitlements";
import { createRateLimiter, serveChapter, type LoadReader } from "@/lib/serve";

const allow = createRateLimiter(120, 60_000);

/** Only reached for paid chapters, so free chapters never touch the database. */
const loadReader: LoadReader = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  return { userId: user.id, entitlements: await loadEntitlements(getDb(), user.id) };
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; n: string }> },
) {
  const { slug, n } = await context.params;
  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!allow(client, Date.now())) {
    return new Response(null, { status: 429, headers: { "Retry-After": "60" } });
  }

  const result = await serveChapter(findEdition(slug), Number(n), request.headers.get("if-none-match"), new Date(), loadReader);
  // no-cache: the browser may keep the file, but must ask us on every open,
  // so a revoked license or an expired premium closes the chapter on the next request.
  const cache = { "Cache-Control": "private, no-cache" };

  if (result.status === 200) {
    return new Response(result.body, {
      headers: { ...cache, "Content-Type": "application/json; charset=utf-8", ETag: result.etag },
    });
  }
  if (result.status === 304) {
    return new Response(null, { status: 304, headers: { ...cache, ETag: result.etag } });
  }
  if (result.status === 503) {
    console.error(`[chapter] access check failed for ${slug}/${n}:`, result.error);
    return new Response(null, { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "10" } });
  }
  return new Response(null, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
