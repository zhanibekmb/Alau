import Link from "next/link";
import { Logo, Mascot } from "@/components/brand";
import { ArrowLeftIcon } from "@/components/icons";

// Sign-in, sign-up and password reset stand on their own: no sidebar and no tab bar, so the
// form is the only thing to do on the page. Desktop adds a warm panel with the mascot.

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#fff6e3] via-[#ffe7b8] to-[#ffc978] p-12 lg:flex">
        <Link href="/" className="text-4xl" aria-label="Alau">
          <Logo />
        </Link>
        <div className="max-w-md">
          <Mascot className="size-56" eager />
          <h2 className="mt-6 text-4xl font-bold leading-tight">Ағылшынша оқып, сөзді бірден түсініңіз</h2>
          <p className="mt-3 text-lg text-ink/70">
            Қазақ авторларының кітаптары ағылшын тілінде, деңгейіңізге сай. Сөзді бассаңыз — аудармасы шығады.
          </p>
        </div>
        <p className="text-sm text-ink/60">Прогресс, сөздік және серия аккаунтыңызда сақталады.</p>
      </aside>

      <main className="flex min-h-dvh flex-col">
        <header className="flex items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="text-3xl lg:invisible" aria-label="Alau">
            <Logo />
          </Link>
          <Link href="/library" className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-chip hover:text-ink">
            <ArrowLeftIcon className="size-4" />
            Кітапханаға
          </Link>
        </header>
        <div className="flex flex-1 items-center justify-center pb-10">{children}</div>
      </main>
    </div>
  );
}
