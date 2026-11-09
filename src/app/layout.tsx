import type { Metadata } from "next";
import { Inter, Lora, PT_Serif } from "next/font/google";
import { ReaderSync } from "@/components/reader-sync";
import "./globals.css";

const inter = Inter({
  variable: "--ff-inter",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
});

const ptSerif = PT_Serif({
  variable: "--ff-pt-serif",
  weight: ["400", "700"],
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
});

const lora = Lora({
  variable: "--ff-lora",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  preload: false,
});

const SIDEBAR_SCRIPT = `try{if(JSON.parse(localStorage.getItem("alau:v1")||"{}").settings.sidebarCollapsed===true)document.documentElement.dataset.sidebar="collapsed"}catch(e){}`;

export const metadata: Metadata = {
  title: "Alau: ағылшынша оқу",
  description: "Қазақ әңгімелерін ағылшынша деңгей бойынша оқыңыз. Сөзді бассаңыз, аудармасы бірден шығады.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="kk"
      className={`${inter.variable} ${ptSerif.variable} ${lora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Reads the folded-sidebar setting before paint; the Sidebar keeps it in step afterwards. */}
        <script dangerouslySetInnerHTML={{ __html: SIDEBAR_SCRIPT }} />
      </head>
      <body className="min-h-full">
        {children}
        <ReaderSync />
      </body>
    </html>
  );
}
