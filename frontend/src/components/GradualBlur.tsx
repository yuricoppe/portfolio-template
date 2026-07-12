// Faixa de desfoque progressivo na borda de uma seção (efeito
// "gradual blur"): camadas empilhadas de backdrop-filter com máscaras
// de gradiente, cada uma mais intensa que a anterior.
export default function GradualBlur({
  position = "bottom",
  height = 120,
}: {
  position?: "top" | "bottom";
  height?: number;
}) {
  const layers = [0.5, 1.5, 3.5, 7];
  const isBottom = position === "bottom";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 z-10 ${
        isBottom ? "bottom-0" : "top-0"
      }`}
      style={{ height }}
    >
      {layers.map((blur, i) => {
        // cada camada cobre uma fatia mais próxima da borda
        const start = (i / layers.length) * 100;
        const gradient = isBottom
          ? `linear-gradient(to bottom, transparent ${start}%, black ${start + 22}%, black 100%)`
          : `linear-gradient(to top, transparent ${start}%, black ${start + 22}%, black 100%)`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: gradient,
              WebkitMaskImage: gradient,
            }}
          />
        );
      })}
    </div>
  );
}
