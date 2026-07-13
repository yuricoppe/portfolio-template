import BlurText from "@/components/BlurText";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ParallaxMedia from "@/components/ParallaxMedia";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import ScrollRevealText from "@/components/ScrollRevealText";
import { getAboutPage, getGlobal } from "@/lib/api";

export const metadata = {
  title: "Quem somos — Colativo",
};

export default async function QuemSomos() {
  const [global, about] = await Promise.all([getGlobal(), getAboutPage()]);

  return (
    <div className="bg-ink text-white">
      <Header siteName={global.siteName} />

      {/* conteúdo acima do footer sticky (reveal no fim do scroll) */}
      <div className="relative z-10 bg-ink">
      <div className="px-page pb-24 pt-32 md:pb-[140px] md:pt-[180px]">
        <h1 className="max-w-[1080px] text-3xl font-medium leading-[1.16] tracking-tight md:text-[60px]">
          <BlurText text={about.titleLead} stagger={90} />{" "}
          <BlurText
            text={about.titleMuted}
            delay={250}
            stagger={26}
            className="text-muted"
          />
        </h1>
      </div>

      {/* Team image */}
      <div
        className="relative min-h-[360px] md:min-h-[520px]"
        style={{
          height: "70vh",
          background:
            "radial-gradient(120% 100% at 50% 20%, #2b2f66 0%, #16182f 55%, #07070d 100%)",
        }}
      >
        {about.teamImageUrl && (
          <ParallaxMedia src={about.teamImageUrl} alt="Equipe Colativo" strength={6} />
        )}
      </div>

      {/* Manifesto */}
      <div className="grid grid-cols-1 gap-12 px-page py-24 md:grid-cols-2 md:gap-20 md:py-[140px]">
        <ScrollRevealText
          lead={about.manifestoLead}
          muted={about.manifestoMuted}
          className="text-3xl font-medium leading-[1.25] tracking-tight md:text-[40px]"
        />
        <div className="flex flex-col gap-7 text-lg leading-[1.65] text-soft md:text-[19px]">
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 110}>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="px-page pb-24 md:pb-[140px]">
        <div className="mb-9 text-sm tracking-[0.08em] text-faint">
          COMO TRABALHAMOS
        </div>
        <div className="flex flex-col">
          {about.steps.map((s, i) => (
            <Reveal key={s.number} delay={i * 100}>
              <div
                className={`group grid grid-cols-1 items-baseline gap-3 border-t border-line py-9 transition-colors duration-500 hover:bg-white/[0.02] md:grid-cols-[80px_320px_1fr] md:gap-10 ${
                  i === about.steps.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <span className="text-[15px] text-[#666] transition-colors duration-500 group-hover:text-white">
                  {s.number}
                </span>
                <span className="text-2xl font-medium tracking-tight md:text-[26px]">
                  <ScrambleText text={s.title} />
                </span>
                <p className="text-[17px] leading-[1.6] text-[#9a9a9a] transition-colors duration-500 group-hover:text-soft">
                  {s.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      </div>

      <Footer global={global} />
    </div>
  );
}
