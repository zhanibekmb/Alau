import Link from "next/link";
import { Mascot } from "@/components/brand";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <Mascot pose="empty-state" className="size-28" />
      <h1 className="text-2xl font-bold">Бет табылмады</h1>
      <p className="text-muted">Мұндай бет жоқ немесе кітап енді қолжетімсіз.</p>
      <Link href="/library" className="rounded-xl bg-accent px-5 py-3 font-medium text-on-accent">
        Кітапханаға оралу
      </Link>
    </main>
  );
}
