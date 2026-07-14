import Link from "next/link";
import BlurText from "@/components/BlurText";
import Footer from "@/components/Footer";
import FooterBlur from "@/components/FooterBlur";
import Header from "@/components/Header";
import ParallaxMedia from "@/components/ParallaxMedia";
import WeightText from "@/components/WeightText";
import { getGlobal, getProjects } from "@/lib/api";

export const metadata = {
  title: "Projetos — Colativo",
};

export default async function Projetos() {
  const [global, projects] = await Promise.all([getGlobal(), getProjects()]);

  return (
    <div className="bg-ink text-white">
      <Header siteName={global.siteName} />

      {/* conteúdo acima do footer sticky (reveal no fim do scroll) */}
      <div className="relative z-10 bg-ink">
      <div className="box-border">
        <div className="sticky top-0 px-page pb-16 pt-32 md:pb-[90px] md:pt-[170px]">
          <h1 className="max-w-[1000px] text-3xl font-medium leading-[1.18] tracking-tight md:text-[56px]">
            <BlurText text={global.projectsTitleLead} stagger={90} />{" "}
            <BlurText
              text={global.projectsTitleMuted}
              delay={200}
              stagger={35}
              className="text-muted"
            />
          </h1>
        </div>

        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projetos/${p.slug}`}
            className={`group sticky top-0 block min-h-[500px] overflow-hidden text-white md:min-h-[620px] ${
              i < projects.length - 1 ? "mb-2" : ""
            }`}
            style={{ height: "82vh", background: p.gradient }}
          >
            {p.coverUrl && <ParallaxMedia src={p.coverUrl} strength={5} />}
            <div className="absolute left-5 top-10 text-[15px] text-white/60 md:left-11">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="absolute inset-0 flex flex-col items-start justify-center px-5 md:px-11">
              <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <div className="type-display text-2xl tracking-tight md:text-[32px]">
                  <WeightText text={p.title} />
                </div>
                <div className="mt-1.5 text-[15px] text-white/60">
                  {p.category} · {p.year}
                </div>
              </div>
              <div className="glow-border glow-border--dark btn-elastic type-display mt-8 inline-flex h-14 items-center rounded-[12px] bg-white px-8 text-[20px] font-medium text-[#0a0a0a] group-hover:bg-[#e6e6e6]">
                {global.labelViewCase}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <FooterBlur />
      </div>

      <Footer global={global} />
    </div>
  );
}
