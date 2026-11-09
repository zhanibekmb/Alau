import { getDb } from "@/db";
import { findPaidWork } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/dal";
import type { EntitlementView } from "@/lib/entitlement-view";
import { listReaderEntitlements } from "@/lib/entitlements";

// GET: the signed-in reader's purchases, for the chapter menu and the profile.
// The chapter API still decides access on its own; this only shapes the screens.
// 200 { entitlements } · 401 not signed in · 503 database down

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "sign in first" }, { status: 401, headers: { "Cache-Control": "no-store" } });
    const rows = await listReaderEntitlements(getDb(), user.id);
    const entitlements: EntitlementView[] = rows.map((row) => ({
      kind: row.kind,
      work: row.work,
      workTitle: row.work ? (findPaidWork(row.work)?.title ?? row.work) : null,
      expiresAt: row.expiresAt?.toISOString() ?? null,
      demo: row.source === "demo",
    }));
    return Response.json({ entitlements }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[me] could not list entitlements:", error);
    return Response.json({ error: "try again" }, { status: 503 });
  }
}
