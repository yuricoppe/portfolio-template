"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GradualBlur from "@/components/GradualBlur";

const links = [
  { href: "/projetos", label: "Projetos" },
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/contato", label: "Contato" },
];

// Header fixo no topo em todas as páginas, com gradual blur no fundo.
// A navegação é sempre pelo menu fullscreen (hambúrguer em qualquer
// resolução). Logo e hambúrguer usam mix-blend-difference para
// permanecerem legíveis sobre fundos claros (ex.: footer branco).
export default function Header({
  siteName = "COLATIVO",
}: {
  siteName?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [onLight, setOnLight] = useState(false);

  // Inverte as cores do header quando uma seção clara (ex.: footer
  // branco, marcada com data-light-section) passa sob a barra fixa.
  // Nota: mix-blend-difference não serve aqui — além de o header ser
  // um stacking context próprio (o blend não enxerga a página), um
  // filho com blend impede o backdrop-filter irmão de amostrar o
  // conteúdo atrás (backdrop root do Chromium).
  useEffect(() => {
    const sections = document.querySelectorAll("[data-light-section]");
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const anyUnderHeader = entries.some((e) => e.isIntersecting);
        setOnLight(anyUnderHeader);
      },
      // observa apenas a faixa do header no topo do viewport
      { rootMargin: `0px 0px -${window.innerHeight - 96}px 0px` },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  // trava o scroll do body enquanto o menu está aberto
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // fecha o menu ao navegar
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* menu fullscreen */}
      {open && (
        <div className="menu-panel fixed inset-0 z-40 flex flex-col justify-center bg-[#070707]/97 px-page backdrop-blur-2xl">
          <nav className="flex flex-col">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="menu-item group flex items-baseline gap-5 border-b border-line py-6 text-4xl font-medium text-white transition-colors last:border-b-0 hover:text-white sm:py-8 sm:text-6xl md:text-7xl"
                style={{ animationDelay: `${100 + i * 80}ms` }}
              >
                <span className="text-sm font-normal text-faint sm:text-base">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={
                    pathname.startsWith(l.href)
                      ? "text-white"
                      : "text-white/70 transition-colors duration-300 group-hover:text-white"
                  }
                >
                  {l.label}
                </span>
                <span className="ml-auto translate-x-2 text-2xl text-white/0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-white/60 sm:text-4xl">
                  →
                </span>
              </Link>
            ))}
          </nav>
          <div
            className="menu-item absolute bottom-10 left-5 right-5 flex flex-col gap-1 text-sm text-faint md:left-11 md:right-11 md:flex-row md:justify-between"
            style={{ animationDelay: "420ms" }}
          >
            <span>ola@colativo.com.br</span>
            <span>São Paulo — BR</span>
          </div>
        </div>
      )}

      {/* barra fixa */}
      <header className="fixed inset-x-0 top-0 z-50">
        {!open && (
          <div className="absolute inset-x-0 top-0 h-[110px]">
            <GradualBlur position="top" height={110} blur={256} />
          </div>
        )}
        {/* z-20 > z-10 da faixa de blur: a linha pinta depois dela e
            fica fora do backdrop, senão logo/hambúrguer são borrados */}
        <div
          className={`relative z-20 flex items-center justify-between px-page py-6 transition-colors duration-300 md:py-8 ${onLight && !open ? "text-[#0a0a0a]" : "text-white"
            }`}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <span className="inline-block h-[22px] w-[22px] rounded-[7px] bg-current transition-colors duration-300" />
            <span className="text-[15px] font-medium tracking-[0.24em]">
              {siteName}
            </span>
          </Link>

          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[6px]"
          >
            <span
              className={`block h-[2px] w-7 bg-current transition-all duration-300 ${open ? "translate-y-[4px] rotate-45" : ""
                }`}
            />
            <span
              className={`block h-[2px] w-7 bg-current transition-all duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""
                }`}
            />
          </button>
        </div>
      </header>
    </>
  );
}
