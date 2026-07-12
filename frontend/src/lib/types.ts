export interface Metric {
  value: string;
  label: string;
}

export interface GalleryImage {
  url: string;
  gradient: string;
}

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
  statement: string;
  statementMuted: string;
  challenge: string;
  solution: string;
  quote: string;
  quoteMuted: string;
  quoteAuthor: string;
  metrics: Metric[];
  gallery: GalleryImage[];
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
}

export interface HomePage {
  heroTitle: string;
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
