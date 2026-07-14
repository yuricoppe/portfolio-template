"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Scroll suave inercial (desktop): intercepta o wheel e anima a
// posição real com lerp em requestAnimationFrame. Como usa
// window.scrollTo de verdade, sticky, IntersectionObserver, parallax
// e a scrollbar customizada continuam funcionando sem adaptação.
// Teclado, touch e navegação por âncora seguem nativos.
export default function SmoothScroll() {
  const pathname = usePathname();
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const stopRef = useRef<(() => void) | null>(null);

  // Troca de rota: para a animação imediatamente, senão o loop cancela
  // o scroll-to-top do Next e arrasta a página nova até o alvo antigo.
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

    // scroll vindo de fora com o loop parado (drag da scrollbar, ToC,
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

    // Navegação interna com a página rolada: sobe suavemente até o
    // topo (ease-in-out, duração proporcional à distância) e só então
    // navega — a View Transition assume dali. preventDefault na fase
    // de captura faz o <Link> do Next ignorar o clique.
    let navRaf = 0;
    const animateToTopThen = (done: () => void) => {
      stopRef.current?.();
      const start = window.scrollY;
      const duration = Math.min(1500, 700 + start * 0.25);
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        window.scrollTo({
          top: start * (1 - easeInOutCubic(t)),
          behavior: "instant",
        });
        if (t < 1) {
          navRaf = requestAnimationFrame(step);
        } else {
          done();
        }
      };
      navRaf = requestAnimationFrame(step);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const t = e.target;
      if (!(t instanceof Element)) return;
      const link = t.closest<HTMLAnchorElement>('a[href^="/"]');
      if (!link || link.target === "_blank") return;
      // links do menu fullscreen navegam direto (o painel cobre a tela)
      if (link.closest("[data-menu-panel]")) return;
      if (window.scrollY < 40) return;
      const href = link.getAttribute("href");
      if (!href) return;
      e.preventDefault();
      animateToTopThen(() => routerRef.current.push(href));
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(navRaf);
    };
  }, []);

  return null;
}
