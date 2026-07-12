# Colativo — Portfolio Template

Site de portfólio implementado a partir do projeto no Claude Design (Home, Projetos, Interna de Projeto, Quem Somos e Contato), com **Next.js** no frontend e **Strapi** como CMS.

## Estrutura

```
frontend/   Next.js 16 (App Router, TypeScript, Tailwind 4)
backend/    Strapi 5 (SQLite, TypeScript) — content types + seed automático
```

## Rodando

```bash
# 1. CMS (porta 1337)
cd backend
npm install
npm run develop

# 2. Frontend (porta 3000)
cd frontend
npm install
npm run dev
```

No primeiro boot o Strapi cria e publica automaticamente todo o conteúdo demo
(projetos, páginas e imagens) e libera as permissões públicas de leitura + o
`create` de mensagens de contato. Crie seu usuário admin em
`http://localhost:1337/admin` para editar o conteúdo.

O frontend lê o Strapi via `NEXT_PUBLIC_STRAPI_URL` (`frontend/.env.local`,
padrão `http://localhost:1337`). Se o Strapi estiver fora do ar, as páginas
usam um conteúdo de fallback embutido (`frontend/src/lib/fallback.ts`).

## Conteúdo no Strapi

| Tipo | Uso |
| --- | --- |
| `Project` (coleção) | Cases do portfólio: capa, gradiente, desafio/solução, métricas, galeria, destaque e ordem |
| `Global` (single) | Nome do site, tagline, e-mail, endereço e redes sociais |
| `Home` (single) | Hero, statement e lista de serviços |
| `Quem Somos` (single) | Título, manifesto (um parágrafo por linha), imagem da equipe e etapas do processo |
| `Contact message` (coleção) | Mensagens recebidas pelo formulário de contato |

O formulário de Contato envia via `POST /api/contact` (route handler do Next),
que repassa para `POST /api/contact-messages` no Strapi.

## Imagens

As imagens do projeto original no Claude Design excedem o limite de download da
API (256 KiB), então o template usa artes SVG geradas com os mesmos gradientes
do design como placeholder. Para usar as imagens reais, basta substituí-las na
Media Library do Strapi (campos `cover`, `gallery` e `teamImage`) — o layout
não depende dos arquivos locais em `frontend/public/img`.
