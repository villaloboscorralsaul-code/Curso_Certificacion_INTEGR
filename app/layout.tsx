import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Administrador de Curso | INTEGR",
  description: "Programa de Habilidades Electromecánicas en cinco días. Teoría, video-lección, práctica interactiva y debates técnicos.",
  openGraph: {
    title: "Administrador de Curso INTEGR",
    description: "Día 1 · Fundamentos eléctricos · Aprender, calcular y decidir",
    images: [{ url: "https://curso-certificacion-integr.procofa-3802.chatgpt.site/og-admin.png", width: 1536, height: 1024, alt: "Administrador de Curso INTEGR - Día 1" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Administrador de Curso INTEGR",
    description: "Día 1 · Fundamentos eléctricos",
    images: ["https://curso-certificacion-integr.procofa-3802.chatgpt.site/og-admin.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
