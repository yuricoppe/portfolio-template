"use client";

import { useRef } from "react";
import { useRafScroll } from "@/lib/motion";

// Reveal do footer com persianas horizontais — a mesma estética das
// transições (PageTransition / ProjectScrollTransition). O footer
// continua sticky atrás do conteúdo, mas em vez do gradual blur ele
// nasce coberto por faixas na cor do fundo da página que encolhem por
// scaleY (a partir da própria linha central, base → topo) conforme o
// scroll o expõe — o progresso é quanto do footer já passou da borda
// inferior do conteúdo.
//
// De propósito NÃO usa <mask> SVG como o ProjectScrollTransition: no
// Chromium, mask CSS em elemento sticky "stuck" pinta errado (o fundo
// some e os filhos escapam da máscara); só renderiza certo quando o
// sticky chega à posição natural. Faixas por transform não têm esse
// problema. Sem JS ou com prefers-reduced-motion o overlay é ocultado
// em globals.css e o footer aparece normal.

const BLIND_COUNT = 20; // fixo (SSR); espessura próxima das demais persianas
// a varredura acompanha a exposição inteira: a última faixa termina de
// abrir exatamente quando o footer está totalmente revelado (o scroll
// no fim da página alinha a borda do conteúdo com o topo do footer)
const SWEEP_END = 1;
// fração do sweep gasta escalonando o início das faixas; o restante é
// a duração da abertura de cada uma
const STAGGER_SPREAD = 0.3;
// sobra de escala quando fechada, para não haver frestas de subpixel
const OVERLAP = 1.04;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function FooterReveal() {
  const coverRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<string[]>([]);

  useRafScroll(() => {
    const cover = coverRef.current;
    if (!cover) return;
    const footer = cover.closest("footer");
    if (!footer) return;
    // o irmão anterior é o wrapper de conteúdo (relative z-10) que
    // cobre o footer; a borda inferior dele dita o progresso do reveal
    const content = footer.previousElementSibling;
    if (!content) return;

    const vh = window.innerHeight;
    const fh = footer.offsetHeight;
    const exposed = clamp01(
      (vh - content.getBoundingClientRect().bottom) / Math.min(fh, vh),
    );
    const sweep = clamp01(exposed / SWEEP_END);

    const blinds = cover.children;
    const n = blinds.length;
    for (let i = 0; i < n; i++) {
      // como nas demais persianas: a primeira a abrir é a de baixo
      const order = n > 1 ? (n - 1 - i) / (n - 1) : 0;
      const bt = clamp01(
        (sweep - order * STAGGER_SPREAD) / (1 - STAGGER_SPREAD),
      );
      const s = ((1 - easeOutCubic(bt)) * OVERLAP).toFixed(4);
      if (lastRef.current[i] !== s) {
        lastRef.current[i] = s;
        (blinds[i] as HTMLElement).style.transform = `scaleY(${s})`;
      }
    }
  });

  return (
    <div
      ref={coverRef}
      aria-hidden
      className="ftr-cover pointer-events-none absolute inset-0 z-20 flex flex-col"
    >
      {Array.from({ length: BLIND_COUNT }, (_, i) => (
        <span key={i} className="ftr-blind" />
      ))}
    </div>
  );
}
