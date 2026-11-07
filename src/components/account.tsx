"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

function Avatar({ letter, size }: { letter: string; size: "sm" | "lg" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-on-accent ${
        size === "lg" ? "size-16 text-2xl" : "size-10"
      }`}
    >
      {letter.toUpperCase()}
    </span>
  );
}

/** Bottom of the sidebar: who is reading. */
export function AccountBadge() {
  const { data, isPending } = authClient.useSession();
  if (isPending) return <div className="h-10" aria-hidden="true" />;
  if (!data) {
    return (
      <Link href="/login" className="flex items-center gap-3 rounded-2xl p-1 hover:bg-chip">
        <Avatar letter="Қ" size="sm" />
        <span>
          <span className="block font-semibold">Қонақ</span>
          <span className="block text-xs text-amber-700">Кіру немесе тіркелу</span>
        </span>
      </Link>
    );
  }
  return (
    <Link href="/profile" className="flex min-w-0 items-center gap-3 rounded-2xl p-1 hover:bg-chip">
      <Avatar letter={data.user.email[0]} size="sm" />
      <span className="min-w-0">
        <span className="block truncate font-semibold">{data.user.email}</span>
        <span className="block text-xs text-muted">Аккаунт</span>
      </span>
    </Link>
  );
}

/** Top of the profile page: guest invitation or account with sign-out. */
export function AccountCard() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [signingOut, setSigningOut] = useState(false);

  if (isPending) return <section className="mt-6 h-[104px] rounded-3xl bg-sidebar" aria-hidden="true" />;

  if (!data) {
    return (
      <section className="mt-6 flex flex-wrap items-center gap-4 rounded-3xl bg-sidebar p-5">
        <Avatar letter="Қ" size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-xl font-bold">Қонақ</p>
          <p className="text-sm text-muted">Прогресс пен сөздік осы браузерде сақталады.</p>
        </div>
        <Link href="/login?next=/profile" className="rounded-2xl bg-accent px-5 py-3 font-medium text-on-accent">
          Кіру
        </Link>
      </section>
    );
  }

  return (
    <section className="mt-6 flex flex-wrap items-center gap-4 rounded-3xl bg-sidebar p-5">
      <Avatar letter={data.user.email[0]} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xl font-bold">{data.user.email}</p>
        <p className="text-sm text-muted">Аккаунтқа кірдіңіз.</p>
      </div>
      <button
        type="button"
        disabled={signingOut}
        onClick={async () => {
          setSigningOut(true);
          await authClient.signOut();
          setSigningOut(false);
          router.refresh();
        }}
        className="rounded-2xl border border-line bg-white px-5 py-3 font-medium disabled:opacity-60"
      >
        {signingOut ? "Шығып жатырмыз…" : "Шығу"}
      </button>
    </section>
  );
}
