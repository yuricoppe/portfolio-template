"use client";

import { useEffect, useRef, useState } from "react";
import { hasFinePointer, useRafScroll } from "@/lib/motion";

// Scrollbar customizada (só desktop/ponteiro fino). A nativa fica
// escondida via CSS (@media pointer:fine), então travar o scroll do
// body ao abrir o menu não causa layout drift. O trilho só some quando
// o scroll está no topo; caso contrário fica visível. No hover o thumb
// cresce de 4px para 8px a partir do centro.
export default function Scrollbar() {
  const [enabled, setEnabled] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    setEnabled(hasFinePointer());
  }, []);

  // posição/tamanho do thumb + cor conforme a seção clara
  useRafScroll(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const vh = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    const sy = window.scrollY;
    if (docH <= vh) {
      track.style.opacity = "0";
      return;
    }
    const h = Math.max(44, (vh / docH) * vh);
    const y = (sy / (docH - vh)) * (vh - h);
    thumb.style.height = `${h}px`;
    // -50% no X mantém o thumb centrado no trilho para crescer do centro
    thumb.style.transform = `translate3d(-50%, ${y}px, 0)`;

    // inverte a cor quando a seção clara (footer) está de fato revelada
    // sob o thumb. Usa a borda NATURAL do footer (posição no fluxo),
    // não o rect pinado do sticky — que apareceria cedo demais.
    let onLightThumb = false;
    const light = document.querySelector<HTMLElement>("[data-light-section]");
    if (light && light.parentElement) {
      const pr = light.parentElement.getBoundingClientRect();
      const boundary = pr.bottom - light.offsetHeight; // borda em coords do viewport
      onLightThumb = y + h * 0.5 > boundary;
    }
    track.classList.toggle("scrollbar--on-light", onLightThumb);

    // só some quando está no topo
    track.style.opacity = sy > 4 ? "1" : "0";
  });

  // arrastar o thumb
  useEffect(() => {
    if (!enabled) return;
    const thumb = thumbRef.current;
    if (!thumb) return;

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      const startY = e.clientY;
      const startScroll = window.scrollY;
      const vh = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const h = Math.max(44, (vh / docH) * vh);

      const onMove = (ev: PointerEvent) => {
        const dy = ev.clientY - startY;
        window.scrollTo({
          top: startScroll + dy * ((docH - vh) / (vh - h)),
          // instant: sem isso o scroll-behavior smooth do CSS faz o
          // drag "patinar" atrás do ponteiro
          behavior: "instant",
        });
      };
      const onUp = () => {
        dragging.current = false;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

    thumb.addEventListener("pointerdown", onDown);
    return () => thumb.removeEventListener("pointerdown", onDown);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={trackRef}
      className="scrollbar-track fixed inset-y-0 right-1 z-[60] w-2 opacity-0 transition-opacity duration-300"
      // clique no trilho: pula para a posição proporcional
      onClick={(e) => {
        if (e.target !== trackRef.current) return;
        const vh = window.innerHeight;
        const docH = document.documentElement.scrollHeight;
        window.scrollTo({
          top: (e.clientY / vh) * (docH - vh),
          behavior: "smooth",
        });
      }}
    >
      {/* área de hover mais generosa que os 8px visíveis */}
      <div className="absolute inset-y-0 -left-3 right-0" />

      <div
        ref={thumbRef}
        className="scrollbar-thumb absolute left-1/2 top-0 rounded-full"
      />
    </div>
  );
}
