"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

export interface WeightHoverOptions {
  radius?: number; // raio de influência do cursor, em px
  maxWeight?: number; // peso no centro do raio (eixo wght da Elms Sans)
}

// Efeito de peso por proximidade usando o eixo wght da fonte variável:
// os caracteres .wf-char próximos do cursor engrossam suavemente e
// voltam ao peso original quando o cursor se afasta. A fluidez vem da
// transition de font-variation-settings no CSS (.wf-char).
export function useWeightHover(
  ref: React.RefObject<HTMLElement | null>,
  { radius = 100, maxWeight = 900 }: WeightHoverOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!hasFinePointer() || prefersReducedMotion()) return;

    const spans = Array.from(el.querySelectorAll<HTMLElement>(".wf-char"));
    if (spans.length === 0) return;

    const baseWeight =
      parseInt(getComputedStyle(el).fontWeight, 10) || 400;

    // Trava a largura de cada letra no tamanho do peso base: sem isso,
    // o engrossamento no hover alarga o glifo, empurra as letras
    // seguintes e reflui a palavra (às vezes pra outra linha).
    for (const span of spans) {
      span.style.width = `${span.getBoundingClientRect().width}px`;
    }

    let raf = 0;
    let lastEvent: PointerEvent | null = null;

    const update = () => {
      raf = 0;
      const e = lastEvent;
      if (!e) return;
      for (const span of spans) {
        const r = span.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius) {
          // falloff suave (easing cúbico) do centro até a borda do raio
          const t = 1 - dist / radius;
          const eased = t * t * (3 - 2 * t);
          const w = Math.round(baseWeight + (maxWeight - baseWeight) * eased);
          span.style.fontVariationSettings = `"wght" ${w}`;
        } else if (span.style.fontVariationSettings) {
          span.style.fontVariationSettings = `"wght" ${baseWeight}`;
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      lastEvent = e;
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onLeave = () => {
      lastEvent = null;
      cancelAnimationFrame(raf);
      raf = 0;
      spans.forEach((s) => {
        if (s.style.fontVariationSettings) {
          s.style.fontVariationSettings = `"wght" ${baseWeight}`;
        }
      });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [ref, radius, maxWeight]);
}

// Divide um texto em palavras (.wf-word, inline-block) e cada palavra em
// spans .wf-char por caractere. Agrupar por palavra garante que a quebra
// de linha só aconteça no espaço vazio entre palavras, nunca no meio de
// uma palavra.
export function weightChars(text: string) {
  const words = text.split(" ");
  const nodes: React.ReactNode[] = [];
  words.forEach((word, wi) => {
    nodes.push(
      <span key={`w-${wi}`} className="wf-word">
        {word.split("").map((c, ci) => (
          <span key={ci} aria-hidden className="wf-char">
            {c}
          </span>
        ))}
      </span>,
    );
    // espaço fora do .wf-word: dentro dele seria colapsado no fim da
    // caixa inline-block (sem white-space: pre-wrap como em .blur-word)
    if (wi < words.length - 1) nodes.push(" ");
  });
  return nodes;
}

// Texto com o efeito de engrossar próximo ao cursor.
export default function WeightText({
  text,
  className = "",
  ...options
}: {
  text: string;
  className?: string;
} & WeightHoverOptions) {
  const ref = useRef<HTMLSpanElement>(null);
  useWeightHover(ref, options);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {weightChars(text)}
    </span>
  );
}
