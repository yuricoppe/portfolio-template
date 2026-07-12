"use client";

import { useEffect, useRef, useState } from "react";

// Utilitários compartilhados de animação: capacidades do dispositivo,
// observer de entrada no viewport e scroll com throttle de rAF.
// Toda nova animação deve consumir estes helpers em vez de duplicá-los.

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function hasFinePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches
  );
}

// Threshold/rootMargin únicos para todos os reveals one-shot,
// para que o timing seja consistente entre componentes.
const IN_VIEW_OPTIONS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: "0px 0px -8% 0px",
};

export function useInView<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  boolean,
] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, IN_VIEW_OPTIONS);
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView];
}

// Executa `update` com throttle de requestAnimationFrame em scroll e
// resize (e uma vez no mount). Não roda com prefers-reduced-motion.
export function useRafScroll(update: () => void) {
  const updateRef = useRef(update);
  updateRef.current = update;

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let raf = 0;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(() => {
          ticking = false;
          updateRef.current();
        });
      }
    };

    updateRef.current();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
}
