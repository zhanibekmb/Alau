import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL } from "@/content/legal";

/** Shared layout for the terms of use and the privacy policy. */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mx-auto w-full max-w-[720px] px-5 pb-16 pt-6 md:px-8 md:pt-14">
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted">Соңғы жаңартылған күні: {LEGAL.updated}</p>
      <div className="mt-8 space-y-8 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
      <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
        Сұрақтарыңыз болса, жазыңыз:{" "}
        <a href={`mailto:${LEGAL.contactEmail}`} className="font-medium text-amber-700 underline underline-offset-2">
          {LEGAL.contactEmail}
        </a>
        . <Link href="/terms" className="underline underline-offset-2">Пайдалану шарттары</Link> ·{" "}
        <Link href="/privacy" className="underline underline-offset-2">Құпиялылық саясаты</Link>
      </p>
    </article>
  );
}
