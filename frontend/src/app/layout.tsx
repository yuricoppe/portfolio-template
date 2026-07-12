import type { Metadata } from "next";
import Cursor from "@/components/Cursor";
import GlowTracker from "@/components/GlowTracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colativo — Design, estratégia e tecnologia",
  description:
    "O coletivo de design, estratégia e tecnologia por trás de marcas e produtos que movem negócios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: o script inline abaixo adiciona a classe
    // "js" ao <html> antes da hidratação, o que é intencional.
    <html lang="pt-BR" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        {/* Marca html.js antes do primeiro paint: os estados iniciais
            ocultos das animações só se aplicam quando o JS está ativo,
            então sem JavaScript todo o conteúdo permanece visível. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {children}
        <Cursor />
        <GlowTracker />
      </body>
    </html>
  );
}
