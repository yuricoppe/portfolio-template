import Link from "next/link";
import BlurText from "@/components/BlurText";
import Footer from "@/components/Footer";
import FooterBlur from "@/components/FooterBlur";
import GradualBlur from "@/components/GradualBlur";
import Header from "@/components/Header";
import ParallaxMedia from "@/components/ParallaxMedia";
import Reveal from "@/components/Reveal";
import ScrollCue from "@/components/ScrollCue";
import WeightText from "@/components/WeightText";
import ScrollRevealText from "@/components/ScrollRevealText";
import { getGlobal, getHomePage, getProjects } from "@/lib/api";
import type { Global, Project } from "@/lib/types";

export default async function Home() {
  const [home, global, projects] = await Promise.all([
    getHomePage(),
    getGlobal(),
    getProjects(),
  ]);

  const featured = projects.filter((p) => p.featured);
  const secondary = projects.filter((p) => !p.featured).slice(0, 2);

  return (
    <div className="bg-ink text-white">
      <Header siteName={global.siteName} />

      {/* conteúdo acima do footer sticky (reveal no fim do scroll) */}
      <div className="relative z-10 bg-ink">
      {/* Hero (wrapper sem overflow para a seta atravessar a divisa) */}
      <div className="relative" data-toc="Início">
        <div
          className="relative min-h-[560px] overflow-hidden md:min-h-[720px]"
          style={{ height: "92vh", background: home.heroGradient }}
        >
          {(home.heroVideoUrl || home.heroImageUrl) && (
            <ParallaxMedia
              src={home.heroVideoUrl || home.heroImageUrl}
              strength={4}
            />
          )}
          <div className="type-display absolute bottom-10 left-5 z-20 max-w-[80%] text-2xl tracking-tight md:left-11 md:text-[32px]">
            <BlurText text={home.heroTitle} delay={200} stagger={80} />
          </div>
          <GradualBlur position="bottom" height={110} />
        </div>
        {/* seta de scroll centrada na divisa entre o hero e a próxima
            seção, com pill de fundo na cor da seção de baixo */}
        <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-1/2 rounded-full bg-ink p-2 text-white">
          <ScrollCue />
        </div>
      </div>

      {/* Statement + sticky featured cases */}
      <div className="box-border" data-toc="Cases">
        <div className="sticky top-0 px-page pb-24 pt-24 md:pb-[120px] md:pt-[130px]">
          <ScrollRevealText
            as="h1"
            lead={home.statementLead}
            muted={home.statementMuted}
            breakAfterLead
            className="max-w-[1000px] text-3xl font-medium leading-[1.18] tracking-tight md:text-[56px]"
          />
        </div>
        {featured.map((p) => (
          <FeaturedCard key={p.slug} project={p} global={global} />
        ))}
      </div>

      {/* Secondary grid */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {secondary.map((p) => (
          <Link
            key={p.slug}
            href={`/projetos/${p.slug}`}
            className="group relative block h-[420px] overflow-hidden text-white md:h-[560px]"
            style={{ background: p.gradient }}
          >
            {p.coverUrl && <ParallaxMedia src={p.coverUrl} strength={5} />}
            <div className="absolute inset-0 flex flex-col items-start justify-center px-5 transition-transform duration-500 ease-out group-hover:-translate-y-1 md:px-9">
              <div className="type-display text-3xl md:text-5xl">
                <WeightText text={p.title} />
              </div>
              <div className="mt-1.5 text-sm text-white/60">{p.category}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center px-page pt-14">
        <Link
          href="/projetos"
          className="glow-border btn-elastic type-display inline-flex h-14 items-center rounded-[12px] bg-white px-9 text-[20px] font-medium text-[#0a0a0a] hover:bg-[#e6e6e6]"
        >
          {global.labelViewAll}
        </Link>
      </div>

      {/* Services */}
      <div
        data-toc="Serviços"
        className="grid grid-cols-1 gap-10 px-page py-24 md:grid-cols-2 md:gap-[60px] md:py-[150px]"
      >
        <Reveal>
          <h2 className="text-3xl font-medium leading-[1.2] tracking-tight md:text-[40px]">
            <WeightText text={home.servicesLead} />
            <br />
            <span className="text-muted">
              <WeightText text={home.servicesMuted} />
            </span>
          </h2>
        </Reveal>
        <div className="flex flex-col text-lg md:text-[19px]">
          {home.services.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <div
                className={`service-row flex items-center justify-between py-6 ${i < home.services.length - 1 ? "border-b border-[#222]" : ""
                  }`}
              >
                <span className="type-display flex items-center gap-3 font-medium">
                  <span className="service-arrow text-muted">→</span>
                  <WeightText text={s.title} />
                </span>
                <span className="text-[#666]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <FooterBlur />
      </div>

      <Footer global={global} />
    </div>
  );
}

function FeaturedCard({
  project,
  global,
}: {
  project: Project;
  global: Global;
}) {
  return (
    <Link
      href={`/projetos/${project.slug}`}
      className="group sticky top-0 mb-2 block min-h-[500px] overflow-hidden text-white md:min-h-[600px]"
      style={{ height: "80vh", background: project.gradient }}
    >
      {project.coverUrl && <ParallaxMedia src={project.coverUrl} strength={5} />}
      <div className="absolute inset-0 flex flex-col items-start justify-center px-5 md:px-11">
        <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1">
          <div className="type-display text-4xl tracking-tight md:text-[64px]">
            <WeightText text={project.title} />
          </div>
          <div className="mt-1.5 text-[15px] text-white/60">
            {project.category}
          </div>
        </div>
        <div className="glow-border glow-border--dark btn-elastic type-display mt-8 inline-flex h-14 items-center rounded-[12px] bg-white px-8 text-[20px] font-medium text-[#0a0a0a] group-hover:bg-[#e6e6e6]">
          {global.labelViewCase}
        </div>
      </div>
    </Link>
  );
}
