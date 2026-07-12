import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getGlobal, getProject, getProjects } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project ? `${project.title} — Colativo` : "Projeto — Colativo" };
}

export default async function ProjetoInterna({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [global, projects] = await Promise.all([getGlobal(), getProjects()]);
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  const facts = [
    { label: "Cliente", value: project.client },
    { label: "Ano", value: project.year },
    { label: "Setor", value: project.sector },
    { label: "Escopo", value: project.scope },
  ];

  const [g0, g1, g2, g3] = project.gallery;

  return (
    <div className="bg-ink text-white">
      {/* Hero */}
      <div
        className="relative min-h-[520px] overflow-hidden md:min-h-[680px]"
        style={{ height: "88vh", background: project.gradient }}
      >
        {project.coverUrl && (
          <img
            src={project.coverUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <Header overlay siteName={global.siteName} />
        <div className="absolute bottom-10 left-5 md:left-11">
          <div className="mb-3.5 text-[15px] text-white/65">
            {project.category}
          </div>
          <h1 className="text-5xl font-medium leading-none tracking-tighter md:text-[84px]">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Facts */}
      <div className="grid grid-cols-2 gap-8 border-b border-line px-page py-14 text-[15px] md:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label}>
            <div className="mb-2 text-faint">{f.label}</div>
            <div>{f.value}</div>
          </div>
        ))}
      </div>

      {/* Statement */}
      <div className="px-page py-24 md:py-[130px]">
        <h2 className="max-w-[1050px] text-3xl font-medium leading-[1.25] tracking-tight md:text-[44px]">
          {project.statement}{" "}
          <span className="text-muted">{project.statementMuted}</span>
        </h2>
      </div>

      {/* Full-bleed image 1 */}
      {g0 && <FullBleed image={g0} />}

      {/* Challenge / solution */}
      <div className="grid grid-cols-1 gap-14 px-page py-24 md:grid-cols-2 md:gap-20 md:py-[130px]">
        <div>
          <div className="mb-5 text-sm tracking-[0.08em] text-faint">
            O DESAFIO
          </div>
          <p className="text-lg leading-[1.6] text-soft md:text-[19px]">
            {project.challenge}
          </p>
        </div>
        <div>
          <div className="mb-5 text-sm tracking-[0.08em] text-faint">
            A SOLUÇÃO
          </div>
          <p className="text-lg leading-[1.6] text-soft md:text-[19px]">
            {project.solution}
          </p>
        </div>
      </div>

      {/* Two-up gallery */}
      {g1 && g2 && (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {[g1, g2].map((g, i) => (
            <div
              key={i}
              className="relative h-[420px] md:h-[620px]"
              style={{ background: g.gradient }}
            >
              {g.url && (
                <img
                  src={g.url}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quote */}
      {project.quote && (
        <div className="px-page py-24 text-center md:py-[150px]">
          <p className="mx-auto max-w-[880px] text-2xl font-medium leading-[1.3] tracking-tight [text-wrap:balance] md:text-[40px]">
            {project.quote}{" "}
            <span className="text-muted">{project.quoteMuted}</span>
          </p>
          <div className="mt-7 text-[15px] text-faint">
            {project.quoteAuthor}
          </div>
        </div>
      )}

      {/* Full-bleed image 2 */}
      {g3 && <FullBleed image={g3} />}

      {/* Metrics */}
      {project.metrics.length > 0 && (
        <div className="grid grid-cols-1 gap-10 border-b border-line px-page py-20 sm:grid-cols-3 sm:gap-8 md:py-[110px]">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div className="text-4xl font-medium tracking-tight md:text-[56px]">
                {m.value}
              </div>
              <div className="mt-2.5 text-[15px] text-muted">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Next project */}
      {next && next.slug !== project.slug && (
        <Link
          href={`/projetos/${next.slug}`}
          className="relative block min-h-[380px] overflow-hidden text-white md:min-h-[480px]"
          style={{ height: "66vh", background: next.gradient }}
        >
          <div className="absolute left-5 top-11 text-[15px] text-white/65 md:left-11">
            Próximo projeto
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-5 text-center text-4xl font-medium tracking-tighter md:text-[64px]">
              {next.title} →
            </span>
          </div>
        </Link>
      )}

      <Footer global={global} />
    </div>
  );
}

function FullBleed({ image }: { image: { url: string; gradient: string } }) {
  return (
    <div
      className="relative min-h-[380px] md:min-h-[560px]"
      style={{ height: "78vh", background: image.gradient }}
    >
      {image.url && (
        <img
          src={image.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
