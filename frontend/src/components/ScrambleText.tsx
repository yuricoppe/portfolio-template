"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

const DEFAULT_CHARS = "!<>-_\\/[]{}—=+*^?#";

// Título que embaralha os caracteres próximos do cursor (efeito
// "scrambled text"): cada letra dentro do raio troca por glifos
// aleatórios por um curto período e volta ao original.
export default function ScrambleText({
  text,
  className = "",
  radius = 80,
  duration = 600,
  tick = 45,
  chars = DEFAULT_CHARS,
}: {
  text: string;
  className?: string;
  radius?: number;
  duration?: number; // ms que cada letra permanece embaralhada
  tick?: number; // intervalo entre trocas de glifo
  chars?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!hasFinePointer() || prefersReducedMotion()) return;

    const spans = Array.from(el.querySelectorAll<HTMLElement>(".scr-char"));
    const activeUntil = new Map<number, number>();
    let interval = 0;
    let lastSwap = 0;

    const loop = () => {
      const now = performance.now();
      if (activeUntil.size === 0) {
        window.clearInterval(interval);
        interval = 0;
        return;
      }
      const swap = now - lastSwap >= tick;
      if (swap) lastSwap = now;
      for (const [i, until] of activeUntil) {
        const span = spans[i];
        if (now >= until) {
          span.textContent = span.dataset.orig ?? "";
          activeUntil.delete(i);
        } else if (swap) {
          span.textContent = chars[Math.floor(Math.random() * chars.length)];
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      for (let i = 0; i < spans.length; i++) {
        const span = spans[i];
        if (span.dataset.orig === " ") continue;
        const r = span.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        if (dx * dx + dy * dy < radius * radius) {
          activeUntil.set(i, performance.now() + duration);
          if (!interval) {
            lastSwap = 0;
            interval = window.setInterval(loop, tick / 2);
          }
        }
      }
    };

    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      window.clearInterval(interval);
      spans.forEach((s) => (s.textContent = s.dataset.orig ?? ""));
    };
  }, [radius, duration, tick, chars]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split("").map((c, i) => (
        <span key={i} aria-hidden className="scr-char" data-orig={c}>
          {c}
        </span>
      ))}
    </span>
  );
}
