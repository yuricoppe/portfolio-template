"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { isVideoUrl } from "@/components/ParallaxMedia";
import WeightText from "@/components/WeightText";
import { prefersReducedMotion, useRafScroll } from "@/lib/motion";
import type { Project } from "@/lib/types";

// Showcase dos projetos com "scroll transition" de máscara SVG
// (Codrops/Hiro-kiii, variação Column Grid): o palco alto mantém um
// viewport sticky onde cada projeto é uma camada fullscreen mascarada
// por uma grade de células que abre coluna a coluna (esquerda →
// direita, ordem vertical aleatória) conforme o scroll, revelando a
// camada sobre a anterior. Textos entram/saem por clip-path e uma
// barra segmentada mostra o progresso.
//
// A grade vive em <mask> SVG (userSpaceOnUse, coordenadas em px do
// viewport) aplicada à camada HTML via CSS `mask` — assim a camada
// pode ter gradiente de fundo e <img>/<video> normais. Os estados
// animados são gated por html.js em globals.css; sem JS ou com
// prefers-reduced-motion vale o fallback empilhado (.stx-fallback).

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));
const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// scroll dedicado a cada projeto dentro do palco
const VH_PER_PROJECT = 120;
// fração do segmento em que a grade termina de abrir
const SWEEP_END = 0.55;
// fração do sweep gasta escalonando o início das células; o restante
// é a duração do fade de cada célula (equivale ao stagger do demo)
const STAGGER_SPREAD = 0.7;
// janelas (em fração do segmento) da entrada e saída do texto
const TEXT_IN: readonly [number, number] = [0.08, 0.5];
const TEXT_OUT: readonly [number, number] = [0.82, 1];

// mesma responsividade do demo: menos colunas em telas estreitas
function gridCols() {
  if (window.innerWidth <= 599) return 6;
  if (window.innerWidth <= 1024) return 10;
  return 14;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Cell {
  el: SVGRectElement;
  order: number; // 0..1, posição na varredura coluna a coluna
}

const SVG_NS = "http://www.w3.org/2000/svg";

export default function ProjectScrollTransition({
  projects,
  labelViewCase,
}: {
  projects: Project[];
  labelViewCase: string;
}) {
  const stageRef = useRef<HTMLElement>(null);
  const baseRefs = useRef<(SVGRectElement | null)[]>([]);
  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const txtRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cellsRef = useRef<Cell[][]>([]);

  // (re)constrói as grades de células em px do viewport
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const build = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cols = gridCols();
      const rows = Math.max(1, Math.round(cols * (h / w)));
      const cellW = w / cols;
      const cellH = h / rows;
      const total = cols * rows;

      cellsRef.current = groupRefs.current.map((g, i) => {
        baseRefs.current[i]?.setAttribute("width", String(w));
        baseRefs.current[i]?.setAttribute("height", String(h));
        if (!g) return [];
        g.innerHTML = "";

        const cells: Cell[] = [];
        let orderIdx = 0;
        for (let x = 0; x < cols; x++) {
          // colunas em ordem, linhas embaralhadas dentro da coluna
          const ys = shuffle(Array.from({ length: rows }, (_, y) => y));
          for (const y of ys) {
            const rect = document.createElementNS(SVG_NS, "rect");
            rect.setAttribute("x", String(x * cellW));
            rect.setAttribute("y", String(y * cellH));
            rect.setAttribute("width", String(cellW));
            rect.setAttribute("height", String(cellH));
            rect.setAttribute("fill", "#fff");
            rect.setAttribute("shape-rendering", "crispEdges");
            rect.setAttribute("opacity", "0");
            g.appendChild(rect);
            cells.push({
              el: rect,
              order: total > 1 ? orderIdx / (total - 1) : 0,
            });
            orderIdx++;
          }
        }
        return cells;
      });
    };

    build();
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(build, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
    };
  }, []);

  // scrub: mapeia o progresso do palco para células, textos e barra
  useRafScroll(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    if (scrollable <= 0) return;
    const progress = clamp01(-rect.top / scrollable);
    const n = projects.length;

    for (let i = 0; i < n; i++) {
      // fração do segmento do projeto i já percorrida
      const t = clamp01(progress * n - i);

      const sweep = clamp01(t / SWEEP_END);
      const cells = cellsRef.current[i];
      if (cells) {
        for (const cell of cells) {
          const ct = clamp01(
            (sweep - cell.order * STAGGER_SPREAD) / (1 - STAGGER_SPREAD),
          );
          const op = easeOutCubic(ct).toFixed(3);
          if (cell.el.getAttribute("opacity") !== op) {
            cell.el.setAttribute("opacity", op);
          }
        }
      }

      // texto entra de baixo (clip do topo + translateY) e sai por
      // baixo (clip de baixo); clip-path também corta o hit-test, então
      // os links de blocos ocultos não roubam clique dos visíveis
      const txt = txtRefs.current[i];
      if (txt) {
        const tin = easeOutExpo(
          clamp01((t - TEXT_IN[0]) / (TEXT_IN[1] - TEXT_IN[0])),
        );
        const tout = easeInOutQuad(
          clamp01((t - TEXT_OUT[0]) / (TEXT_OUT[1] - TEXT_OUT[0])),
        );
        txt.style.clipPath = `inset(${(1 - tin) * 100}% 0% ${tout * 100}% 0%)`;
        txt.style.transform = `translateY(${(1 - tin) * 40}px)`;
      }

      const fill = fillRefs.current[i];
      if (fill) {
        fill.style.width = `${clamp01((progress - i / n) * n) * 100}%`;
      }
    }
  });

  const media = (p: Project, eager: boolean) =>
    p.coverUrl &&
    (isVideoUrl(p.coverUrl) ? (
      <video
        src={p.coverUrl}
        autoPlay
        muted
        loop
        playsInline
        preload={eager ? "metadata" : "none"}
        className="absolute inset-0 h-full w-full object-cover"
      />
    ) : (
      <img
        src={p.coverUrl}
        alt=""
        loading={eager ? undefined : "lazy"}
        className="absolute inset-0 h-full w-full object-cover"
      />
    ));

  return (
    <>
      <section
        ref={stageRef}
        className="stx-stage relative"
        style={{ height: `${projects.length * VH_PER_PROJECT + 100}vh` }}
      >
        {/* marcadores invisíveis no início do segmento de cada projeto,
            para o table of contents da scrollbar */}
        {projects.map((p, i) => (
          <div
            key={p.slug}
            data-toc={p.title}
            aria-hidden
            className="absolute h-px w-px"
            style={{ top: `${i * VH_PER_PROJECT}vh` }}
          />
        ))}

        <div className="sticky top-0 h-screen overflow-hidden">
          {/* máscaras (as células são criadas via JS no build da grade) */}
          <svg aria-hidden className="absolute h-0 w-0">
            <defs>
              {/* sem maskUnits="userSpaceOnUse": no Chromium a região
                  default (-10%..120%) em user units quebra quando o
                  mask é referenciado via CSS de um elemento HTML e a
                  camada some; com objectBoundingBox (default) a região
                  segue o box da camada e o conteúdo continua em px */}
              {projects.map((p, i) => (
                <mask key={p.slug} id={`stx-mask-${i}`}>
                  <rect
                    ref={(el) => {
                      baseRefs.current[i] = el;
                    }}
                    x="0"
                    y="0"
                    width="0"
                    height="0"
                    fill="#000"
                  />
                  <g
                    ref={(el) => {
                      groupRefs.current[i] = el;
                    }}
                  />
                </mask>
              ))}
            </defs>
          </svg>

          {projects.map((p, i) => (
            <div
              key={p.slug}
              className="stx-layer absolute inset-0"
              style={
                {
                  background: p.gradient,
                  "--stx-mask": `url(#stx-mask-${i})`,
                } as React.CSSProperties
              }
            >
              {media(p, true)}
            </div>
          ))}

          {projects.map((p, i) => (
            <div
              key={p.slug}
              ref={(el) => {
                txtRefs.current[i] = el;
              }}
              className="stx-txt pointer-events-none absolute inset-0 flex flex-col items-start justify-center px-page text-white"
            >
              <div className="text-[15px] text-white/60">
                {String(i + 1).padStart(2, "0")}
              </div>
              <Link
                href={`/projetos/${p.slug}`}
                className="pointer-events-auto mt-4 block"
              >
                <div className="type-display text-3xl tracking-tight md:text-[56px]">
                  <WeightText text={p.title} />
                </div>
                <div className="mt-1.5 text-[15px] text-white/60">
                  {p.category} · {p.year}
                </div>
              </Link>
              <Link
                href={`/projetos/${p.slug}`}
                className="glow-border glow-border--dark btn-elastic type-display pointer-events-auto mt-8 inline-flex h-14 items-center rounded-[12px] bg-white px-8 text-[20px] font-medium text-[#0a0a0a] hover:bg-[#e6e6e6]"
              >
                {labelViewCase}
              </Link>
            </div>
          ))}

          {/* barra de progresso segmentada (um segmento por projeto) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex gap-2 px-page pb-10">
            {projects.map((p, i) => (
              <div
                key={p.slug}
                className="relative h-[2px] flex-1 overflow-hidden bg-white/20"
              >
                <div
                  ref={(el) => {
                    fillRefs.current[i] = el;
                  }}
                  className="absolute inset-y-0 left-0 w-0 bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* fallback sem JS / prefers-reduced-motion: cards empilhados */}
      <div className="stx-fallback">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projetos/${p.slug}`}
            className={`relative block min-h-[500px] overflow-hidden text-white md:min-h-[620px] ${
              i < projects.length - 1 ? "mb-2" : ""
            }`}
            style={{ height: "82vh", background: p.gradient }}
          >
            {media(p, false)}
            <div className="absolute left-5 top-10 text-[15px] text-white/60 md:left-11">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="absolute inset-0 flex flex-col items-start justify-center px-5 md:px-11">
              <div>
                <div className="type-display text-2xl tracking-tight md:text-[32px]">
                  {p.title}
                </div>
                <div className="mt-1.5 text-[15px] text-white/60">
                  {p.category} · {p.year}
                </div>
              </div>
              <div className="type-display mt-8 inline-flex h-14 items-center rounded-[12px] bg-white px-8 text-[20px] font-medium text-[#0a0a0a]">
                {labelViewCase}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
