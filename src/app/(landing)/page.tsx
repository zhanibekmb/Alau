import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";
import { BookCover } from "@/components/book-card";
import { Flame, Logo, Mascot, type MascotPose } from "@/components/brand";
import { DictionaryIcon } from "@/components/icons";
import { LandingHeaderCta } from "@/components/landing-cta";
import { Carousel, Reasons } from "@/components/landing-interactive";
import { LEGAL } from "@/content/legal";
import { listAvailableBooks, listPaidWorks } from "@/lib/catalog";
import { PREMIUM_PLANS } from "@/lib/plans";
import { LEVEL_TITLES, LEVELS } from "@/lib/types";

// The landing page at "/" (the library lives at /library). Built after the structure of
// busuu.com, in Alau's colours (amber, navy #201f4b, cream): a bright hero with a changing word,
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
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a));
  return (
    <span className="relative mx-1 inline-block overflow-hidden rounded-2xl bg-[#201f4b] px-4 align-bottom leading-[1.2] text-[#ffc24b] md:rounded-3xl md:px-6">
      <span className="invisible">{longest}</span>
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
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-[#ffb627] via-[#f59e0b] to-[#f07f13]">
      {/* Big soft circle at the bottom right, the busuu "wave". */}
      <div className="pointer-events-none absolute -bottom-[45%] right-[-15%] size-[900px] rounded-full bg-[#ffd27a]/50" />
      <div className="pointer-events-none absolute -left-24 top-40 size-72 rounded-full bg-white/10" />

      <Container className="relative flex h-20 items-center justify-between">
        <Link href="/" className="text-3xl text-[#201f4b]" aria-label="Alau">
          <Logo />
        </Link>
        <LandingHeaderCta />
      </Container>

      <Container className="relative grid items-center gap-10 pb-24 pt-6 md:pb-32 md:pt-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center justify-center rounded-2xl bg-white/90 p-2.5 shadow-md">
            <Flame variant="color" className="size-9" />
          </span>
          <h1 className="mt-6 font-display text-[42px] font-black leading-[1.12] md:text-6xl xl:text-[68px]">
            Ағылшынша <ChangingWord words={["оқы", "түсін", "сөйле", "ойла"]} />
            <br className="hidden md:block" /> қазақ кітаптары арқылы
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-[#201f4b]/80 md:text-xl lg:mx-0">
            Қазақ авторларының шығармалары ағылшын тілінде, A1-ден B2-ге дейін. Таныс емес сөзді бассаңыз — аудармасы бірден
            шығады.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/library"
              className="rounded-full bg-[#201f4b] px-8 py-4 font-display text-lg font-extrabold text-white shadow-xl shadow-[#201f4b]/30 transition-transform hover:scale-[1.03]"
            >
              Тегін оқуды бастау
            </Link>
            <span className="text-sm font-semibold text-[#201f4b]/70">Тіркелусіз · карта керек емес</span>
          </div>
        </div>
        <Phones />
      </Container>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-white [clip-path:ellipse(75%_100%_at_50%_100%)]" />
    </header>
  );
}

/** Two phones: the reader with a tapped word, and a review card. Pictures, not live UI. */
function Phones() {
  const frame = "absolute rounded-[38px] border-[7px] border-[#201f4b] bg-[#fcfbf7] shadow-2xl";
  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[460px] md:h-[520px]" aria-hidden="true">
      <div className={`${frame} left-[6%] top-6 h-[400px] w-[220px] rotate-[-6deg] md:h-[450px] md:w-[240px]`}>
        <div className="mx-auto mt-2 h-4 w-20 rounded-full bg-[#201f4b]" />
        <div className="px-4 pt-3">
          <p className="text-[10px] text-[#6e6e73]">The Little Foal · 1-тарау</p>
          <div className="mt-1 h-1 rounded-full bg-[#e5e5ea]">
            <div className="h-full w-1/3 rounded-full bg-[#f59e0b]" />
          </div>
          <p className="mt-4 font-serif text-[15px] font-semibold">A Cold Morning</p>
          <p className="mt-2 font-serif text-[12.5px] leading-[1.8] text-[#111]">
            Dana is ten years old. She lives in a small village in the{" "}
            <span className="rounded bg-[#f59e0b]/45 px-0.5">steppe</span>. Her family has many horses.
          </p>
          <div className="relative mt-3 rounded-2xl border border-[#e5e5ea] bg-white p-3 shadow-lg">
            <p className="text-sm font-bold">
              steppe <span className="text-[10px] font-normal text-[#6e6e73]">/step/ · зат есім</span>
            </p>
            <p className="text-sm">дала</p>
            <p className="mt-2 inline-block rounded-lg bg-[#f59e0b] px-2 py-1 text-[10px] font-bold">Сөздікке сақтау</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1 rounded-full border border-[#e5e5ea] px-2 py-1 text-[10px] font-bold text-[#f59e0b]">
              <DictionaryIcon className="size-3.5" />3
            </span>
            <span className="rounded-full bg-[#f59e0b] px-3 py-1 text-[10px] font-bold">Келесі →</span>
          </div>
        </div>
      </div>
      <div className={`${frame} right-[2%] top-24 h-[330px] w-[190px] rotate-[7deg] bg-white md:h-[370px] md:w-[210px]`}>
        <div className="mx-auto mt-2 h-3.5 w-16 rounded-full bg-[#201f4b]" />
        <div className="px-3 pt-3">
          <div className="h-1.5 rounded-full bg-[#e5e5ea]">
            <div className="h-full w-2/3 rounded-full bg-[#f59e0b]" />
          </div>
          <div className="mt-4 rounded-2xl bg-[#f4f3ee] p-4 text-center">
            <p className="text-[10px] text-[#6e6e73]">зат есім</p>
            <p className="mt-1 text-2xl font-black">foal</p>
            <p className="mt-2 font-serif text-[10px] italic text-[#6e6e73]">«One horse has a new foal.»</p>
            <div className="mt-3 border-t border-dashed border-[#e5e5ea] pt-2">
              <p className="text-base font-bold text-amber-800">құлын</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-bold">
            <span className="rounded-xl border-2 border-[#e5e5ea] py-2 text-center">Есімде жоқ</span>
            <span className="rounded-xl bg-[#f59e0b] py-2 text-center">Білемін</span>
          </div>
        </div>
      </div>
      <Mascot
        pose="reader-tooltip"
        eager
        className="motion-loop absolute -bottom-2 left-[38%] size-32 animate-[float_4s_ease-in-out_infinite] md:size-36"
      />
      <span className="absolute right-[8%] top-6 text-4xl">✨</span>
    </div>
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
    <section className="pb-16 md:pb-24">
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

/** Who Alau is for. Use cases, not reviews: the site has no real reviews yet. */
function ForWhom() {
  const cards = [
    { tone: "bg-[#fff1c9]", tag: "Студенттерге", icon: "🎓", text: "Сөздік қорды оқулықпен емес, қызықты кітаппен толықтыру." },
    { tone: "bg-[#ece6ff]", tag: "IELTS-ке дайындалатындарға", icon: "📝", text: "Күн сайын ағылшынша оқу әдетін қалыптастырып, жылдам оқуға үйрену." },
    { tone: "bg-[#dff5ea]", tag: "Кітап сүйетіндерге", icon: "📚", text: "Таныс қазақ шығармаларын ағылшын тілінде қайта ашу." },
    { tone: "bg-[#ffe4dc]", tag: "Ата-аналарға", icon: "👨‍👩‍👧", text: "Балаға ағылшынды ана тіліндегі сюжеттер арқылы жақындату." },
  ];
  return (
    <section className="pb-16 md:pb-24">
      <Container>
        <Heading>Alau кімге арналған</Heading>
        <ul className="-mx-5 mt-10 flex snap-x gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:px-0 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.tag} className={`flex w-[280px] shrink-0 snap-start flex-col rounded-[28px] p-7 md:w-auto ${card.tone}`}>
              <span className="text-4xl" aria-hidden="true">
                {card.icon}
              </span>
              <p className="mt-4 text-sm font-bold uppercase tracking-wider text-[#201f4b]/60">{card.tag}</p>
              <p className="mt-3 font-display text-2xl font-black leading-snug">{card.text}</p>
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
    ["Тегін бе?", "Иә. Әр кітаптың кульминацияға дейінгі бөлімі, сөздік пен қайталау тегін. Тіркелусіз оқи бастауға болады."],
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
