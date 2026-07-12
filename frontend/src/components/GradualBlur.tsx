// Faixa de desfoque progressivo na borda de uma seção (efeito
// "gradual blur"): uma única camada de backdrop-filter com máscara de
// gradiente — o desfoque cresce em direção à borda sem empilhar
// camadas (que compõem entre si e são caras/instáveis no Safari).
export default function GradualBlur({
  position = "bottom",
  height = 120,
}: {
  position?: "top" | "bottom";
  height?: number;
}) {
  const isBottom = position === "bottom";
  const gradient = isBottom
    ? "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 45%, black 100%)"
    : "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.5) 45%, black 100%)";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 z-10 ${
        isBottom ? "bottom-0" : "top-0"
      }`}
      style={{
        height,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        maskImage: gradient,
        WebkitMaskImage: gradient,
      }}
    />
  );
}
