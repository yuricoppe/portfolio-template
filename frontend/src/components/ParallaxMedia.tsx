"use client";

import { useRef } from "react";
import { useRafScroll } from "@/lib/motion";

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;

export function isVideoUrl(url: string): boolean {
  return VIDEO_EXTENSIONS.test(url);
}

// Mídia de preenchimento (imagem ou vídeo) com parallax sutil: o
// conteúdo é levemente ampliado e desliza conforme o bloco atravessa
// o viewport. Vídeos tocam em loop, sem som e inline (autoplay móvel).
export default function ParallaxMedia({
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
  const mediaRef = useRef<HTMLElement>(null);

  useRafScroll(() => {
    const wrap = wrapRef.current;
    const media = mediaRef.current;
    if (!wrap || !media) return;
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.bottom < 0 || rect.top > vh) return;
    // progresso de -1 (entrando por baixo) a 1 (saindo por cima)
    const progress =
      (rect.top + rect.height / 2 - vh / 2) / ((vh + rect.height) / 2);
    const shift = -progress * strength;
    media.style.transform = `translate3d(0, ${shift}%, 0) scale(${1 + strength / 45})`;
  });

  const mediaClass =
    "absolute inset-0 h-full w-full object-cover will-change-transform";

  return (
    <div
      ref={wrapRef}
      className={`absolute inset-0 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.03] ${className}`}
    >
      {isVideoUrl(src) ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt || undefined}
          className={mediaClass}
        />
      ) : (
        <img
          ref={mediaRef as React.RefObject<HTMLImageElement>}
          src={src}
          alt={alt}
          className={mediaClass}
        />
      )}
    </div>
  );
}
