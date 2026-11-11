"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SOURCE_PARAM, parseSignupSource, rememberSignupSource } from "@/lib/signup-source";
import { hideToast, showToast, useToast } from "@/lib/toast";
import { CheckIcon, CloseIcon } from "./icons";

/**
 * Shows the current toast. Also turns "?verified=1" (set by the email confirmation link) into a
 * welcome notice, and keeps "?from=" (where the guest pressed sign-up) for the first sync. Both
 * are removed from the address, so a reload does not repeat them.
 */
export function Toaster() {
  const toast = useToast();

  useEffect(() => {
    const url = new URL(window.location.href);
    const verified = url.searchParams.get("verified") === "1";
    const source = url.searchParams.has(SOURCE_PARAM) ? parseSignupSource(url.searchParams.get(SOURCE_PARAM)) : undefined;
    if (!verified && source === undefined) return;
    url.searchParams.delete("verified");
    url.searchParams.delete(SOURCE_PARAM);
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    if (source) rememberSignupSource(source);
    if (verified) showToast("Email расталды. Alau-ға қош келдіңіз!", "success", 5000);
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
        {toast.action && (
          <Link
            href={toast.action.href}
            onClick={hideToast}
            className="shrink-0 rounded-xl bg-accent px-3 py-1.5 text-sm font-semibold text-on-accent"
          >
            {toast.action.label}
          </Link>
        )}
        <button type="button" onClick={hideToast} aria-label="Жабу" className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
          <CloseIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
