import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./enhancements.css";
import "./debate.css";
import "./learning-coach.css";
import "./learning-extras.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Administrador de Curso | INTEGR",
  description: "Experiencia profesional de Habilidades Electromecánicas en cinco días. Módulo I con teoría visual, manual, práctica y decisiones técnicas.",
  openGraph: {
    title: "Administrador de Curso INTEGR",
    description: "Módulo I · Fundamentos eléctricos · Teoría visual y práctica industrial",
    images: [{ url: "https://curso-certificacion-integr.procofa-3802.chatgpt.site/og.png", width: 1536, height: 1024, alt: "Módulo I - Aprende, calcula y decide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Administrador de Curso INTEGR",
    description: "Día 1 · Fundamentos eléctricos",
    images: ["https://curso-certificacion-integr.procofa-3802.chatgpt.site/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
