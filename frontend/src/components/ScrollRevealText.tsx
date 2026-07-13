"use client";

import { useRef } from "react";
import { prefersReducedMotion, useRafScroll } from "@/lib/motion";
import { scrambleChars, useScramble } from "@/components/ScrambleText";

// Texto que revela palavra por palavra conforme o scroll: as palavras
// começam apagadas/desfocadas e ficam nítidas à medida que o bloco
// atravessa o viewport (efeito scroll-linked, não one-shot).
// Sem JavaScript o texto permanece visível (gating via html.js no CSS).
export default function ScrollRevealText({
  lead,
  muted,
  as: Tag = "h2",
  className = "",
  breakAfterLead = false,
}: {
  lead: string;
  muted?: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  breakAfterLead?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const lastRevealed = useRef(-1);
  useScramble(ref);

  useRafScroll(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>(".srt-word"));
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 quando o topo do bloco está a 90% do viewport,
    // 1 quando o bloco chega a ~35% da tela
    const progress = Math.min(
      1,
      Math.max(0, (vh * 0.9 - rect.top) / (vh * 0.55)),
    );
    const revealed = Math.min(
      words.length,
      Math.floor(progress * (words.length + 2)),
    );
    if (revealed === lastRevealed.current) return;
    lastRevealed.current = revealed;
    words.forEach((w, i) => {
      w.classList.toggle("srt-word--on", i < revealed);
    });
  });

  const renderWords = (text: string, mutedPart: boolean) =>
    text.split(" ").map((w, i) => (
      <span
        key={`${mutedPart}-${i}`}
        aria-hidden
        className={`srt-word ${mutedPart ? "srt-word--muted" : ""}`}
      >
        {scrambleChars(w)}{" "}
      </span>
    ));

  return (
    <Tag ref={ref} className={className} aria-label={`${lead} ${muted ?? ""}`}>
      {renderWords(lead, false)}
      {breakAfterLead && <br />}
      {muted ? renderWords(muted, true) : null}
    </Tag>
  );
}
