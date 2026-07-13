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
  Section,
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

const DEFAULT_GRADIENT = "linear-gradient(150deg,#1c2b45,#0b1220)";

function mapGalleryImage(g: any): GalleryImage {
  return {
    url: mediaUrl(g?.image),
    gradient: g?.gradient ?? DEFAULT_GRADIENT,
  };
}

function mapSection(s: any): Section | null {
  switch (s.__component) {
    case "sections.statement":
      return { type: "statement", lead: s.lead ?? "", muted: s.muted ?? "" };
    case "sections.full-image":
      return { type: "full-image", image: mapGalleryImage(s) };
    case "sections.text-columns":
      return {
        type: "text-columns",
        columns: (s.columns ?? []).map((c: any) => ({
          label: c.label ?? "",
          body: c.body ?? "",
        })),
      };
    case "sections.image-grid":
      return { type: "image-grid", images: (s.images ?? []).map(mapGalleryImage) };
    case "sections.quote":
      return {
        type: "quote",
        quote: s.quote ?? "",
        quoteMuted: s.quoteMuted ?? "",
        author: s.author ?? "",
      };
    case "sections.metrics":
      return {
        type: "metrics",
        items: (s.items ?? []).map(
          (m: any): Metric => ({ value: m.value ?? "", label: m.label ?? "" }),
        ),
      };
    default:
      return null;
  }
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
    sections: (p.sections ?? [])
      .map(mapSection)
      .filter((s: Section | null): s is Section => s !== null),
    order: p.order ?? 99,
    featured: p.featured ?? false,
  };
}

export async function getProjects(): Promise<Project[]> {
  const data = await strapiFetch(
    "/projects?sort=order:asc&populate[cover]=true" +
      "&populate[sections][on][sections.statement]=true" +
      "&populate[sections][on][sections.full-image][populate]=image" +
      "&populate[sections][on][sections.text-columns][populate]=columns" +
      "&populate[sections][on][sections.image-grid][populate][images][populate]=image" +
      "&populate[sections][on][sections.quote]=true" +
      "&populate[sections][on][sections.metrics][populate]=items",
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
    siteDescription: data.siteDescription ?? fallbackGlobal.siteDescription,
    labelViewCase: data.labelViewCase ?? fallbackGlobal.labelViewCase,
    labelViewAll: data.labelViewAll ?? fallbackGlobal.labelViewAll,
    labelNextProject: data.labelNextProject ?? fallbackGlobal.labelNextProject,
  };
}

export async function getHomePage(): Promise<HomePage> {
  const data = await strapiFetch(
    "/home-page?populate[services]=true&populate[heroImage]=true",
  );
  if (!data) return fallbackHome;
  return {
    heroTitle: data.heroTitle ?? fallbackHome.heroTitle,
    heroImageUrl: data.heroImage
      ? mediaUrl(data.heroImage)
      : fallbackHome.heroImageUrl,
    heroGradient: data.heroGradient ?? fallbackHome.heroGradient,
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
