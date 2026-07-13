// Faixa de desfoque progressivo na borda de uma seção (efeito
// "gradual blur", como no ReactBits): várias camadas de
// backdrop-filter empilhadas, cada uma cobrindo uma fatia da faixa
// com blur crescente (exponencial) em direção à borda — é a
// sobreposição das fatias que cria a progressão suave do desfoque.
export default function GradualBlur({
  position = "bottom",
  height = 120,
  strength = 2,
  divCount = 5,
  exponential = true,
}: {
  position?: "top" | "bottom";
  height?: number;
  strength?: number; // blur base em px da primeira camada
  divCount?: number; // número de camadas
  exponential?: boolean; // blur dobra a cada camada (senão, linear)
}) {
  const isBottom = position === "bottom";
  // 0% = borda interna (transparente), 100% = borda da seção (blur máximo)
  const dir = isBottom ? "to bottom" : "to top";
  const step = 100 / divCount;

  const layers = Array.from({ length: divCount }, (_, i) => {
    const blur = exponential ? strength * 2 ** i : strength * (i + 1);
    const start = i * step;
    const rampIn = Math.max(0, start - step);
    const mask =
      i === divCount - 1
        ? // última camada segue opaca até a borda
          `linear-gradient(${dir}, transparent ${rampIn}%, black ${start}%, black 100%)`
        : `linear-gradient(${dir}, transparent ${rampIn}%, black ${start}%, black ${Math.min(
            100,
            start + step,
          )}%, transparent ${Math.min(100, start + 2 * step)}%)`;
    return { blur, mask };
  });

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 z-10 ${
        isBottom ? "bottom-0" : "top-0"
      }`}
      style={{ height }}
    >
      {layers.map(({ blur, mask }, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      ))}
    </div>
  );
}
