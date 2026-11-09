"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { requestSync, startSync, stopSync } from "@/lib/sync-client";

/** Keeps a signed-in reader's progress and words in sync with the server (T7). Renders nothing. */
export function ReaderSync() {
  const { data } = authClient.useSession();
  const userId = data?.user.id ?? null;

  useEffect(() => {
    if (!userId) return;
    startSync(userId);
    const onVisible = () => {
      if (document.visibilityState === "visible") requestSync();
    };
    window.addEventListener("online", requestSync);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("online", requestSync);
      document.removeEventListener("visibilitychange", onVisible);
      stopSync();
    };
  }, [userId]);

  return null;
}
