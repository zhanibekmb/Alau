import type { Metadata } from "next";
import { Inter, Lora, PT_Serif } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Alau: ағылшынша оқу",
  description: "Қазақ әңгімелерін ағылшынша деңгей бойынша оқыңыз. Сөзді бассаңыз, аудармасы бірден шығады.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk" className={`${inter.variable} ${ptSerif.variable} ${lora.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
