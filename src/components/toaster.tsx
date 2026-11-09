"use client";

import { useEffect } from "react";
import { hideToast, showToast, useToast } from "@/lib/toast";
import { CheckIcon, CloseIcon } from "./icons";

/**
 * Shows the current toast. Also turns "?verified=1" (set by the email confirmation link) into a
 * welcome notice and removes it from the address, so a reload does not show it again.
 */
export function Toaster() {
  const toast = useToast();

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("verified") === "1") {
      url.searchParams.delete("verified");
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
      showToast("Email расталды. Alau-ға қош келдіңіз!", "success", 5000);
    }
  }, []);

  if (!toast) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4 md:bottom-8">
      <div
        key={toast.id}
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex max-w-md animate-card-in items-center gap-3 rounded-2xl bg-[#201f4b] py-3 pl-4 pr-2 text-white shadow-2xl"
      >
        {toast.tone === "success" && (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500">
            <CheckIcon className="size-4" strokeWidth={2.5} />
          </span>
        )}
        <p className="text-sm font-medium">{toast.text}</p>
        <button type="button" onClick={hideToast} aria-label="Жабу" className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
          <CloseIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
