import type { Metadata } from "next";
import { Elms_Sans, Noto_Sans } from "next/font/google";
import * as React from "react";
import Cursor from "@/components/Cursor";
import GlowTracker from "@/components/GlowTracker";
import Scrollbar from "@/components/Scrollbar";
import { getGlobal } from "@/lib/api";
import "./globals.css";

// Fonte principal (títulos/UI): Elms Sans variável, eixo wght 100–900 —
// o eixo é usado no efeito de peso por proximidade dos títulos.
const elms = Elms_Sans({
  subsets: ["latin"],
  variable: "--font-elms",
});

// Fonte dos parágrafos: Noto Sans.
const noto = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
});

// Com experimental.viewTransition, o React vendorado pelo Next exporta
// ViewTransition — os @types/react estáveis ainda não o tipam.
const ViewTransition = (
  React as unknown as {
    ViewTransition: React.ComponentType<{
      children: React.ReactNode;
      name?: string;
    }>;
  }
).ViewTransition;

export async function generateMetadata(): Promise<Metadata> {
  const global = await getGlobal();
  const name = global.siteName.toLowerCase();
  const title = `${name.charAt(0).toUpperCase()}${name.slice(1)} — Design, estratégia e tecnologia`;
  return {
    title,
    description: global.siteDescription,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: o script inline abaixo adiciona a classe
    // "js" ao <html> antes da hidratação, o que é intencional.
    <html
      lang="pt-BR"
      className={`${elms.variable} ${noto.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {/* Marca html.js antes do primeiro paint: os estados iniciais
            ocultos das animações só se aplicam quando o JS está ativo,
            então sem JavaScript todo o conteúdo permanece visível. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <ViewTransition name="page">{children}</ViewTransition>
        <Cursor />
        <GlowTracker />
        <Scrollbar />
      </body>
    </html>
  );
}
