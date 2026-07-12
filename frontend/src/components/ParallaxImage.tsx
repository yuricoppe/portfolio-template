"use client";

import { useRef } from "react";
import { useRafScroll } from "@/lib/motion";

// Imagem de preenchimento com parallax sutil: a imagem é levemente
// ampliada e desliza conforme o bloco atravessa o viewport.
export default function ParallaxImage({
  src,
  alt = "",
  strength = 6,
  className = "",
}: {
  src: string;
  alt?: string;
  strength?: number; // deslocamento máximo, em % da altura
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useRafScroll(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.bottom < 0 || rect.top > vh) return;
    // progresso de -1 (entrando por baixo) a 1 (saindo por cima)
    const progress =
      (rect.top + rect.height / 2 - vh / 2) / ((vh + rect.height) / 2);
    const shift = -progress * strength;
    img.style.transform = `translate3d(0, ${shift}%, 0) scale(${1 + strength / 45})`;
  });

  return (
    <div
      ref={wrapRef}
      className={`absolute inset-0 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.03] ${className}`}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />
    </div>
  );
}
