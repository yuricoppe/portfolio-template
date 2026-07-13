// Indicador de scroll do hero: pill com contorno que se desenha
// (stroke reveal) e seta cuja linha desenha, segura e se desfaz em
// loop — as animações de dashoffset ficam em globals.css.
export default function ScrollCue() {
  return (
    <svg
      width="36"
      height="60"
      viewBox="0 0 36 60"
      fill="none"
      aria-hidden
      className="block"
    >
      <rect
        x="1"
        y="1"
        width="34"
        height="58"
        rx="17"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.5"
        pathLength={1}
        className="cue-pill"
      />
      <path
        d="M18 17v22m-6.5-7.5L18 39l6.5-7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="cue-arrow"
      />
    </svg>
  );
}
