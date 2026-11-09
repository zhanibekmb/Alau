"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-messages";
import { showToast } from "@/lib/toast";
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

/** Where the confirmation link returns the reader: the same page, with a welcome notice. */
const withVerified = (path: string) => `${path}${path.includes("?") ? "&" : "?"}verified=1`;

export function LoginForm({ next, initialMode = "sign-in" }: { next: string; initialMode?: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  /** Set after sign-up (or a sign-in with an unconfirmed email): the "check your inbox" screen. */
  const [awaiting, setAwaiting] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const text = TEXT[mode];

  /** Next.js keeps a visited page alive, so the form is emptied whenever it is done with. */
  const reset = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setResent(false);
  };

  const switchMode = (to: Mode) => {
    reset();
    setAwaiting(null);
    setMode(to);
  };

  const resend = async () => {
    if (!awaiting || busy) return;
    setBusy(true);
    const { error: authError } = await authClient
      .sendVerificationEmail({ email: awaiting, callbackURL: withVerified(next) })
      .catch(() => ({ error: { status: 0 } as { status: number } }));
    setBusy(false);
    if (authError) setError(authErrorMessage(authError));
    else setResent(true);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    try {
      const { error: authError } =
        mode === "sign-up"
          ? await authClient.signUp.email({
              email: cleanEmail,
              password,
              name: cleanEmail.split("@")[0],
              callbackURL: withVerified(next),
            })
          : await authClient.signIn.email({ email: cleanEmail, password, callbackURL: withVerified(next) });
      if (authError?.code === "EMAIL_NOT_VERIFIED") {
        // Better Auth has just sent a fresh link.
        reset();
        setAwaiting(cleanEmail);
        return;
      }
      if (authError) {
        setError(authErrorMessage(authError));
        setPassword("");
        return;
      }
      if (mode === "sign-up") {
        reset();
        setAwaiting(cleanEmail);
        return;
      }
      reset();
      showToast("Аккаунтқа кірдіңіз", "success");
      router.replace(next);
      router.refresh();
    } catch {
      setError("Байланыс жоқ. Интернетті тексеріп, қайталаңыз.");
    } finally {
      setBusy(false);
    }
  };

  if (awaiting) {
    return (
      <div className="mx-auto flex w-full max-w-[420px] flex-col px-5">
        <Mascot pose="onboarding-login" className="size-24" />
        <h1 className="mt-4 text-3xl font-bold">Поштаңызды тексеріңіз</h1>
        <p className="mt-2 text-muted">
          <b className="font-semibold text-ink">{awaiting}</b> мекенжайына растау сілтемесін жібердік. Сілтемені ашсаңыз, аккаунтқа
          бірден кіресіз. Сілтеме 24 сағат жарамды.
        </p>
        <p className="mt-3 text-sm text-muted">Хат көрінбесе, «Спам» бумасын қараңыз.</p>
        {error && (
          <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}
        {resent && (
          <p role="status" className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Жаңа хат жіберілді.
          </p>
        )}
        <button
          type="button"
          onClick={resend}
          disabled={busy}
          className="mt-6 h-12 rounded-2xl border border-line font-medium transition-colors hover:bg-sidebar disabled:opacity-60"
        >
          {busy ? "Жіберіп жатырмыз…" : "Хатты қайта жіберу"}
        </button>
        <button type="button" onClick={() => switchMode("sign-in")} className="mt-4 text-sm font-medium text-amber-700 underline underline-offset-2">
          Басқа email-мен кіру
        </button>
      </div>
    );
  }

  const fieldClass =
    "mt-1.5 h-12 w-full rounded-2xl border border-line bg-white px-4 text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col px-5">
      <Mascot className="size-20 lg:hidden" />
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
          onClick={() => switchMode(mode === "sign-in" ? "sign-up" : "sign-in")}
          className="font-medium text-amber-700 underline underline-offset-2"
        >
          {text.switchLink}
        </button>
      </p>
      {mode === "sign-in" && (
        <Link href="/forgot-password" className="mt-3 text-center text-sm text-muted underline underline-offset-2 hover:text-ink">
          Құпиясөзді ұмыттыңыз ба?
        </Link>
      )}
    </div>
  );
}
