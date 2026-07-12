import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getGlobal, getHomePage, getProjects } from "@/lib/api";
import type { Project } from "@/lib/types";

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
      {/* Hero */}
      <div
        className="relative min-h-[560px] overflow-hidden md:min-h-[720px]"
        style={{
          height: "92vh",
          background:
            "radial-gradient(120% 90% at 65% 30%, #3d43b8 0%, #23255e 45%, #0b0b16 100%)",
        }}
      >
        <img
          src="/img/hero.svg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <Header overlay siteName={global.siteName} />
        <div className="absolute bottom-10 left-5 max-w-[80%] text-2xl font-medium tracking-tight md:left-11 md:text-[32px]">
          {home.heroTitle}
        </div>
        <div className="absolute bottom-10 right-5 text-xl md:right-11">↓</div>
      </div>

      {/* Statement + sticky featured cases */}
      <div className="box-border">
        <div className="sticky top-0 px-page pb-24 pt-24 md:pb-[120px] md:pt-[130px]">
          <h1 className="max-w-[1000px] text-3xl font-medium leading-[1.18] tracking-tight md:text-[56px]">
            {home.statementLead}
            <br />
            <span className="text-muted">{home.statementMuted}</span>
          </h1>
        </div>
        {featured.map((p) => (
          <FeaturedCard key={p.slug} project={p} />
        ))}
      </div>

      {/* Secondary grid */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {secondary.map((p) => (
          <Link
            key={p.slug}
            href={`/projetos/${p.slug}`}
            className="relative block h-[420px] text-white md:h-[560px]"
            style={{ background: p.gradient }}
          >
            {p.coverUrl && (
              <img
                src={p.coverUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute bottom-8 left-5 md:left-9">
              <div className="text-3xl font-medium md:text-5xl">{p.title}</div>
              <div className="mt-1.5 text-sm text-white/60">{p.category}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center px-page pt-14">
        <Link
          href="/projetos"
          className="rounded-[10px] bg-white/10 px-7 py-3.5 text-[15px] text-white transition-colors hover:bg-white/20"
        >
          Ver todos os projetos
        </Link>
      </div>

      {/* Services */}
      <div className="grid grid-cols-1 gap-10 px-page py-24 md:grid-cols-2 md:gap-[60px] md:py-[150px]">
        <h2 className="text-3xl font-medium leading-[1.2] tracking-tight md:text-[40px]">
          {home.servicesLead}
          <br />
          <span className="text-muted">{home.servicesMuted}</span>
        </h2>
        <div className="flex flex-col text-lg md:text-[19px]">
          {home.services.map((s, i) => (
            <div
              key={s.title}
              className={`flex items-center justify-between py-6 ${
                i < home.services.length - 1 ? "border-b border-[#222]" : ""
              }`}
            >
              <span>{s.title}</span>
              <span className="text-[#666]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Footer global={global} />
    </div>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projetos/${project.slug}`}
      className="sticky top-0 mb-2 block min-h-[500px] overflow-hidden text-white md:min-h-[600px]"
      style={{ height: "80vh", background: project.gradient }}
    >
      {project.coverUrl && (
        <img
          src={project.coverUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute bottom-9 left-5 md:left-11">
        <div className="text-4xl font-medium tracking-tight md:text-[64px]">
          {project.title}
        </div>
        <div className="mt-1.5 text-[15px] text-white/60">
          {project.category}
        </div>
      </div>
      <div className="absolute bottom-9 right-5 hidden rounded-[10px] bg-white/14 px-6 py-3 text-sm backdrop-blur-md sm:block md:right-11">
        Ver case
      </div>
    </Link>
  );
}
