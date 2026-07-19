import BlurText from "@/components/BlurText";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProjectScrollTransition from "@/components/ProjectScrollTransition";
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

        {/* showcase com scroll transition de máscara SVG (substitui os
            cards sticky); as camadas abrem por cima do título sticky */}
        <ProjectScrollTransition
          projects={projects}
          labelViewCase={global.labelViewCase}
        />
      </div>
      </div>

      <Footer global={global} />
    </div>
  );
}
