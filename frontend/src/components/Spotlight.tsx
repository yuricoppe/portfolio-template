"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

// Forma difusa que segue o mouse dentro da seção pai (efeito
// "shape blur"): um brilho radial grande, bem sutil, com blur alto.
// O loop de rAF só roda enquanto o ponteiro está sobre a seção
// (e até o glow convergir depois que ele sai).
export default function Spotlight({
  color = "rgba(120, 130, 255, 0.14)",
  size = 480,
}: {
  color?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (!hasFinePointer() || prefersReducedMotion()) return;

    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let running = false;
    let inside = false;

    const loop = () => {
      cx += (x - cx) * 0.08;
      cy += (y - cy) * 0.08;
      el.style.transform = `translate3d(${cx - size / 2}px, ${cy - size / 2}px, 0)`;
      // fora da seção e já convergiu: para o loop até o próximo mousemove
      if (!inside && Math.abs(x - cx) < 0.5 && Math.abs(y - cy) < 0.5) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      if (!inside) {
        inside = true;
        cx = x;
        cy = y;
        el.style.opacity = "1";
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const onLeave = () => {
      inside = false;
      el.style.opacity = "0";
    };

    parent.addEventListener("mousemove", onMove, { passive: true });
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [size]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-0 rounded-full opacity-0 transition-opacity duration-500"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        filter: "blur(40px)",
      }}
    />
  );
}
