"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { hasFinePointer, useRafScroll } from "@/lib/motion";

interface TocItem {
  label: string;
  // posição do topo da seção como fração da altura total do documento
  fraction: number;
  top: number;
}

// Scrollbar customizada (só desktop/ponteiro fino). A nativa fica
// escondida via CSS (@media pointer:fine), então travar o scroll do
// body ao abrir o menu não causa mais layout drift. Trilho de 8px,
// thumb branco sobre fundo escuro e preto quando o footer claro está
// sob ele. No hover do trilho, mostra um table of contents com as
// seções marcadas com data-toc, proporcional à posição de cada uma.
export default function Scrollbar() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [toc, setToc] = useState<TocItem[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    setEnabled(hasFinePointer());
  }, []);

  // coleta as seções com data-toc (recoleta por rota e quando o
  // documento muda de altura)
  useEffect(() => {
    if (!enabled) return;
    const collect = () => {
      const docH = document.documentElement.scrollHeight;
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
        return {
          label: el.dataset.toc ?? "",
          top,
          fraction: Math.min(0.96, Math.max(0.04, top / docH)),
        };
      });
      setToc(items.filter((i) => i.label));
    };
    collect();
    const ro = new ResizeObserver(collect);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [enabled, pathname]);

  // posição/tamanho do thumb + cor conforme a seção clara + auto-hide
  useRafScroll(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const vh = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    if (docH <= vh) {
      track.style.opacity = "0";
      return;
    }
    const h = Math.max(44, (vh / docH) * vh);
    const y = (window.scrollY / (docH - vh)) * (vh - h);
    thumb.style.height = `${h}px`;
    thumb.style.transform = `translate3d(0, ${y}px, 0)`;

    // thumb escuro quando a seção clara (footer) cobre a faixa do thumb
    const light = document.querySelector("[data-light-section]");
    if (light) {
      const r = light.getBoundingClientRect();
      const overlap =
        Math.min(r.bottom, y + h) - Math.max(r.top, y) > h * 0.5;
      track.classList.toggle("scrollbar--on-light", overlap);
    }

    // aparece ao rolar, some após inatividade (a menos que em hover)
    track.style.opacity = "1";
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (!dragging.current && !track.matches(":hover")) {
        track.style.opacity = "0";
      }
    }, 1400);
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
        window.scrollTo(0, startScroll + dy * ((docH - vh) / (vh - h)));
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
      className="scrollbar-track fixed inset-y-0 right-0 z-[60] w-2 opacity-0 transition-opacity duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        className="scrollbar-thumb absolute right-0 w-2 rounded-full"
      />

      {/* table of contents no hover do trilho */}
      {hovered &&
        toc.map((item) => (
          <button
            key={`${item.label}-${item.fraction}`}
            type="button"
            onClick={() =>
              window.scrollTo({ top: item.top - 80, behavior: "smooth" })
            }
            className="scrollbar-toc absolute right-4 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs"
            style={{ top: `${item.fraction * 100}%` }}
          >
            {item.label}
          </button>
        ))}
    </div>
  );
}
