"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-messages";
import { Mascot } from "./brand";

// "Құпиясөзді ұмыттым" (ask for a link) and "Жаңа құпиясөз" (set it from the link).
//
//   /forgot-password ─ email ─▶ Better Auth ─▶ email with a one-hour link
//   link ─▶ /api/auth/reset-password/<token> ─▶ /reset-password?token=… ─ new password ─▶ /login
//
// The first screen answers the same whether the email exists or not, so it cannot be used to
// find out who has an account.

const fieldClass =
  "mt-1.5 h-12 w-full rounded-2xl border border-line bg-white px-4 text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

function Frame({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col px-5">
      <Mascot className="size-20 lg:hidden" />
      <h1 className="mt-4 text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-muted">{lead}</p>
      {children}
    </div>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const { error: authError } = await authClient.requestPasswordReset({
        email: email.trim().toLowerCase(),
        redirectTo: "/reset-password",
      });
      if (authError) setError(authErrorMessage(authError));
      else setSent(true);
    } catch {
      setError("Байланыс жоқ. Интернетті тексеріп, қайталаңыз.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <Frame title="Поштаңызды тексеріңіз" lead="">
        <p role="status" className="mt-4 rounded-2xl bg-emerald-50 p-4 text-emerald-900">
          Егер <b>{email.trim().toLowerCase()}</b> тіркелген болса, оған құпиясөзді өзгерту сілтемесі бар хат жібердік. Сілтеме бір
          сағат жарамды. Хат келмесе, «Спам» бумасын қараңыз.
        </p>
        <Link href="/login" className="mt-6 text-center font-medium text-amber-700 underline underline-offset-2">
          Кіру бетіне оралу
        </Link>
      </Frame>
    );
  }

  return (
    <Frame title="Құпиясөзді ұмыттыңыз ба?" lead="Тіркелген email-ыңызды жазыңыз, біз жаңа құпиясөз қоюға сілтеме жібереміз.">
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </label>
        {error && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="h-12 rounded-2xl bg-accent font-medium text-on-accent disabled:opacity-60">
          {busy ? "Жіберіп жатырмыз…" : "Сілтеме жіберу"}
        </button>
      </form>
      <Link href="/login" className="mt-5 text-center text-sm font-medium text-amber-700 underline underline-offset-2">
        Кіру бетіне оралу
      </Link>
    </Frame>
  );
}

export function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const linkError = params.get("error");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token || linkError) {
    return (
      <Frame title="Сілтеме жарамсыз" lead="Сілтеменің мерзімі өтіп кеткен немесе ол бұрын қолданылған.">
        <Link href="/forgot-password" className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-accent font-medium text-on-accent">
          Жаңа сілтеме сұрау
        </Link>
      </Frame>
    );
  }

  if (done) {
    return (
      <Frame title="Құпиясөз өзгертілді" lead="Енді жаңа құпиясөзбен кіріңіз. Басқа құрылғылардағы кірулер жабылды.">
        <Link href="/login" className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-accent font-medium text-on-accent">
          Кіру
        </Link>
      </Frame>
    );
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (password !== repeat) {
      setError("Құпиясөздер сәйкес келмейді.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { error: authError } = await authClient.resetPassword({ newPassword: password, token });
      if (authError) setError(authErrorMessage(authError));
      else setDone(true);
    } catch {
      setError("Байланыс жоқ. Интернетті тексеріп, қайталаңыз.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Frame title="Жаңа құпиясөз" lead="Кемінде 8 таңбадан тұратын жаңа құпиясөз ойлап табыңыз.">
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <label className="block">
          <span className="text-sm font-medium">Жаңа құпиясөз</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Құпиясөзді қайталаңыз</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={128}
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className={fieldClass}
          />
        </label>
        {error && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="h-12 rounded-2xl bg-accent font-medium text-on-accent disabled:opacity-60">
          {busy ? "Сақтап жатырмыз…" : "Құпиясөзді сақтау"}
        </button>
      </form>
    </Frame>
  );
}
