"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { signUpHref } from "@/lib/guest-nudge";
import { withSource, type SignupSource } from "@/lib/signup-source";
import { GoogleIcon } from "./icons";

/**
 * One-tap sign-up at a moment of success (chapter end, gift chapter). With Google keys it goes
 * straight to Google's account picker and returns to `next`; without them it opens the sign-up form.
 * Either way the return address carries ?from=<source> (src/lib/signup-source.ts).
 */
export function GoogleSignUp({
  next,
  source,
  label,
  googleEnabled,
  className = "",
}: {
  next: string;
  source: SignupSource;
  label: string;
  googleEnabled: boolean;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const base = `flex h-12 items-center justify-center gap-3 rounded-2xl font-semibold disabled:opacity-60 ${className}`;

  if (!googleEnabled) {
    return (
      <Link href={signUpHref(next, source)} className={base}>
        {label}
      </Link>
    );
  }

  const start = async () => {
    if (busy) return;
    setBusy(true);
    const back = withSource(next, source);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: back,
        errorCallbackURL: `/login?mode=sign-up&next=${encodeURIComponent(back)}&error=google`,
      });
      // On success the browser is already on its way to Google.
      if (error) window.location.assign(signUpHref(next, source));
    } catch {
      window.location.assign(signUpHref(next, source));
    }
  };

  return (
    <button type="button" onClick={start} disabled={busy} className={base}>
      <span className="flex size-7 items-center justify-center rounded-full bg-white">
        <GoogleIcon className="size-4" />
      </span>
      {busy ? "Google-ға өтіп жатырмыз…" : label}
    </button>
  );
}
