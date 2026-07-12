import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getAboutPage, getGlobal } from "@/lib/api";

export const metadata = {
  title: "Quem somos — Colativo",
};

export default async function QuemSomos() {
  const [global, about] = await Promise.all([getGlobal(), getAboutPage()]);

  return (
    <div className="bg-ink text-white">
      <Header siteName={global.siteName} />

      <div className="px-page pb-24 pt-20 md:pb-[140px] md:pt-[120px]">
        <h1 className="max-w-[1080px] text-3xl font-medium leading-[1.16] tracking-tight md:text-[60px]">
          {about.titleLead}{" "}
          <span className="text-muted">{about.titleMuted}</span>
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
          <img
            src={about.teamImageUrl}
            alt="Equipe Colativo"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      {/* Manifesto */}
      <div className="grid grid-cols-1 gap-12 px-page py-24 md:grid-cols-2 md:gap-20 md:py-[140px]">
        <h2 className="text-3xl font-medium leading-[1.25] tracking-tight md:text-[40px]">
          {about.manifestoLead}
          <br />
          <span className="text-muted">{about.manifestoMuted}</span>
        </h2>
        <div className="flex flex-col gap-7 text-lg leading-[1.65] text-soft md:text-[19px]">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
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
            <div
              key={s.number}
              className={`grid grid-cols-1 items-baseline gap-3 border-t border-line py-9 md:grid-cols-[80px_320px_1fr] md:gap-10 ${
                i === about.steps.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <span className="text-[15px] text-[#666]">{s.number}</span>
              <span className="text-2xl font-medium tracking-tight md:text-[26px]">
                {s.title}
              </span>
              <p className="text-[17px] leading-[1.6] text-[#9a9a9a]">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer global={global} />
    </div>
  );
}
