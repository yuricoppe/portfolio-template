"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

// Scroll suave inercial (desktop): intercepta o wheel e anima a
// posição real com lerp em requestAnimationFrame. Como usa
// window.scrollTo de verdade, sticky, IntersectionObserver, parallax
// e a scrollbar customizada continuam funcionando sem adaptação.
// Teclado, touch e navegação por âncora seguem nativos.
//
// A navegação entre páginas (incluindo a subida ao topo) é comandada
// pelo PageTransition, que cobre a tela com quadrados pretos antes de
// trocar a rota — por isso aqui não há mais interceptação de cliques.
export default function SmoothScroll() {
  const pathname = usePathname();
  const stopRef = useRef<(() => void) | null>(null);

  // Troca de rota: para a animação imediatamente, senão o loop cancela
  // o scroll-to-top do Next e arrasta a página nova.
  useEffect(() => {
    stopRef.current?.();
  }, [pathname]);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;

    let target = window.scrollY;
    let raf = 0;
    let animating = false;
    let lastSet = -1;

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    const loop = () => {
      const current = window.scrollY;
      // alguém moveu o scroll desde o último frame (scrollTo externo,
      // âncora, teclado): cede e re-sincroniza — checagem síncrona,
      // eventos de scroll chegam tarde demais para isso
      if (lastSet >= 0 && Math.abs(current - lastSet) > 1.5) {
        animating = false;
        lastSet = -1;
        target = current;
        return;
      }
      const diff = target - current;
      if (Math.abs(diff) < 0.5) {
        animating = false;
        lastSet = -1;
        return;
      }
      lastSet = current + diff * 0.12;
      // "instant" ignora o scroll-behavior: smooth do CSS — sem isso o
      // browser anima cada passo do lerp e o loop briga com ele
      window.scrollTo({ top: lastSet, behavior: "instant" });
      raf = requestAnimationFrame(loop);
    };

    const onWheel = (e: WheelEvent) => {
      // pinch-zoom, menu aberto (scroll travado) ou áreas com scroll
      // próprio ficam com o comportamento nativo
      if (e.ctrlKey) return;
      if (document.documentElement.style.overflow === "hidden") return;
      const t = e.target;
      if (
        t instanceof Element &&
        t.closest("textarea, [data-native-scroll]")
      ) {
        return;
      }
      e.preventDefault();
      // normaliza deltas por linha/página para pixels
      const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY * scale));
      if (!animating) {
        animating = true;
        lastSet = -1;
        raf = requestAnimationFrame(loop);
      }
    };

    // scroll vindo de fora com o loop parado (drag da scrollbar,
    // teclado, âncoras): re-sincroniza o alvo para não puxar de volta
    const onScroll = () => {
      if (!animating) target = window.scrollY;
    };

    stopRef.current = () => {
      cancelAnimationFrame(raf);
      animating = false;
      lastSet = -1;
      target = window.scrollY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
