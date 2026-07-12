import Header from "@/components/Header";
import { getGlobal } from "@/lib/api";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contato — Colativo",
};

export default async function Contato() {
  const global = await getGlobal();

  return (
    <div className="flex min-h-screen flex-col bg-ink text-white">
      <Header siteName={global.siteName} />

      <div className="px-page pb-16 pt-20 md:pb-[90px] md:pt-[110px]">
        <h1 className="max-w-[1000px] text-3xl font-medium leading-[1.16] tracking-tight md:text-[60px]">
          Vamos conversar.{" "}
          <span className="text-muted">
            Conte sobre o seu projeto — respondemos em até dois dias úteis.
          </span>
        </h1>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-16 px-page pb-24 md:grid-cols-[1.4fr_1fr] md:gap-[100px] md:pb-[150px]">
        <ContactForm />

        <div className="flex flex-col gap-12 text-base">
          <div>
            <div className="mb-3.5 text-sm tracking-[0.08em] text-faint">
              E-MAIL
            </div>
            <a
              href={`mailto:${global.email}`}
              className="text-[22px] font-medium text-white transition-colors hover:text-[#b9b9b9]"
            >
              {global.email}
            </a>
          </div>
          <div>
            <div className="mb-3.5 text-sm tracking-[0.08em] text-faint">
              ONDE ESTAMOS
            </div>
            <p className="whitespace-pre-line leading-[1.6] text-soft">
              {global.locationNote}
            </p>
          </div>
          <div>
            <div className="mb-3.5 text-sm tracking-[0.08em] text-faint">
              REDES
            </div>
            <div className="flex flex-col gap-2.5">
              {global.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target={s.url.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="text-soft transition-colors hover:text-white"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="flex flex-col gap-1 border-t border-line px-page py-7 text-sm text-faint sm:flex-row sm:justify-between">
        <span>© 2026 Colativo</span>
        <span>{global.tagline}</span>
      </footer>
    </div>
  );
}
