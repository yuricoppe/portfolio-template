import Link from "next/link";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import Spotlight from "@/components/Spotlight";
import type { Global } from "@/lib/types";

export default function Footer({ global }: { global: Global }) {
  return (
    // sticky bottom-0: o footer fica preso ao fundo do viewport, atrás do
    // conteúdo (que usa relative z-10 + bg opaco nas páginas), e a última
    // seção o revela conforme o scroll chega ao fim.
    <footer
      data-light-section
      className="sticky bottom-0 overflow-hidden bg-paper px-page pb-12 pt-24 text-[#0a0a0a] md:pt-40"
    >
      <Spotlight color="rgba(61, 67, 184, 0.08)" size={560} />
      <Reveal>
        <h2 className="max-w-5xl text-4xl font-medium leading-[1.15] tracking-tight md:text-[56px]">
          <ScrambleText text={global.ctaLead} />{" "}
          <span className="text-[#9a9a9a]">
            <ScrambleText text={global.ctaMuted} />
          </span>
        </h2>
      </Reveal>
      <Link
        href="/contato"
        className="glow-border btn-elastic relative z-10 mt-10 inline-block rounded-[10px] bg-[#0a0a0a] px-7 py-3.5 text-[15px] font-medium text-white hover:bg-[#2a2a2a]"
      >
        Contato
      </Link>
      <div className="mt-20 flex flex-col gap-2 border-t border-[#e4e4e4] pt-7 text-sm text-[#8a8a8a] sm:flex-row sm:justify-between md:mt-32">
        <span>© 2026 {capitalize(global.siteName)}</span>
        <span>{global.email}</span>
        <span>{global.location}</span>
      </div>
    </footer>
  );
}

function capitalize(s: string) {
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
