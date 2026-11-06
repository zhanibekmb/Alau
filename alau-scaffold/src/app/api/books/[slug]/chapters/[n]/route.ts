import type { NextRequest } from "next/server";
import { findEdition } from "@/lib/catalog";
import { createRateLimiter, serveChapter } from "@/lib/serve";

const allow = createRateLimiter(120, 60_000);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; n: string }> },
) {
  const { slug, n } = await context.params;
  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!allow(client, Date.now())) {
    return new Response(null, { status: 429, headers: { "Retry-After": "60" } });
  }

  const result = serveChapter(findEdition(slug), Number(n), request.headers.get("if-none-match"), new Date());
  // no-cache: the browser may keep the file, but must ask us on every open,
  // so a revoked license closes the book on the next request.
  const cache = { "Cache-Control": "private, no-cache" };

  if (result.status === 200) {
    return new Response(result.body, {
      headers: { ...cache, "Content-Type": "application/json; charset=utf-8", ETag: result.etag },
    });
  }
  if (result.status === 304) {
    return new Response(null, { status: 304, headers: { ...cache, ETag: result.etag } });
  }
  return new Response(null, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
