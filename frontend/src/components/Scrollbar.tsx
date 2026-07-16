"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { hasFinePointer, useRafScroll } from "@/lib/motion";

interface TocItem {
  label: string;
  // posição do topo da seção em coordenadas do documento
  top: number;
}

// Scrollbar customizada (só desktop/ponteiro fino). A nativa fica
// escondida via CSS (@media pointer:fine), então travar o scroll do
// body ao abrir o menu não causa layout drift. O trilho só some quando
// o scroll está no topo; caso contrário fica visível. No hover o thumb
// cresce de 4px para 8px a partir do centro. Ao lado dele, uma pill
// fixa (centralizada na vertical) faz de table of contents: uma bolinha
// por seção marcada com data-toc, que cresce e revela um tooltip no
// hover e destaca a seção ativa.
export default function Scrollbar() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const activeRef = useRef(0);

  useEffect(() => {
    setEnabled(hasFinePointer());
  }, []);

  // coleta as seções com data-toc (recoleta por rota e quando o
  // documento muda de altura)
  useEffect(() => {
    if (!enabled) return;
    const collect = () => {
      const items = Array.from(
        document.querySelectorAll<HTMLElement>("[data-toc]"),
      ).map((el) => {
        let top = el.getBoundingClientRect().top + window.scrollY;
        // elementos sticky (footer) reportam a posição pinada no
        // viewport; usa a posição natural no fim do pai
        if (getComputedStyle(el).position === "sticky" && el.parentElement) {
          const pr = el.parentElement.getBoundingClientRect();
          top = pr.bottom + window.scrollY - el.offsetHeight;
        }
        return { label: el.dataset.toc ?? "", top };
      });
      setToc(items.filter((i) => i.label));
    };
    collect();
    const ro = new ResizeObserver(collect);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [enabled, pathname]);

  // posição/tamanho do thumb + cor conforme a seção clara + seção ativa
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
    // sob o thumb/pill. Usa a borda NATURAL do footer (posição no fluxo),
    // não o rect pinado do sticky — que apareceria cedo demais.
    let onLightThumb = false;
    let onLightPill = false;
    const light = document.querySelector<HTMLElement>("[data-light-section]");
    if (light && light.parentElement) {
      const pr = light.parentElement.getBoundingClientRect();
      const boundary = pr.bottom - light.offsetHeight; // borda em coords do viewport
      onLightThumb = y + h * 0.5 > boundary;
      onLightPill = vh * 0.5 > boundary;
    }
    track.classList.toggle("scrollbar--on-light", onLightThumb);
    pillRef.current?.classList.toggle("scrollbar--on-light", onLightPill);

    // só some quando está no topo
    track.style.opacity = sy > 4 ? "1" : "0";

    // seção ativa: a última cujo topo já passou por ~1/3 do viewport
    let idx = 0;
    for (let i = 0; i < toc.length; i++) {
      if (sy >= toc[i].top - vh * 0.35) idx = i;
    }
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
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
    <>
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

      {/* table of contents: pill com bolinhas, sempre visível */}
      {toc.length > 1 && (
        <div
          ref={pillRef}
          className="scrollbar-pill fixed right-4 top-1/2 z-[60] flex -translate-y-1/2 flex-col items-center gap-1 rounded-full px-1.5 py-2.5"
        >
          {toc.map((item, i) => (
            <button
              key={`${item.label}-${i}`}
              type="button"
              aria-label={item.label}
              onClick={() =>
                window.scrollTo({ top: item.top - 80, behavior: "smooth" })
              }
              className={`scrollbar-dot ${i === active ? "is-active" : ""}`}
            >
              <span className="scrollbar-tip">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
