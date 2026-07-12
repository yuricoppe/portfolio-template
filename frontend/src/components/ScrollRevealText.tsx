"use client";

import { useEffect, useRef } from "react";

// Texto que revela palavra por palavra conforme o scroll: as palavras
// começam apagadas/desfocadas e ficam nítidas à medida que o bloco
// atravessa o viewport (efeito scroll-linked, não one-shot).
export default function ScrollRevealText({
  lead,
  muted,
  className = "",
  breakAfterLead = false,
}: {
  lead: string;
  muted?: string;
  className?: string;
  breakAfterLead?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(
      el.querySelectorAll<HTMLElement>(".srt-word"),
    );
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.classList.add("srt-word--on"));
      return;
    }

    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quando o topo do bloco está a 90% do viewport,
      // 1 quando o bloco chega a ~35% da tela
      const progress = Math.min(
        1,
        Math.max(0, (vh * 0.9 - rect.top) / (vh * 0.55)),
      );
      const revealed = Math.floor(progress * (words.length + 2));
      words.forEach((w, i) => {
        w.classList.toggle("srt-word--on", i < revealed);
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const renderWords = (text: string, mutedPart: boolean) =>
    text.split(" ").map((w, i) => (
      <span
        key={`${mutedPart}-${i}`}
        aria-hidden
        className={`srt-word ${mutedPart ? "srt-word--muted" : ""}`}
      >
        {w}{" "}
      </span>
    ));

  return (
    <h2 ref={ref} className={className} aria-label={`${lead} ${muted ?? ""}`}>
      {renderWords(lead, false)}
      {breakAfterLead && <br />}
      {muted ? renderWords(muted, true) : null}
    </h2>
  );
}
