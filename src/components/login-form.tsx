"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-messages";
import { Mascot } from "./brand";

type Mode = "sign-in" | "sign-up";

const TEXT: Record<Mode, { title: string; lead: string; submit: string; busy: string; switchText: string; switchLink: string }> = {
  "sign-in": {
    title: "Кіру",
    lead: "Аккаунтқа кіріп, оқуды жалғастырыңыз.",
    submit: "Кіру",
    busy: "Кіріп жатырмыз…",
    switchText: "Аккаунт жоқ па?",
    switchLink: "Тіркелу",
  },
  "sign-up": {
    title: "Тіркелу",
    lead: "Аккаунт ашсаңыз, кітаптарыңыз бен тарифіңіз сақталады.",
    submit: "Аккаунт ашу",
    busy: "Аккаунт ашып жатырмыз…",
    switchText: "Аккаунтыңыз бар ма?",
    switchLink: "Кіру",
  },
};

export function LoginForm({ next, initialMode = "sign-in" }: { next: string; initialMode?: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const text = TEXT[mode];

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { error: authError } =
        mode === "sign-up"
          ? await authClient.signUp.email({ email: cleanEmail, password, name: cleanEmail.split("@")[0] })
          : await authClient.signIn.email({ email: cleanEmail, password });
      if (authError) {
        setError(authErrorMessage(authError));
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Байланыс жоқ. Интернетті тексеріп, қайталаңыз.");
    } finally {
      setBusy(false);
    }
  };

  const fieldClass =
    "mt-1.5 h-12 w-full rounded-2xl border border-line bg-white px-4 text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col px-4 pb-10 pt-8 md:pt-16">
      <Mascot className="size-20" />
      <h1 className="mt-4 text-3xl font-bold">{text.title}</h1>
      <p className="mt-1 text-muted">{text.lead}</p>

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
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Құпиясөз</span>
          <input
            type="password"
            name="password"
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            required
            minLength={8}
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClass}
          />
          {mode === "sign-up" && <span className="mt-1 block text-sm text-muted">Кемінде 8 таңба.</span>}
        </label>

        {error && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="h-12 rounded-2xl bg-accent font-medium text-on-accent disabled:opacity-60"
        >
          {busy ? text.busy : text.submit}
        </button>

        {mode === "sign-up" && (
          <p className="text-center text-xs leading-relaxed text-muted">
            «Аккаунт ашу» батырмасын басу арқылы сіз{" "}
            <Link href="/terms" target="_blank" className="underline underline-offset-2 hover:text-ink">
              Пайдалану шарттарымен
            </Link>{" "}
            келісесіз және{" "}
            <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-ink">
              Құпиялылық саясатына
            </Link>{" "}
            сәйкес дербес деректеріңізді өңдеуге келісім бересіз.
          </p>
        )}
      </form>

      <p className="mt-5 text-center text-sm">
        <span className="text-muted">{text.switchText} </span>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "sign-in" ? "sign-up" : "sign-in");
            setError(null);
          }}
          className="font-medium text-amber-700 underline underline-offset-2"
        >
          {text.switchLink}
        </button>
      </p>
      {mode === "sign-in" && (
        <p className="mt-3 text-center text-xs text-muted">Құпиясөзді қалпына келтіру әзірге жоқ, оны есте сақтаңыз.</p>
      )}
    </div>
  );
}
