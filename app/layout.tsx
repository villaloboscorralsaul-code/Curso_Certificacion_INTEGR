import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ruta de Certificación | INTEGR",
  description: "Curso interactivo con 15 casos de debate, videos, narración y decisiones técnicas de electricidad, mecánica y electrónica industrial.",
  openGraph: {
    title: "Ruta de Certificación INTEGR",
    description: "15 casos · 3 disciplinas · decisiones reales",
    images: [{ url: "https://curso-certificacion-integr.procofa-3802.chatgpt.site/og.png", width: 1536, height: 1024, alt: "Ruta de Certificación INTEGR" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruta de Certificación INTEGR",
    description: "15 casos · 3 disciplinas · decisiones reales",
    images: ["https://curso-certificacion-integr.procofa-3802.chatgpt.site/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
