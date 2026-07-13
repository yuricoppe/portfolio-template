import type { AboutPage, Global, HomePage, Project } from "./types";

// Conteúdo espelhado no seed do Strapi (backend/src/seed/index.ts).
// Usado quando o Strapi não está acessível, para o template funcionar isolado.

export const fallbackGlobal: Global = {
  siteName: "COLATIVO",
  tagline: "O design está em tudo. Use-o ao seu favor!",
  email: "ola@colativo.com.br",
  location: "São Paulo — BR",
  locationNote:
    "São Paulo — Brasil\nTrabalhamos remoto com clientes em qualquer lugar.",
  socials: [
    { label: "Instagram", url: "#" },
    { label: "LinkedIn", url: "#" },
    { label: "Behance", url: "#" },
  ],
  ctaLead: "Vamos conversar.",
  ctaMuted: "Adoraríamos ouvir sua ideia.",
  contactTitleLead: "Vamos conversar.",
  contactTitleMuted:
    "Conte sobre o seu projeto — respondemos em até dois dias úteis.",
  projectsTitleLead: "Projetos.",
  projectsTitleMuted: "Marcas, produtos e plataformas que já saíram do papel.",
  siteDescription:
    "O coletivo de design, estratégia e tecnologia por trás de marcas e produtos que movem negócios.",
  labelViewCase: "Ver case",
  labelViewAll: "Ver todos os projetos",
  labelNextProject: "Próximo projeto",
};

export const fallbackHome: HomePage = {
  heroTitle: "O design está em tudo. Use-o ao seu favor!",
  heroImageUrl: "/img/hero.svg",
  heroVideoUrl: "",
  heroGradient:
    "radial-gradient(120% 90% at 65% 30%, #3d43b8 0%, #23255e 45%, #0b0b16 100%)",
  statementLead: "Somos o Colativo.",
  statementMuted:
    "O coletivo de design, estratégia e tecnologia por trás de marcas e produtos que movem negócios.",
  servicesLead: "Enquanto a tecnologia muda tudo,",
  servicesMuted: "ajudamos negócios a se adaptar e acelerar.",
  services: [
    { title: "Estratégia & Posicionamento" },
    { title: "Branding & Identidade" },
    { title: "Produto digital" },
    { title: "Tecnologia & IA" },
  ],
};

export const fallbackAbout: AboutPage = {
  titleLead: "Somos um coletivo.",
  titleMuted:
    "Não uma agência, não uma consultoria, não uma software house — um pouco das três, sem os vícios de nenhuma.",
  manifestoLead: "O design está em tudo.",
  manifestoMuted: "Use-o ao seu favor!",
  paragraphs: [
    "Acreditamos que design não é uma etapa — é a forma como um negócio pensa. Está na estratégia antes de estar na tela, no código antes de estar no pitch.",
    "Por isso trabalhamos em frentes mistas: estrategistas, designers e engenheiros no mesmo problema, do primeiro dia ao lançamento. Sem repasse de bastão, sem tradução entre áreas, sem PDF que ninguém abre.",
    "Somos deliberadamente pequenos. Cada projeto tem os sócios na sala — e só aceitamos os problemas em que a gente realmente pode mudar o resultado.",
  ],
  teamImageUrl: "/img/equipe.svg",
  steps: [
    {
      number: "01",
      title: "Diagnóstico",
      description:
        "Semanas de imersão no negócio, nos dados e nas pessoas antes de qualquer proposta de solução.",
    },
    {
      number: "02",
      title: "Estratégia + Design",
      description:
        "Posicionamento, identidade e produto desenhados juntos — decisões de marca e de interface na mesma mesa.",
    },
    {
      number: "03",
      title: "Construção",
      description:
        "Engenharia própria, lado a lado com o time do cliente, até o lançamento — e depois dele.",
    },
  ],
};

export const fallbackProjects: Project[] = [
  {
    title: "Banca Viva",
    slug: "banca-viva",
    category: "Fintech — Branding + Produto digital",
    year: "2026",
    client: "Banca Viva S.A.",
    sector: "Serviços financeiros",
    scope: "Estratégia, branding, produto digital",
    gradient: "linear-gradient(160deg,#1a2f4a 0%,#0d1524 60%,#060608 100%)",
    coverUrl: "/img/banca.svg",
    order: 1,
    featured: true,
    sections: [
      {
        type: "statement",
        lead: "Uma fintech crescendo rápido,",
        muted:
          "com uma marca que não acompanhava a ambição — e um app que não acompanhava a marca.",
      },
      {
        type: "full-image",
        image: {
          url: "/img/banca-identidade.svg",
          gradient:
            "linear-gradient(140deg,#22406a 0%,#101d33 60%,#070a10 100%)",
        },
      },
      {
        type: "text-columns",
        columns: [
          {
            label: "O DESAFIO",
            body: "A Banca Viva triplicou de tamanho em dois anos, mas a experiência do produto e a identidade visual ainda comunicavam a startup de 2022. Era preciso reposicionar a marca sem perder a confiança conquistada — e reconstruir o app em paralelo, sem interromper a operação.",
          },
          {
            label: "A SOLUÇÃO",
            body: "Trabalhamos estratégia, design e engenharia como uma frente única: novo posicionamento e identidade, design system completo e o redesenho do app conduzido por squads mistos com o time interno — do diagnóstico ao lançamento em oito meses.",
          },
        ],
      },
      {
        type: "image-grid",
        images: [
          {
            url: "/img/banca-app.svg",
            gradient: "linear-gradient(150deg,#1c2b45 0%,#0b1220 75%)",
          },
          {
            url: "/img/banca-marca.svg",
            gradient: "linear-gradient(150deg,#2a3550 0%,#10141f 75%)",
          },
        ],
      },
      {
        type: "quote",
        quote: '"O Colativo virou parte do nosso time.',
        quoteMuted:
          'O relançamento foi o trimestre de maior crescimento da nossa história."',
        author: "Direção de Produto — Banca Viva",
      },
      {
        type: "full-image",
        image: {
          url: "/img/banca-uso.svg",
          gradient:
            "linear-gradient(160deg,#31548c 0%,#16233c 55%,#080b12 100%)",
        },
      },
      {
        type: "metrics",
        items: [
          {
            value: "+62%",
            label: "de ativação de novos clientes após o relançamento",
          },
          { value: "4,8", label: "avaliação média nas lojas de aplicativos" },
          { value: "8 meses", label: "do diagnóstico ao lançamento completo" },
        ],
      },
    ],
  },
  {
    title: "Rota Urbana",
    slug: "rota-urbana",
    category: "Mobilidade — App + Estratégia",
    year: "2025",
    client: "Rota Urbana Tecnologia",
    sector: "Mobilidade urbana",
    scope: "Estratégia, produto digital",
    gradient: "linear-gradient(140deg,#5a5f9e 0%,#2c2f57 55%,#101020 100%)",
    coverUrl: "/img/rota.svg",
    order: 2,
    featured: true,
    sections: [
      {
        type: "statement",
        lead: "Milhões de deslocamentos por dia,",
        muted:
          "e um app que tratava todos como se fossem o mesmo trajeto. Era hora de repensar a jornada inteira.",
      },
      {
        type: "text-columns",
        columns: [
          {
            label: "O DESAFIO",
            body: "O produto crescia em downloads, mas a retenção caía: a experiência não diferenciava quem usa o transporte todos os dias de quem usa uma vez por mês, e o roadmap era pautado por pedidos isolados.",
          },
          {
            label: "A SOLUÇÃO",
            body: "Reestruturamos a estratégia de produto a partir de pesquisa com usuários reais, redesenhamos os fluxos principais e implementamos um novo app com o time do cliente, medindo cada release contra métricas de retenção.",
          },
        ],
      },
      {
        type: "quote",
        quote: '"Pela primeira vez o roadmap tem um porquê.',
        quoteMuted: 'O time inteiro entende para onde o produto vai."',
        author: "Head de Produto — Rota Urbana",
      },
      {
        type: "metrics",
        items: [
          { value: "+38%", label: "de retenção em 90 dias após o novo app" },
          { value: "2x", label: "mais viagens planejadas dentro do app" },
          { value: "6 meses", label: "da pesquisa ao lançamento nas lojas" },
        ],
      },
    ],
  },
  {
    title: "Instituto Raiz",
    slug: "instituto-raiz",
    category: "Educação — Identidade + Site",
    year: "2025",
    client: "Instituto Raiz",
    sector: "Educação",
    scope: "Branding, site institucional",
    gradient: "linear-gradient(150deg,#173328 0%,#0a130e 70%)",
    coverUrl: "/img/raiz.svg",
    order: 3,
    featured: false,
    sections: [
      {
        type: "statement",
        lead: "Vinte anos de impacto real,",
        muted:
          "escondidos atrás de uma marca que não contava a história — nem para doadores, nem para as famílias atendidas.",
      },
      {
        type: "text-columns",
        columns: [
          {
            label: "O DESAFIO",
            body: "O Instituto precisava captar recursos maiores, mas a identidade e o site não transmitiam a solidez do trabalho feito há duas décadas nas comunidades onde atua.",
          },
          {
            label: "A SOLUÇÃO",
            body: "Construímos uma nova identidade a partir das histórias dos alunos, um site que coloca os resultados no centro e um kit de captação que a equipe consegue atualizar sozinha.",
          },
        ],
      },
      {
        type: "quote",
        quote: '"A nova marca destravou conversas',
        quoteMuted: 'que a gente tentava começar há anos."',
        author: "Direção Executiva — Instituto Raiz",
      },
      {
        type: "metrics",
        items: [
          { value: "+120%", label: "de doações recorrentes no primeiro ano" },
          { value: "3x", label: "mais tempo de permanência no novo site" },
          { value: "4 meses", label: "da imersão ao lançamento da marca" },
        ],
      },
    ],
  },
  {
    title: "Vento Sul",
    slug: "vento-sul",
    category: "Energia — Plataforma + Dados",
    year: "2024",
    client: "Vento Sul Energia",
    sector: "Energia renovável",
    scope: "Produto digital, dados, tecnologia",
    gradient: "linear-gradient(150deg,#3a2c14 0%,#120e06 70%)",
    coverUrl: "/img/vento.svg",
    order: 4,
    featured: false,
    sections: [
      {
        type: "statement",
        lead: "Terabytes de dados de operação,",
        muted:
          "planilhas por toda parte — e nenhuma visão única do que estava acontecendo nos parques eólicos.",
      },
      {
        type: "text-columns",
        columns: [
          {
            label: "O DESAFIO",
            body: "As decisões de manutenção e compra de energia dependiam de relatórios manuais que levavam dias para consolidar informações espalhadas em sistemas diferentes.",
          },
          {
            label: "A SOLUÇÃO",
            body: "Desenhamos e construímos uma plataforma de dados operacionais com visualizações em tempo real, alertas inteligentes e uma camada de IA para previsão de geração.",
          },
        ],
      },
      {
        type: "quote",
        quote: '"Saímos do retrovisor para o para-brisa.',
        quoteMuted: 'Hoje a operação enxerga o dia seguinte."',
        author: "Diretoria de Operações — Vento Sul",
      },
      {
        type: "metrics",
        items: [
          { value: "-45%", label: "no tempo de resposta a falhas de turbina" },
          {
            value: "R$ 12M",
            label: "economizados em manutenção no primeiro ano",
          },
          { value: "5 parques", label: "integrados em uma única plataforma" },
        ],
      },
    ],
  },
];
