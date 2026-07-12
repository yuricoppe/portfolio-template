import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getGlobal, getProjects } from "@/lib/api";

export const metadata = {
  title: "Projetos — Colativo",
};

export default async function Projetos() {
  const [global, projects] = await Promise.all([getGlobal(), getProjects()]);

  return (
    <div className="bg-ink text-white">
      <Header siteName={global.siteName} />

      <div className="box-border">
        <div className="sticky top-0 px-page pb-16 pt-20 md:pb-[90px] md:pt-[110px]">
          <h1 className="max-w-[1000px] text-3xl font-medium leading-[1.18] tracking-tight md:text-[56px]">
            Projetos.{" "}
            <span className="text-muted">
              Marcas, produtos e plataformas que já saíram do papel.
            </span>
          </h1>
        </div>

        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projetos/${p.slug}`}
            className={`sticky top-0 block min-h-[500px] overflow-hidden text-white md:min-h-[620px] ${
              i < projects.length - 1 ? "mb-2" : ""
            }`}
            style={{ height: "82vh", background: p.gradient }}
          >
            {p.coverUrl && (
              <img
                src={p.coverUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute left-5 top-10 text-[15px] text-white/60 md:left-11">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="absolute bottom-9 left-5 md:left-11">
              <div className="text-2xl font-medium tracking-tight md:text-[32px]">
                {p.title}
              </div>
              <div className="mt-1.5 text-[15px] text-white/60">
                {p.category} · {p.year}
              </div>
            </div>
            <div className="absolute bottom-9 right-5 hidden rounded-[10px] bg-white/14 px-6 py-3 text-sm backdrop-blur-md sm:block md:right-11">
              Ver case
            </div>
          </Link>
        ))}
      </div>

      <Footer global={global} />
    </div>
  );
}
