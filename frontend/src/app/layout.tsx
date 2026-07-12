import type { Metadata } from "next";
import Cursor from "@/components/Cursor";
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
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {children}
        <Cursor />
      </body>
    </html>
  );
}
