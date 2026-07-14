"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// Transição de página: grade de quadrados pretos que varre a tela de
// cima para baixo. Ao clicar num link interno, os quadrados aparecem
// (por opacidade, linha a linha, topo primeiro) cobrindo o conteúdo; a
// rota troca por trás da cobertura (com o scroll resetado ao topo,
// invisível); então os quadrados somem na mesma ordem, revelando a
// página nova. É a mesma estética das células da máscara SVG dos cards
// (ProjectScrollTransition) — aparecendo/sumindo por opacidade — só que
// com <div>s + CSS transitions em vez de <mask>.
//
// É este componente que passa a comandar a navegação interna (o
// SmoothScroll deixou de interceptar cliques). Sem JS os links navegam
// nativamente; com prefers-reduced-motion a troca é direta, sem grade.

const CELL_MS = 420; // duração da entrada/saída de cada quadrado
const ROW_STAGGER = 34; // atraso por linha (topo primeiro), em ms
const ROW_JITTER = 90; // aleatoriedade por quadrado dentro da linha, em ms

function gridCols() {
  if (window.innerWidth <= 599) return 6;
  if (window.innerWidth <= 1024) return 10;
  return 12;
}

type Phase = "idle" | "cover" | "covered" | "reveal";

export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const [cols, setCols] = useState(12);
  const [delays, setDelays] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");

  const phaseRef = useRef<Phase>("idle");
  const targetRef = useRef<string | null>(null);
  const coverMsRef = useRef(700);
  const firstRender = useRef(true);

  const setP = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  // (re)monta a grade de quadrados cobrindo o viewport; guarda o atraso
  // de cada célula e quanto dura a varredura inteira (coverMs)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const build = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const c = gridCols();
      const cell = w / c;
      const rows = Math.max(1, Math.ceil(h / cell));
      const next: number[] = [];
      let maxDelay = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < c; x++) {
          const delay = y * ROW_STAGGER + Math.random() * ROW_JITTER;
          maxDelay = Math.max(maxDelay, delay);
          next.push(delay);
        }
      }
      coverMsRef.current = maxDelay + CELL_MS + 60;
      setCols(c);
      setDelays(next);
    };
    build();
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(build, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
    };
  }, []);

  // máquina de fases: cover -> (navega) -> covered -> reveal -> idle
  useEffect(() => {
    if (phase === "cover") {
      const t = window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        setP("covered");
        if (targetRef.current) router.push(targetRef.current);
      }, coverMsRef.current);
      return () => window.clearTimeout(t);
    }
    if (phase === "reveal") {
      const t = window.setTimeout(() => setP("idle"), coverMsRef.current);
      return () => window.clearTimeout(t);
    }
  }, [phase, router]);

  // página nova montada sob a cobertura -> revela (dois rAF garantem
  // que o conteúdo novo pintou antes dos quadrados começarem a sair)
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

  if (delays.length === 0) return null;
  const rows = Math.round(delays.length / cols);

  return (
    <div
      aria-hidden
      data-phase={phase}
      className="pt-overlay"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {delays.map((delay, i) => (
        <span
          key={i}
          className="pt-cell"
          style={{
            transitionDuration: `${CELL_MS}ms`,
            transitionDelay: `${delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
