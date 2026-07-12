"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/projetos", label: "Projetos" },
  { href: "/quem-somos", label: "Quem somos" },
];

export default function Header({
  overlay = false,
  siteName = "COLATIVO",
}: {
  overlay?: boolean;
  siteName?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`${
        overlay ? "absolute top-0 left-0 right-0 z-20" : "relative z-20"
      } flex items-center justify-between px-page py-6 md:py-8`}
    >
      <Link
        href="/"
        className="flex items-center gap-3 text-white"
        onClick={() => setOpen(false)}
      >
        <span className="inline-block h-[22px] w-[22px] rounded-[7px] bg-white" />
        <span className="text-[15px] font-medium tracking-[0.24em]">
          {siteName}
        </span>
      </Link>

      {/* desktop nav */}
      <nav className="hidden items-center gap-7 text-[15px] md:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              pathname.startsWith(l.href)
                ? "border-b border-white pb-0.5 text-white"
                : "text-white/85 transition-colors hover:text-white"
            }
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/contato"
          className="rounded-[10px] bg-white/14 px-[22px] py-3 text-white backdrop-blur-md transition-colors hover:bg-white/24"
        >
          Contato
        </Link>
      </nav>

      {/* mobile toggle */}
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
      >
        <span
          className={`block h-px w-6 bg-white transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
        />
        <span
          className={`block h-px w-6 bg-white transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
        />
      </button>

      {/* mobile menu */}
      {open && (
        <div className="absolute inset-x-0 top-full z-30 flex flex-col gap-1 bg-[#0a0a0a]/95 px-page pb-8 pt-4 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 text-2xl font-medium text-white"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contato"
            onClick={() => setOpen(false)}
            className="py-3 text-2xl font-medium text-white"
          >
            Contato
          </Link>
        </div>
      )}
    </header>
  );
}
