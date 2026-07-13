export interface Metric {
  value: string;
  label: string;
}

export interface GalleryImage {
  url: string;
  gradient: string;
}

export interface TextColumn {
  label: string;
  body: string;
}

// Seções modulares da página interna de projeto (dynamic zone no Strapi)
export type Section =
  | { type: "statement"; lead: string; muted: string }
  | { type: "full-image"; image: GalleryImage }
  | { type: "text-columns"; columns: TextColumn[] }
  | { type: "image-grid"; images: GalleryImage[] }
  | { type: "quote"; quote: string; quoteMuted: string; author: string }
  | { type: "metrics"; items: Metric[] };

export interface Project {
  title: string;
  slug: string;
  category: string;
  year: string;
  client: string;
  sector: string;
  scope: string;
  gradient: string;
  coverUrl: string;
  sections: Section[];
  order: number;
  featured: boolean;
}

export interface Service {
  title: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface Global {
  siteName: string;
  tagline: string;
  email: string;
  location: string;
  locationNote: string;
  socials: SocialLink[];
  ctaLead: string;
  ctaMuted: string;
  contactTitleLead: string;
  contactTitleMuted: string;
  projectsTitleLead: string;
  projectsTitleMuted: string;
  siteDescription: string;
  labelViewCase: string;
  labelViewAll: string;
  labelNextProject: string;
}

export interface HomePage {
  heroTitle: string;
  heroImageUrl: string;
  // se preenchido no Strapi, o vídeo tem prioridade sobre a imagem
  heroVideoUrl: string;
  heroGradient: string;
  statementLead: string;
  statementMuted: string;
  servicesLead: string;
  servicesMuted: string;
  services: Service[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface AboutPage {
  titleLead: string;
  titleMuted: string;
  manifestoLead: string;
  manifestoMuted: string;
  paragraphs: string[];
  teamImageUrl: string;
  steps: ProcessStep[];
}
