"use client";

import { useInView } from "@/lib/motion";
import { weightChars, useWeightHover } from "@/components/WeightText";

// Título que entra palavra por palavra: blur -> nítido, com stagger.
// O estado escondido só existe quando o JS está ativo (html.js no CSS),
// então o texto permanece visível em SSR sem JavaScript.
// As letras também engrossam perto do cursor (eixo wght da Elms Sans).
export default function BlurText({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  stagger = 60,
}: {
  text: string;
  as?: React.ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const [ref, inView] = useInView<HTMLElement>();
  useWeightHover(ref);
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className={`blur-word ${inView ? "blur-word--in" : ""}`}
          style={{ transitionDelay: `${delay + i * stagger}ms` }}
        >
          {weightChars(w)}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
