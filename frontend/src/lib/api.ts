import {
  fallbackAbout,
  fallbackGlobal,
  fallbackHome,
  fallbackProjects,
} from "./fallback";
import type {
  AboutPage,
  GalleryImage,
  Global,
  HomePage,
  Metric,
  Project,
} from "./types";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

const REVALIDATE = 60;

/* eslint-disable @typescript-eslint/no-explicit-any */

async function strapiFetch(path: string): Promise<any | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

function mediaUrl(media: any): string {
  const url = media?.url;
  if (!url) return "";
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

function mapProject(p: any): Project {
  return {
    title: p.title ?? "",
    slug: p.slug ?? "",
    category: p.category ?? "",
    year: p.year ?? "",
    client: p.client ?? "",
    sector: p.sector ?? "",
    scope: p.scope ?? "",
    gradient: p.gradient ?? "linear-gradient(160deg,#1a2f4a,#060608)",
    coverUrl: mediaUrl(p.cover),
    statement: p.statement ?? "",
    statementMuted: p.statementMuted ?? "",
    challenge: p.challenge ?? "",
    solution: p.solution ?? "",
    quote: p.quote ?? "",
    quoteMuted: p.quoteMuted ?? "",
    quoteAuthor: p.quoteAuthor ?? "",
    metrics: (p.metrics ?? []).map(
      (m: any): Metric => ({ value: m.value ?? "", label: m.label ?? "" }),
    ),
    gallery: (p.gallery ?? []).map(
      (g: any): GalleryImage => ({
        url: mediaUrl(g.image),
        gradient: g.gradient ?? "linear-gradient(150deg,#1c2b45,#0b1220)",
      }),
    ),
    order: p.order ?? 99,
    featured: p.featured ?? false,
  };
}

export async function getProjects(): Promise<Project[]> {
  const data = await strapiFetch(
    "/projects?sort=order:asc&populate[cover]=true&populate[metrics]=true&populate[gallery][populate]=image",
  );
  if (!data || data.length === 0) return fallbackProjects;
  return data.map(mapProject);
}

export async function getProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getGlobal(): Promise<Global> {
  const data = await strapiFetch("/global?populate=socials");
  if (!data) return fallbackGlobal;
  return {
    siteName: data.siteName ?? fallbackGlobal.siteName,
    tagline: data.tagline ?? fallbackGlobal.tagline,
    email: data.email ?? fallbackGlobal.email,
    location: data.location ?? fallbackGlobal.location,
    locationNote: data.locationNote ?? fallbackGlobal.locationNote,
    socials: (data.socials ?? fallbackGlobal.socials).map((s: any) => ({
      label: s.label ?? "",
      url: s.url ?? "#",
    })),
    ctaLead: data.ctaLead ?? fallbackGlobal.ctaLead,
    ctaMuted: data.ctaMuted ?? fallbackGlobal.ctaMuted,
    contactTitleLead: data.contactTitleLead ?? fallbackGlobal.contactTitleLead,
    contactTitleMuted:
      data.contactTitleMuted ?? fallbackGlobal.contactTitleMuted,
    projectsTitleLead:
      data.projectsTitleLead ?? fallbackGlobal.projectsTitleLead,
    projectsTitleMuted:
      data.projectsTitleMuted ?? fallbackGlobal.projectsTitleMuted,
  };
}

export async function getHomePage(): Promise<HomePage> {
  const data = await strapiFetch("/home-page?populate=services");
  if (!data) return fallbackHome;
  return {
    heroTitle: data.heroTitle ?? fallbackHome.heroTitle,
    statementLead: data.statementLead ?? fallbackHome.statementLead,
    statementMuted: data.statementMuted ?? fallbackHome.statementMuted,
    servicesLead: data.servicesLead ?? fallbackHome.servicesLead,
    servicesMuted: data.servicesMuted ?? fallbackHome.servicesMuted,
    services: (data.services ?? fallbackHome.services).map((s: any) => ({
      title: s.title ?? "",
    })),
  };
}

export async function getAboutPage(): Promise<AboutPage> {
  const data = await strapiFetch(
    "/about-page?populate[steps]=true&populate[teamImage]=true",
  );
  if (!data) return fallbackAbout;
  return {
    titleLead: data.titleLead ?? fallbackAbout.titleLead,
    titleMuted: data.titleMuted ?? fallbackAbout.titleMuted,
    manifestoLead: data.manifestoLead ?? fallbackAbout.manifestoLead,
    manifestoMuted: data.manifestoMuted ?? fallbackAbout.manifestoMuted,
    paragraphs: data.paragraphs
      ? String(data.paragraphs)
          .split("\n")
          .map((p: string) => p.trim())
          .filter(Boolean)
      : fallbackAbout.paragraphs,
    teamImageUrl: data.teamImage
      ? mediaUrl(data.teamImage)
      : fallbackAbout.teamImageUrl,
    steps: (data.steps ?? fallbackAbout.steps).map((s: any) => ({
      number: s.number ?? "",
      title: s.title ?? "",
      description: s.description ?? "",
    })),
  };
}

export async function submitContact(payload: {
  name: string;
  email: string;
  company: string;
  message: string;
}): Promise<boolean> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/contact-messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export { STRAPI_URL };
