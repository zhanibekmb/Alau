import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";
import { BookCover } from "@/components/book-card";
import { Flame, Logo, Mascot, type MascotPose } from "@/components/brand";
import { LandingHeaderCta } from "@/components/landing-cta";
import { Carousel, Reasons } from "@/components/landing-interactive";
import { Phone, type PhoneShot } from "@/components/landing-phone";
import { LEGAL } from "@/content/legal";
import { listAvailableBooks, listPaidWorks } from "@/lib/catalog";
import { PREMIUM_PLANS } from "@/lib/plans";
import { LEVEL_TITLES, LEVELS } from "@/lib/types";

// The landing page at "/" (the library lives at /library). Built after the structure of
// busuu.com, in Alau's colours (amber, navy #201f4b, cream): a bright hero with a changing word and real phone screenshots,
// level pills, big numbers, a book carousel, three advantages, who it is for, a dark "why"
// block, prices, questions, a final call and a ticker. Static except the books, which follow
// license dates.

const display = Nunito({
  variable: "--ff-display",
  weight: ["800", "900"],
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
});

export const metadata: Metadata = {
  title: "Alau — ағылшын тілін қазақ кітаптары арқылы үйреніңіз",
  description:
    "Қазақ авторларының шығармалары ағылшын тілінде, A1-ден B2-ге дейін. Сөзді бассаңыз, аудармасы бірден шығады. Тегін бастаңыз.",
};

const tenge = (n: number) => `${n.toLocaleString("ru-RU")} ₸`;

export default function LandingPage() {
  return (
    <div className={`${display.variable} overflow-x-clip bg-white text-[#201f4b]`}>
      <Hero />
      <main>
        <Suspense fallback={<div className="h-[420px]" />}>
          <LevelPicker />
        </Suspense>
        <Numbers />
        <Suspense fallback={<div className="h-[640px]" />}>
          <BooksCarousel />
        </Suspense>
        <Advantages />
        <ForWhom />
        <section className="bg-[#201f4b] py-16 text-white md:py-24">
          <Container>
            <h2 className="mb-10 max-w-2xl font-display text-4xl font-black leading-tight md:text-5xl">
              Неге Alau-мен оқыған тиімді?
            </h2>
            <Reasons />
          </Container>
        </section>
        <Prices />
        <Questions />
        <FinalCall />
        <Ticker />
      </main>
      <Footer />
    </div>
  );
}

function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1180px] px-5 md:px-8 ${className}`}>{children}</div>;
}

function Heading({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <h2 className={`font-display text-3xl font-black leading-tight md:text-5xl ${center ? "text-center" : ""}`}>{children}</h2>
  );
}

/** A word that changes inside a dark pill, like the busuu hero. */
function ChangingWord({ words }: { words: string[] }) {
  return (
    <span className="relative mx-1 inline-block overflow-hidden rounded-2xl bg-[#201f4b] px-4 align-bottom leading-[1.2] whitespace-nowrap text-[#ffc24b] md:rounded-3xl md:px-6">
      {/* Every word in one grid cell, hidden: the pill takes the width of the widest as drawn.
          Counting letters is not enough: "сөйле" is wider than "түсін" in this font. */}
      <span className="invisible inline-grid">
        {words.map((word) => (
          <span key={word} className="col-start-1 row-start-1">
            {word}
          </span>
        ))}
      </span>
      <span
        className="motion-loop absolute inset-x-4 top-0 flex animate-[word-cycle_10s_cubic-bezier(.7,0,.3,1)_infinite] flex-col md:inset-x-6"
        aria-hidden="true"
      >
        {[...words, words[0]].map((word, i) => (
          <span key={i} className="text-center">
            {word}
          </span>
        ))}
      </span>
      <span className="sr-only">{words.join(", ")}</span>
    </span>
  );
}

function Hero() {
  const nav: [string, string][] = [
    ["Кітаптар", "#books"],
    ["Қалай жұмыс істейді", "#how"],
    ["Тарифтер", "#prices"],
    ["Сұрақтар", "#faq"],
  ];
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-[#ffb627] via-[#f59e0b] to-[#f07f13]">
      {/* Big soft circle at the bottom right, the busuu "wave". */}
      <div className="pointer-events-none absolute -bottom-[45%] right-[-15%] size-[900px] rounded-full bg-[#ffd27a]/50" />
      <div className="pointer-events-none absolute -left-24 top-40 size-72 rounded-full bg-white/10" />

      <Container className="relative flex h-20 items-center justify-between gap-6">
        <Link href="/" className="text-3xl text-[#201f4b]" aria-label="Alau">
          <Logo />
        </Link>
        <nav aria-label="Бөлімдер" className="hidden items-center gap-8 font-bold text-[#201f4b]/80 lg:flex">
          {nav.map(([label, href]) => (
            <a key={href} href={href} className="transition-colors hover:text-[#201f4b]">
              {label}
            </a>
          ))}
        </nav>
        <LandingHeaderCta />
      </Container>

      <Container className="relative pt-8 text-center md:pt-12">
        <h1 className="font-display text-[42px] font-black leading-[1.12] md:text-6xl xl:text-[68px]">
          Ағылшынша <ChangingWord words={["оқы", "түсін", "сөйле", "ойла"]} />
          <br className="hidden md:block" /> қазақ кітаптары арқылы
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-[#201f4b]/80 md:text-xl">
          Қазақ авторларының шығармалары ағылшынша, A1-ден B2-ге дейін.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/library"
            className="rounded-full bg-[#201f4b] px-8 py-4 font-display text-lg font-extrabold text-white shadow-xl shadow-[#201f4b]/30 transition-transform hover:scale-[1.03]"
          >
            Тегін оқуды бастау
          </Link>
          <span className="text-sm font-semibold text-[#201f4b]/70">Тіркелусіз · карта керек емес</span>
        </div>
        <Phones />
      </Container>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-white [clip-path:ellipse(75%_100%_at_50%_100%)]" />
    </header>
  );
}

/**
 * The three main things the reader does, each on a whole phone with a real screenshot of the app:
 * tap a word, keep it, review it. A row on wide screens, a swipeable strip on a phone.
 */
function Phones() {
  const steps: { shot: PhoneShot; title: string }[] = [
    { shot: "reader", title: "Сөзді басыңыз" },
    { shot: "dictionary", title: "Сөздікке сақтаңыз" },
    { shot: "review", title: "Қайталаңыз" },
  ];
  return (
    <ol className="-mx-5 mt-12 flex snap-x snap-mandatory items-start gap-8 overflow-x-auto px-5 pb-28 text-left [scrollbar-width:none] md:mx-0 md:mt-16 md:justify-center md:gap-10 md:overflow-visible md:px-0 md:pb-32 lg:gap-20 xl:gap-24">
      {steps.map((step, i) => (
        <li key={step.shot} className="flex w-[calc(414px*var(--s))] shrink-0 snap-center flex-col [--s:0.64] max-md:first:ml-auto max-md:last:mr-auto md:[--s:0.5] lg:[--s:0.62] xl:[--s:0.68]">
          <p className="flex items-center justify-center gap-2.5 font-display text-lg font-extrabold leading-tight">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#201f4b] text-base text-[#ffc24b]">{i + 1}</span>
            {step.title}
          </p>
          <Phone shot={step.shot} priority={i === 0} className="mt-5" />
        </li>
      ))}
    </ol>
  );
}

async function LevelPicker() {
  await connection();
  const books = listAvailableBooks(new Date());
  const count = (level: string) => books.filter((b) => b.level === level).length;
  const tones = ["bg-emerald-100 text-emerald-800", "bg-sky-100 text-sky-800", "bg-violet-100 text-violet-800", "bg-rose-100 text-rose-800"];
  return (
    <section className="py-14 md:py-20">
      <Container>
        <Heading center>Мен ағылшынша оқығым келеді:</Heading>
        <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
          {LEVELS.map((level, i) => (
            <li key={level}>
              <Link
                href="/library"
                className="flex items-center gap-3 rounded-full bg-[#f4f3ee] py-2.5 pl-2.5 pr-6 transition-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className={`flex size-11 items-center justify-center rounded-full font-display text-sm font-black ${tones[i]}`}>
                  {level}
                </span>
                <span className="text-left">
                  <span className="block font-display text-lg font-extrabold leading-tight">{LEVEL_TITLES[level]}</span>
                  <span className="block text-xs text-[#6e6e73]">{count(level)} кітап</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-[#6e6e73]">Деңгейіңізді білмесеңіз — A1-ден бастаңыз, кейін ауыстыра аласыз.</p>
      </Container>
    </section>
  );
}

function Numbers() {
  const items: { big: string; unit?: string; text: string; doodle: string }[] = [
    { big: "4", unit: "деңгей", text: "A1 бастауыштан B2-ге дейін", doodle: "🌱" },
    { big: "1 басу", text: "сөздің аудармасы мен айтылуы", doodle: "⚡" },
    { big: "10 мин", text: "күніне жеткілікті", doodle: "✨" },
  ];
  return (
    <section className="pb-14 md:pb-20">
      <Container className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.text} className="relative rounded-[28px] bg-[#f4f3ee] px-6 py-10 text-center">
            <p className="font-display text-5xl font-black md:text-6xl">
              {item.big}
              {item.unit && <span className="block text-3xl md:text-4xl">{item.unit}</span>}
            </p>
            <span className="absolute right-6 top-6 text-3xl" aria-hidden="true">
              {item.doodle}
            </span>
            <p className="mt-3 font-medium text-[#6e6e73]">{item.text}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}

async function BooksCarousel() {
  await connection();
  const books = listAvailableBooks(new Date());
  return (
    <section id="books" className="scroll-mt-6 pb-16 md:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-[36px] bg-[#f4f3ee] px-5 py-12 md:px-12 md:py-16">
          <div className="pointer-events-none absolute -bottom-40 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-[#ffd27a]/40" />
          <div className="relative">
            <Heading center>Нағыз кітаптар, нағыз сюжет</Heading>
            <p className="mx-auto mt-3 max-w-xl text-center text-lg text-[#6e6e73]">
              Қазақ авторларының шығармалары ағылшын тілінде. Әр кітаптың кульминацияға дейінгі бөлімі тегін.
            </p>
            <div className="mt-10">
              <Carousel>
                {books.map((book) => (
                  <li key={book.slug} className="w-[170px] shrink-0 snap-center md:w-[210px]">
                    <Link href={`/books/${book.slug}`} className="group block">
                      <div className="aspect-[2/3] overflow-hidden rounded-3xl bg-white shadow-lg transition-transform group-hover:-translate-y-1.5 group-hover:rotate-[-1deg]">
                        <BookCover cover={book.cover} className="size-full" />
                      </div>
                      <p className="mt-3 font-display text-lg font-extrabold leading-tight">{book.title}</p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-[#6e6e73]">
                        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[#201f4b]">{book.level}</span>
                        {book.author}
                      </p>
                    </Link>
                  </li>
                ))}
              </Carousel>
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/library"
                className="inline-flex rounded-full bg-[#201f4b] px-8 py-4 font-display text-lg font-extrabold text-white transition-transform hover:scale-[1.03]"
              >
                Кітапханаға өту
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Advantages() {
  const items: { pose: MascotPose; tint: string; title: string; text: string }[] = [
    { pose: "level-up", tint: "bg-[#e6f6ec]", title: "Деңгейіңізге сай", text: "Бір шығарма төрт деңгейде: сюжет сол, сөздер мен грамматика сізге лайық." },
    {
      pose: "reader-tooltip",
      tint: "bg-[#fff1d2]",
      title: "Бір басқанда аударма",
      text: "Сөз сөйлемдегі мағынасына қарай аударылады. Ағылшынша айтылуын да тыңдай аласыз.",
    },
    { pose: "mastered", tint: "bg-[#e9e7ff]", title: "Сөздер есте қалады", text: "Жеке сөздік пен ақылды қайталау ұмыта бастаған сөзді дер кезінде еске салады." },
  ];
  return (
    <section id="how" className="scroll-mt-6 pb-16 md:pb-24">
      <Container>
        <Heading>Alau артықшылықтары</Heading>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.title} className="flex flex-col rounded-[28px] bg-[#f4f3ee] p-7">
              <span className={`flex size-40 items-center justify-center self-start rounded-full ${item.tint}`}>
                <Mascot pose={item.pose} className="size-36" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-black">{item.title}</h3>
              <p className="mt-3 text-[#201f4b]/75">{item.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Line icons for the "who is it for" cards (24 px grid, 1.6 px stroke). */
const WHO_ICONS = {
  student: (
    <>
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </>
  ),
  exam: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  reader: (
    <>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </>
  ),
  parent: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.870" />
      <path d="M16 3.130a4 4 0 0 1 0 7.750" />
    </>
  ),
};

/** Who Alau is for. Use cases, not reviews: the site has no real reviews yet. */
function ForWhom() {
  const cards: { icon: keyof typeof WHO_ICONS; tint: string; title: string; text: string }[] = [
    { icon: "student", tint: "bg-[#fff1d2] text-[#b45309]", title: "Студенттерге", text: "Сөздік қорды оқулықпен емес, қызықты кітаппен толықтыру." },
    {
      icon: "exam",
      tint: "bg-[#e9e7ff] text-[#4f46a5]",
      title: "IELTS-ке дайындалатындарға",
      text: "Күн сайын ағылшынша оқу әдетін қалыптастырып, жылдам оқуға үйрену.",
    },
    { icon: "reader", tint: "bg-[#e6f6ec] text-[#1f7a4d]", title: "Кітап сүйетіндерге", text: "Таныс қазақ шығармаларын ағылшын тілінде қайта ашу." },
    { icon: "parent", tint: "bg-[#ffe4dc] text-[#b4472a]", title: "Ата-аналарға", text: "Балаға ағылшынды ана тіліндегі сюжеттер арқылы жақындату." },
  ];
  return (
    <section className="pb-16 md:pb-24">
      <Container>
        <Heading>Alau кімге арналған</Heading>
        <ul className="-mx-5 mt-10 flex snap-x gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:px-0 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.title} className="flex w-[280px] shrink-0 snap-start flex-col rounded-[28px] bg-[#f4f3ee] p-7 md:w-auto">
              <span className={`flex size-14 items-center justify-center rounded-2xl ${card.tint}`}>
                <svg
                  viewBox="0 0 24 24"
                  className="size-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {WHO_ICONS[card.icon]}
                </svg>
              </span>
              <h3 className="mt-6 font-display text-xl font-extrabold leading-snug">{card.title}</h3>
              <p className="mt-2 text-[#201f4b]/75">{card.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Prices() {
  const [monthly, annual] = PREMIUM_PLANS;
  const cheapestBook = Math.min(...listPaidWorks().map((w) => w.priceTenge));
  const plans = [
    { name: "Тегін", price: "0 ₸", per: "әрқашан", points: ["Әр кітаптың кульминацияға дейінгі бөлімі", "Сөздік, қайталау, серия"], best: false },
    { name: "Осы кітап", price: `${tenge(cheapestBook)}-ден`, per: "бір рет", points: ["Шығарманың барлық деңгейі", "Мерзімсіз сізде қалады"], best: false },
    { name: monthly.title, price: tenge(monthly.priceTenge), per: "айына", points: ["Барлық кітап толық", "Жаңа кітаптар бірден"], best: true },
    { name: annual.title, price: tenge(annual.priceTenge), per: "жылына", points: ["Барлық кітап толық", annual.note], best: false },
  ];
  return (
    <section id="prices" className="scroll-mt-6 py-16 md:py-24">
      <Container>
        <Heading center>Тегін бастаңыз, ұнаса — толық ашыңыз</Heading>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <li
              key={plan.name}
              className={`relative flex flex-col rounded-[28px] p-7 ${
                plan.best ? "bg-[#201f4b] text-white shadow-2xl lg:-translate-y-3" : "bg-[#f4f3ee]"
              }`}
            >
              {plan.best && (
                <span className="absolute -top-3 left-7 rounded-full bg-[#f59e0b] px-3 py-1 text-xs font-black text-[#201f4b]">
                  ЕҢ ТИІМДІ
                </span>
              )}
              <h3 className="font-display text-xl font-extrabold">{plan.name}</h3>
              <p className="mt-4 whitespace-nowrap font-display text-4xl font-black">{plan.price}</p>
              <p className={`text-sm ${plan.best ? "text-white/60" : "text-[#6e6e73]"}`}>{plan.per}</p>
              <ul className={`mt-5 flex-1 space-y-2 text-sm ${plan.best ? "text-white/85" : "text-[#201f4b]/80"}`}>
                {plan.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="font-black text-[#f59e0b]" aria-hidden="true">
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/library"
                className={`mt-7 rounded-full py-3.5 text-center font-display font-extrabold transition-transform hover:scale-[1.02] ${
                  plan.best ? "bg-[#f59e0b] text-[#201f4b]" : "bg-white"
                }`}
              >
                Бастау
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-[#6e6e73]">
          Тариф кітаптың соңғы тегін тарауынан кейін таңдалады. Автоматты түрде ұзармайды.
        </p>
      </Container>
    </section>
  );
}

function Questions() {
  const faq = [
    [
      "Тегін бе?",
      "Иә. Әр кітаптың кульминацияға дейінгі бөлімі мен сөздік тегін, тіркелусіз оқи бастауға болады. Тегін аккаунт ашсаңыз, кульминациядан кейінгі тарау сыйлық, сөздерді қайталау ашылады, ал прогресс барлық құрылғыда сақталады.",
    ],
    ["Қай деңгейден бастаған дұрыс?", "Ағылшынды жаңа бастасаңыз — A1. Кітаптың бірінші бетін ашып көріңіз: сөздердің көбі таныс болса, деңгей сізге сай."],
    ["Телефоннан оқуға бола ма?", "Иә. Сайт телефонға бейімделген, қосымша орнатудың қажеті жоқ — браузерде ашылады."],
    ["Прогресім жоғалмай ма?", "Тіркелсеңіз, прогресс, сөздік және серия аккаунтыңызда сақталып, кез келген құрылғыда ашылады."],
    ["Төлем қалай жасалады?", "Тариф таңдағанда сайт төлеу жолын көрсетеді. Төлем расталған соң қолжетімділік аккаунтыңызда ашылады."],
    [
      "Аудармаларды кім жасайды?",
      "Әр сөздің аудармасы сөйлемдегі мағынасына қарай дайындалады және тексеріліп отырады. Қате көрсеңіз, бізге жазыңыз.",
    ],
  ];
  return (
    <section id="faq" className="scroll-mt-6 pb-16 md:pb-24">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Heading>Жиі қойылатын сұрақтар</Heading>
          <Mascot pose="streak" className="mt-8 size-48 max-lg:hidden" />
        </div>
        <div className="flex flex-col gap-3">
          {faq.map(([question, answer]) => (
            <details key={question} className="group rounded-3xl bg-[#f4f3ee] px-6 py-5 open:bg-[#fff1d2]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-extrabold">
                {question}
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-xl transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-[#201f4b]/75">{answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FinalCall() {
  return (
    <section className="pb-12">
      <Container>
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#ffb627] via-[#f59e0b] to-[#f07f13] px-6 py-14 md:px-14 md:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-white/15" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.3fr_0.7fr]">
            <div className="text-center md:text-left">
              <h2 className="font-display text-4xl font-black leading-[1.15] md:text-6xl">
                Alau-мен <ChangingWord words={["кітап", "сөз", "әлем", "тіл"]} />
                <br />
                ашыңыз — кез келген жерде!
              </h2>
              <p className="mt-5 text-lg font-medium text-[#201f4b]/80">Телефонда да, компьютерде де — браузерде бірден ашылады.</p>
              <Link
                href="/library"
                className="mt-8 inline-flex rounded-full bg-[#201f4b] px-8 py-4 font-display text-lg font-extrabold text-white shadow-xl transition-transform hover:scale-[1.03]"
              >
                Бірінші тарауды оқу
              </Link>
            </div>
            <Mascot pose="onboarding-login" className="mx-auto size-56 md:size-72" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function Ticker() {
  const words = ["Жаңа сөз", "Жаңа кітап", "Жаңа мүмкіндік"];
  const row = [...words, ...words, ...words, ...words];
  return (
    <div className="overflow-hidden border-y border-[#e5e5ea] py-6" aria-hidden="true">
      <div className="motion-loop flex w-max animate-[marquee_28s_linear_infinite] gap-10">
        {[...row, ...row].map((word, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-4xl font-black md:text-6xl">
            {word}
            <Flame variant="color" className="size-9 md:size-12" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const columns: { title: string; links: [string, string][] }[] = [
    {
      title: "Alau",
      links: [
        ["Кітапхана", "/library"],
        ["Тарифтер", "#prices"],
        ["Кітаптар", "#books"],
      ],
    },
    {
      title: "Көмек",
      links: [
        ["Жиі қойылатын сұрақтар", "#faq"],
        ["Байланыс", `mailto:${LEGAL.contactEmail}`],
        ["Кіру", "/login"],
      ],
    },
    {
      title: "Құқықтық ақпарат",
      links: [
        ["Пайдалану шарттары", "/terms"],
        ["Құпиялылық саясаты", "/privacy"],
      ],
    },
  ];
  return (
    <footer className="bg-[#f4f3ee] pb-10 pt-14">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="text-3xl" aria-label="Alau">
              <Logo variant="color" />
            </Link>
            <p className="mt-3 max-w-xs text-[#6e6e73]">Ағылшын тілін қазақ кітаптары арқылы үйреніңіз.</p>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="font-display text-lg font-extrabold">{column.title}</p>
              <ul className="mt-3 space-y-2 text-[#201f4b]/75">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith("/") ? (
                      <Link href={href} className="hover:text-[#201f4b] hover:underline">
                        {label}
                      </Link>
                    ) : (
                      <a href={href} className="hover:text-[#201f4b] hover:underline">
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-12 border-t border-[#e5e5ea] pt-6 text-sm text-[#6e6e73]">© 2026 Alau</p>
      </Container>
    </footer>
  );
}
