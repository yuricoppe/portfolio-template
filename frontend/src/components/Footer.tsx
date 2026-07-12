import Link from "next/link";
import Reveal from "@/components/Reveal";
import Spotlight from "@/components/Spotlight";
import type { Global } from "@/lib/types";

export default function Footer({ global }: { global: Global }) {
  return (
    <footer className="relative overflow-hidden bg-paper px-page pb-12 pt-24 text-[#0a0a0a] md:pt-40">
      <Spotlight color="rgba(61, 67, 184, 0.08)" size={560} />
      <Reveal>
        <h2 className="max-w-5xl text-4xl font-medium leading-[1.15] tracking-tight md:text-[56px]">
          {global.ctaLead}{" "}
          <span className="text-[#9a9a9a]">{global.ctaMuted}</span>
        </h2>
      </Reveal>
      <Link
        href="/contato"
        className="glow-border glow-border--dark relative z-10 mt-10 inline-block rounded-[10px] bg-[#ececec] px-7 py-3.5 text-[15px] transition-all duration-300 hover:bg-[#dcdcdc] hover:px-9"
      >
        Contato
      </Link>
      <div className="mt-20 flex flex-col gap-2 border-t border-[#e4e4e4] pt-7 text-sm text-[#8a8a8a] sm:flex-row sm:justify-between md:mt-32">
        <span>© 2026 {capitalize(global.siteName)}</span>
        <span>{global.email}</span>
        <span>{global.location}</span>
      </div>
    </footer>
  );
}

function capitalize(s: string) {
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
