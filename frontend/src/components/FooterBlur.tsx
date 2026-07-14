import GradualBlur from "@/components/GradualBlur";

// Faixa de gradual blur pendurada sob a borda inferior do conteúdo
// (top-full no wrapper relative z-10 das páginas): conforme o scroll
// revela o footer sticky, a área logo abaixo do conteúdo aparece
// desfocada e dissolve para nítido — o reveal acontece "através" do
// blur. Deve ser o último filho do wrapper de conteúdo.
export default function FooterBlur() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-full z-10 h-[140px]"
    >
      <GradualBlur position="top" height={140} />
    </div>
  );
}
