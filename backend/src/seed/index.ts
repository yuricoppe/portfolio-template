import type { Core } from '@strapi/strapi';
import fs from 'node:fs';
import path from 'node:path';

const UPLOADS_DIR = path.resolve(__dirname, '../../../data/uploads');

async function uploadImage(
  strapi: Core.Strapi,
  fileName: string,
): Promise<number | null> {
  const filePath = path.join(UPLOADS_DIR, fileName);
  if (!fs.existsSync(filePath)) return null;

  const existing = await strapi.db
    .query('plugin::upload.file')
    .findOne({ where: { name: fileName } });
  if (existing) return existing.id;

  const stat = fs.statSync(filePath);
  const [file] = await strapi
    .plugin('upload')
    .service('upload')
    .upload({
      data: { fileInfo: { name: fileName } },
      files: {
        filepath: filePath,
        originalFilename: fileName,
        mimetype: 'image/svg+xml',
        size: stat.size,
      },
    });
  return file?.id ?? null;
}

async function grantPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });
  if (!publicRole) return;

  const actions = [
    'api::project.project.find',
    'api::project.project.findOne',
    'api::global.global.find',
    'api::home-page.home-page.find',
    'api::about-page.about-page.find',
    'api::contact-message.contact-message.create',
  ];

  for (const action of actions) {
    const exists = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });
    if (!exists) {
      await strapi.db
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: publicRole.id } });
    }
  }
}

const GLOBAL_DEFAULTS = {
  siteName: 'COLATIVO',
  tagline: 'O design está em tudo. Use-o ao seu favor!',
  email: 'ola@colativo.com.br',
  location: 'São Paulo — BR',
  locationNote:
    'São Paulo — Brasil\nTrabalhamos remoto com clientes em qualquer lugar.',
  socials: [
    { label: 'Instagram', url: '#' },
    { label: 'LinkedIn', url: '#' },
    { label: 'Behance', url: '#' },
  ],
  ctaLead: 'Vamos conversar.',
  ctaMuted: 'Adoraríamos ouvir sua ideia.',
  contactTitleLead: 'Vamos conversar.',
  contactTitleMuted:
    'Conte sobre o seu projeto — respondemos em até dois dias úteis.',
  projectsTitleLead: 'Projetos.',
  projectsTitleMuted: 'Marcas, produtos e plataformas que já saíram do papel.',
  siteDescription:
    'O coletivo de design, estratégia e tecnologia por trás de marcas e produtos que movem negócios.',
  labelViewCase: 'Ver case',
  labelViewAll: 'Ver todos os projetos',
  labelNextProject: 'Próximo projeto',
};

export default async function seed(strapi: Core.Strapi) {
  await grantPublicPermissions(strapi);

  const img: Record<string, number | null> = {};
  const uploadAll = async () => {
    for (const name of [
      'hero',
      'banca',
      'rota',
      'raiz',
      'vento',
      'equipe',
      'banca-identidade',
      'banca-app',
      'banca-marca',
      'banca-uso',
    ]) {
      img[name] = await uploadImage(strapi, `${name}.svg`);
    }
  };

  // ---- Global (cria ou backfill de campos novos) ----
  const globalDoc = await strapi.documents('api::global.global').findFirst();
  if (!globalDoc) {
    await strapi.documents('api::global.global').create({
      data: GLOBAL_DEFAULTS,
    });
  } else if (globalDoc.ctaLead == null || globalDoc.labelViewCase == null) {
    const { socials: _socials, ...fields } = GLOBAL_DEFAULTS;
    const backfill = Object.fromEntries(
      Object.entries(fields).filter(
        ([key]) => (globalDoc as Record<string, unknown>)[key] == null,
      ),
    );
    if (Object.keys(backfill).length > 0) {
      await strapi.documents('api::global.global').update({
        documentId: globalDoc.documentId,
        data: backfill,
      });
    }
  }

  // ---- Home (cria ou backfill do hero) ----
  const homeDoc = await strapi
    .documents('api::home-page.home-page')
    .findFirst();
  const HOME_HERO = {
    heroGradient:
      'radial-gradient(120% 90% at 65% 30%, #3d43b8 0%, #23255e 45%, #0b0b16 100%)',
  };
  if (!homeDoc) {
    await uploadAll();
    await strapi.documents('api::home-page.home-page').create({
      data: {
        heroTitle: 'O design está em tudo. Use-o ao seu favor!',
        heroImage: img['hero'],
        ...HOME_HERO,
        statementLead: 'Somos o Colativo.',
        statementMuted:
          'O coletivo de design, estratégia e tecnologia por trás de marcas e produtos que movem negócios.',
        servicesLead: 'Enquanto a tecnologia muda tudo,',
        servicesMuted: 'ajudamos negócios a se adaptar e acelerar.',
        services: [
          { title: 'Estratégia & Posicionamento' },
          { title: 'Branding & Identidade' },
          { title: 'Produto digital' },
          { title: 'Tecnologia & IA' },
        ],
      },
    });
  } else if (homeDoc.heroGradient == null) {
    await uploadAll();
    await strapi.documents('api::home-page.home-page').update({
      documentId: homeDoc.documentId,
      data: { heroImage: img['hero'], ...HOME_HERO },
    });
  }

  // ---- Quem Somos ----
  const aboutDoc = await strapi
    .documents('api::about-page.about-page')
    .findFirst();
  if (!aboutDoc) {
    await uploadAll();
    await strapi.documents('api::about-page.about-page').create({
      data: {
        titleLead: 'Somos um coletivo.',
        titleMuted:
          'Não uma agência, não uma consultoria, não uma software house — um pouco das três, sem os vícios de nenhuma.',
        manifestoLead: 'O design está em tudo.',
        manifestoMuted: 'Use-o ao seu favor!',
        paragraphs: [
          'Acreditamos que design não é uma etapa — é a forma como um negócio pensa. Está na estratégia antes de estar na tela, no código antes de estar no pitch.',
          'Por isso trabalhamos em frentes mistas: estrategistas, designers e engenheiros no mesmo problema, do primeiro dia ao lançamento. Sem repasse de bastão, sem tradução entre áreas, sem PDF que ninguém abre.',
          'Somos deliberadamente pequenos. Cada projeto tem os sócios na sala — e só aceitamos os problemas em que a gente realmente pode mudar o resultado.',
        ].join('\n'),
        teamImage: img['equipe'],
        steps: [
          {
            number: '01',
            title: 'Diagnóstico',
            description:
              'Semanas de imersão no negócio, nos dados e nas pessoas antes de qualquer proposta de solução.',
          },
          {
            number: '02',
            title: 'Estratégia + Design',
            description:
              'Posicionamento, identidade e produto desenhados juntos — decisões de marca e de interface na mesma mesa.',
          },
          {
            number: '03',
            title: 'Construção',
            description:
              'Engenharia própria, lado a lado com o time do cliente, até o lançamento — e depois dele.',
          },
        ],
      },
    });
  }

  // ---- Projetos (dynamic zone) ----
  // Migração: projetos criados antes das seções modulares não têm
  // `sections`; nesse caso são recriados a partir do seed.
  const existing = await strapi.documents('api::project.project').findMany({
    populate: { sections: true },
  });
  const legacy =
    existing.length > 0 &&
    existing.every((p) => !p.sections || p.sections.length === 0);
  if (existing.length > 0 && !legacy) return;

  if (legacy) {
    strapi.log.info(
      'Migrando projetos para o formato de seções modulares…',
    );
    for (const p of existing) {
      await strapi
        .documents('api::project.project')
        .delete({ documentId: p.documentId });
    }
  }

  await uploadAll();
  strapi.log.info('Seeding projetos…');

  const projects = [
    {
      title: 'Banca Viva',
      slug: 'banca-viva',
      category: 'Fintech — Branding + Produto digital',
      year: '2026',
      client: 'Banca Viva S.A.',
      sector: 'Serviços financeiros',
      scope: 'Estratégia, branding, produto digital',
      gradient: 'linear-gradient(160deg,#1a2f4a 0%,#0d1524 60%,#060608 100%)',
      cover: img['banca'],
      order: 1,
      featured: true,
      sections: [
        {
          __component: 'sections.statement',
          lead: 'Uma fintech crescendo rápido,',
          muted:
            'com uma marca que não acompanhava a ambição — e um app que não acompanhava a marca.',
        },
        {
          __component: 'sections.full-image',
          image: img['banca-identidade'],
          gradient:
            'linear-gradient(140deg,#22406a 0%,#101d33 60%,#070a10 100%)',
        },
        {
          __component: 'sections.text-columns',
          columns: [
            {
              label: 'O DESAFIO',
              body: 'A Banca Viva triplicou de tamanho em dois anos, mas a experiência do produto e a identidade visual ainda comunicavam a startup de 2022. Era preciso reposicionar a marca sem perder a confiança conquistada — e reconstruir o app em paralelo, sem interromper a operação.',
            },
            {
              label: 'A SOLUÇÃO',
              body: 'Trabalhamos estratégia, design e engenharia como uma frente única: novo posicionamento e identidade, design system completo e o redesenho do app conduzido por squads mistos com o time interno — do diagnóstico ao lançamento em oito meses.',
            },
          ],
        },
        {
          __component: 'sections.image-grid',
          images: [
            {
              image: img['banca-app'],
              gradient: 'linear-gradient(150deg,#1c2b45 0%,#0b1220 75%)',
            },
            {
              image: img['banca-marca'],
              gradient: 'linear-gradient(150deg,#2a3550 0%,#10141f 75%)',
            },
          ],
        },
        {
          __component: 'sections.quote',
          quote: '"O Colativo virou parte do nosso time.',
          quoteMuted:
            'O relançamento foi o trimestre de maior crescimento da nossa história."',
          author: 'Direção de Produto — Banca Viva',
        },
        {
          __component: 'sections.full-image',
          image: img['banca-uso'],
          gradient:
            'linear-gradient(160deg,#31548c 0%,#16233c 55%,#080b12 100%)',
        },
        {
          __component: 'sections.metrics',
          items: [
            {
              value: '+62%',
              label: 'de ativação de novos clientes após o relançamento',
            },
            { value: '4,8', label: 'avaliação média nas lojas de aplicativos' },
            {
              value: '8 meses',
              label: 'do diagnóstico ao lançamento completo',
            },
          ],
        },
      ],
    },
    {
      title: 'Rota Urbana',
      slug: 'rota-urbana',
      category: 'Mobilidade — App + Estratégia',
      year: '2025',
      client: 'Rota Urbana Tecnologia',
      sector: 'Mobilidade urbana',
      scope: 'Estratégia, produto digital',
      gradient: 'linear-gradient(140deg,#5a5f9e 0%,#2c2f57 55%,#101020 100%)',
      cover: img['rota'],
      order: 2,
      featured: true,
      sections: [
        {
          __component: 'sections.statement',
          lead: 'Milhões de deslocamentos por dia,',
          muted:
            'e um app que tratava todos como se fossem o mesmo trajeto. Era hora de repensar a jornada inteira.',
        },
        {
          __component: 'sections.text-columns',
          columns: [
            {
              label: 'O DESAFIO',
              body: 'O produto crescia em downloads, mas a retenção caía: a experiência não diferenciava quem usa o transporte todos os dias de quem usa uma vez por mês, e o roadmap era pautado por pedidos isolados.',
            },
            {
              label: 'A SOLUÇÃO',
              body: 'Reestruturamos a estratégia de produto a partir de pesquisa com usuários reais, redesenhamos os fluxos principais e implementamos um novo app com o time do cliente, medindo cada release contra métricas de retenção.',
            },
          ],
        },
        {
          __component: 'sections.quote',
          quote: '"Pela primeira vez o roadmap tem um porquê.',
          quoteMuted: 'O time inteiro entende para onde o produto vai."',
          author: 'Head de Produto — Rota Urbana',
        },
        {
          __component: 'sections.metrics',
          items: [
            { value: '+38%', label: 'de retenção em 90 dias após o novo app' },
            { value: '2x', label: 'mais viagens planejadas dentro do app' },
            { value: '6 meses', label: 'da pesquisa ao lançamento nas lojas' },
          ],
        },
      ],
    },
    {
      title: 'Instituto Raiz',
      slug: 'instituto-raiz',
      category: 'Educação — Identidade + Site',
      year: '2025',
      client: 'Instituto Raiz',
      sector: 'Educação',
      scope: 'Branding, site institucional',
      gradient: 'linear-gradient(150deg,#173328 0%,#0a130e 70%)',
      cover: img['raiz'],
      order: 3,
      featured: false,
      sections: [
        {
          __component: 'sections.statement',
          lead: 'Vinte anos de impacto real,',
          muted:
            'escondidos atrás de uma marca que não contava a história — nem para doadores, nem para as famílias atendidas.',
        },
        {
          __component: 'sections.text-columns',
          columns: [
            {
              label: 'O DESAFIO',
              body: 'O Instituto precisava captar recursos maiores, mas a identidade e o site não transmitiam a solidez do trabalho feito há duas décadas nas comunidades onde atua.',
            },
            {
              label: 'A SOLUÇÃO',
              body: 'Construímos uma nova identidade a partir das histórias dos alunos, um site que coloca os resultados no centro e um kit de captação que a equipe consegue atualizar sozinha.',
            },
          ],
        },
        {
          __component: 'sections.quote',
          quote: '"A nova marca destravou conversas',
          quoteMuted: 'que a gente tentava começar há anos."',
          author: 'Direção Executiva — Instituto Raiz',
        },
        {
          __component: 'sections.metrics',
          items: [
            { value: '+120%', label: 'de doações recorrentes no primeiro ano' },
            { value: '3x', label: 'mais tempo de permanência no novo site' },
            { value: '4 meses', label: 'da imersão ao lançamento da marca' },
          ],
        },
      ],
    },
    {
      title: 'Vento Sul',
      slug: 'vento-sul',
      category: 'Energia — Plataforma + Dados',
      year: '2024',
      client: 'Vento Sul Energia',
      sector: 'Energia renovável',
      scope: 'Produto digital, dados, tecnologia',
      gradient: 'linear-gradient(150deg,#3a2c14 0%,#120e06 70%)',
      cover: img['vento'],
      order: 4,
      featured: false,
      sections: [
        {
          __component: 'sections.statement',
          lead: 'Terabytes de dados de operação,',
          muted:
            'planilhas por toda parte — e nenhuma visão única do que estava acontecendo nos parques eólicos.',
        },
        {
          __component: 'sections.text-columns',
          columns: [
            {
              label: 'O DESAFIO',
              body: 'As decisões de manutenção e compra de energia dependiam de relatórios manuais que levavam dias para consolidar informações espalhadas em sistemas diferentes.',
            },
            {
              label: 'A SOLUÇÃO',
              body: 'Desenhamos e construímos uma plataforma de dados operacionais com visualizações em tempo real, alertas inteligentes e uma camada de IA para previsão de geração.',
            },
          ],
        },
        {
          __component: 'sections.quote',
          quote: '"Saímos do retrovisor para o para-brisa.',
          quoteMuted: 'Hoje a operação enxerga o dia seguinte."',
          author: 'Diretoria de Operações — Vento Sul',
        },
        {
          __component: 'sections.metrics',
          items: [
            { value: '-45%', label: 'no tempo de resposta a falhas de turbina' },
            {
              value: 'R$ 12M',
              label: 'economizados em manutenção no primeiro ano',
            },
            { value: '5 parques', label: 'integrados em uma única plataforma' },
          ],
        },
      ],
    },
  ];

  for (const data of projects) {
    await strapi.documents('api::project.project').create({
      data: data as never,
      status: 'published',
    });
  }

  strapi.log.info('Seed concluído.');
}
