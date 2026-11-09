"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "./auth-client";
import type { EntitlementView } from "./entitlement-view";

/**
 * The signed-in reader's purchases. Empty for guests and while loading.
 * `reload` is called after a demo purchase so menus update without a page refresh.
 */
export function useEntitlements() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user.id ?? null;
  const [state, setState] = useState<{ userId: string | null; items: EntitlementView[] }>({ userId: null, items: [] });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    fetch("/api/me/entitlements", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return;
        const body = (await response.json()) as { entitlements: EntitlementView[] };
        setState({ userId, items: body.entitlements });
      })
      .catch(() => {
        // Menus fall back to showing locks; the chapter API still decides access.
      });
    return () => controller.abort();
  }, [userId, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const items = userId && state.userId === userId ? state.items : [];
  return { signedIn: Boolean(userId), sessionPending: isPending, entitlements: items, reload };
}
