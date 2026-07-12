"use client";

import { useEffect } from "react";
import { hasFinePointer } from "@/lib/motion";

// Delegação global: atualiza as CSS vars --mx/--my de qualquer elemento
// com a classe .glow-border sob o mouse (efeito "border glow").
export default function GlowTracker() {
  useEffect(() => {
    if (!hasFinePointer()) return;

    const onMove = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>(
        ".glow-border",
      );
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      target.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return null;
}
