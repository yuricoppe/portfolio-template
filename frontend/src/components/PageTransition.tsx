"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// Transição de página: persianas horizontais ("horizontal blinds",
// Codrops/Hiro-kiii). Ao clicar num link interno, faixas pretas de
// largura total crescem a partir da própria linha central (scaleY),
// escalonadas de baixo para cima, cobrindo o conteúdo; a rota troca por
// trás da cobertura (com o scroll resetado ao topo, invisível); então
// as faixas encolhem de volta ao centro na mesma ordem, revelando a
// página nova. É a mesma estética das persianas da máscara SVG dos
// cards (ProjectScrollTransition) — só que com <div>s + CSS transitions
// em vez de <mask>.
//
// É este componente que passa a comandar a navegação interna (o
// SmoothScroll deixou de interceptar cliques). Sem JS os links navegam
// nativamente; com prefers-reduced-motion a troca é direta, sem faixas.

const BLIND_COUNT = 24; // faixas horizontais cobrindo o viewport
const BLIND_MS = 440; // duração da abertura/fechamento de cada faixa
const STAGGER = 16; // atraso por faixa (base primeiro), em ms

const COVER_MS = (BLIND_COUNT - 1) * STAGGER + BLIND_MS + 60;

type Phase = "idle" | "cover" | "covered" | "reveal";

export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");

  const phaseRef = useRef<Phase>("idle");
  const targetRef = useRef<string | null>(null);
  const firstRender = useRef(true);

  const setP = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  useEffect(() => {
    if (!prefersReducedMotion()) setEnabled(true);
  }, []);

  // máquina de fases: cover -> (navega) -> covered -> reveal -> idle
  useEffect(() => {
    if (phase === "cover") {
      const t = window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        setP("covered");
        if (targetRef.current) router.push(targetRef.current);
      }, COVER_MS);
      return () => window.clearTimeout(t);
    }
    if (phase === "reveal") {
      const t = window.setTimeout(() => setP("idle"), COVER_MS);
      return () => window.clearTimeout(t);
    }
  }, [phase, router]);

  // página nova montada sob a cobertura -> revela (dois rAF garantem
  // que o conteúdo novo pintou antes das faixas começarem a abrir)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (phaseRef.current === "covered") {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setP("reveal")),
      );
    }
  }, [pathname]);

  // intercepta cliques em links internos para cobrir antes de navegar
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const t = e.target;
      if (!(t instanceof Element)) return;
      const link = t.closest<HTMLAnchorElement>('a[href^="/"]');
      if (!link || link.target === "_blank") return;
      const href = link.getAttribute("href");
      if (!href || href === pathname) return;
      // durante uma transição, bloqueia novos cliques até terminar
      if (phaseRef.current !== "idle") {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      targetRef.current = href;
      setP("cover");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  if (!enabled) return null;

  return (
    <div aria-hidden data-phase={phase} className="pt-overlay">
      {Array.from({ length: BLIND_COUNT }, (_, i) => (
        <span
          key={i}
          className="pt-blind"
          style={{
            transitionDuration: `${BLIND_MS}ms`,
            // base primeiro, como o stagger do demo
            transitionDelay: `${(BLIND_COUNT - 1 - i) * STAGGER}ms`,
          }}
        />
      ))}
    </div>
  );
}
