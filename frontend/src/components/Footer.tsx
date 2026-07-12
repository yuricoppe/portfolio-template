import Link from "next/link";
import type { Global } from "@/lib/types";

export default function Footer({ global }: { global: Global }) {
  return (
    <footer className="bg-paper px-page pb-12 pt-24 text-[#0a0a0a] md:pt-40">
      <h2 className="max-w-5xl text-4xl font-medium leading-[1.15] tracking-tight md:text-[56px]">
        Vamos conversar.{" "}
        <span className="text-[#9a9a9a]">Adoraríamos ouvir sua ideia.</span>
      </h2>
      <Link
        href="/contato"
        className="mt-10 inline-block rounded-[10px] bg-[#ececec] px-7 py-3.5 text-[15px] transition-colors hover:bg-[#dcdcdc]"
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
