"use client";

import { useInView } from "@/lib/motion";
import { scrambleChars, useScramble } from "@/components/ScrambleText";

// Título que entra palavra por palavra: blur -> nítido, com stagger.
// O estado escondido só existe quando o JS está ativo (html.js no CSS),
// então o texto permanece visível em SSR sem JavaScript.
// As letras também reagem ao cursor com o efeito de scramble.
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
  useScramble(ref);
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
          {scrambleChars(w)}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
