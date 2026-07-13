# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O projeto

Portfólio "Colativo" (site de estúdio de design, conteúdo em pt-BR) implementado a partir de um projeto do Claude Design. Dois apps independentes:

- `backend/` — Strapi 5 (TypeScript, SQLite em `.tmp/data.db`), CMS na porta **1337**
- `frontend/` — Next.js 16 App Router (TypeScript, Tailwind 4), site na porta **3000**

## Comandos

```bash
# Strapi (deve subir antes do frontend para servir conteúdo/uploads)
cd backend && npm run develop

# Next.js
cd frontend && npm run dev
cd frontend && npm run build    # build de produção (roda o typecheck)
cd frontend && npm run lint
```

Não há suíte de testes. A verificação usada até aqui é: `npm run build` + smoke test das 5 rotas no browser (Playwright com `channel: "chrome"`, sem baixar browsers).

`frontend/.env.local` define `NEXT_PUBLIC_STRAPI_URL` (padrão `http://localhost:1337`). O admin do Strapi fica em `http://localhost:1337/admin`.

- `frontend/CLAUDE.md` importa `frontend/AGENTS.md`: este Next.js tem breaking changes vs. dados de treino — consulte `frontend/node_modules/next/dist/docs/` antes de escrever código Next-específico.

## Arquitetura

### Fluxo de conteúdo (a regra central do template)

Todo conteúdo editorial vive no Strapi e tem **fallback espelhado** no frontend:

1. `backend/src/seed/index.ts` — roda no bootstrap (`backend/src/index.ts`). É idempotente: cria conteúdo apenas se ausente, faz **backfill** de campos novos em documentos existentes (checa `== null`) e **migra** formatos antigos (ex.: projetos sem `sections` são deletados e recriados). Também concede as permissões públicas (find/findOne dos tipos de conteúdo + create de `contact-message`) — não é preciso configurar permissões no admin.
2. `frontend/src/lib/api.ts` — único ponto de fetch (REST + populate explícito de dynamic zone via `populate[sections][on][...]`). Cada getter mapeia a resposta para os tipos de `types.ts` e cai para `fallback.ts` se o Strapi estiver fora ou o campo for null.
3. `frontend/src/lib/fallback.ts` — deve ser mantido em sincronia com o seed (mesmos textos/estrutura).

Ao adicionar um campo de conteúdo: schema JSON no backend → seed (criação + backfill) → `types.ts` → `api.ts` (populate + mapeamento + fallback) → `fallback.ts` → uso na página. Strings de UI ("Ver case" etc.) ficam no single type `Global`, não hardcoded em JSX.

### Páginas internas de projeto são modulares

`Project.sections` é uma dynamic zone (`sections.statement|full-image|text-columns|image-grid|quote|metrics`, componentes em `backend/src/components/sections/`). O frontend renderiza via `SectionBlock` (switch em `frontend/src/app/projetos/[slug]/page.tsx`). Para um novo tipo de bloco: componente JSON no backend + entrada na union `Section` em `types.ts` + case no `mapSection` de `api.ts` + case no `SectionBlock`.

### Sistema de animação

- `frontend/src/lib/motion.ts` é a fonte única de `useInView`, `useRafScroll`, `prefersReducedMotion()`, `hasFinePointer()`. Novos efeitos devem consumir esses helpers, não duplicar matchMedia/IO/rAF.
- **Gating no-JS**: os estados iniciais ocultos de `.reveal`, `.blur-word` e `.srt-word` só se aplicam sob `html.js` (classe adicionada por script inline no `layout.tsx` antes do paint; daí o `suppressHydrationWarning` no `<html>`). Sem JS, tudo fica visível. Qualquer novo efeito com estado inicial oculto deve seguir esse padrão em `globals.css`.
- `ParallaxMedia` renderiza `<img>` ou `<video autoplay muted loop playsinline>` conforme a extensão da URL — é o componente usado em todos os heros/cards/full-bleeds; vídeo entra pelo CMS (`heroVideo` na Home; `cover` dos projetos aceita vídeo).
- Tudo respeita `prefers-reduced-motion` (bloco de overrides no fim de `globals.css` — mantê-lo atualizado ao criar classes de animação).

### Armadilhas de CSS já encontradas (não reintroduzir)

- **Tailwind v4 + cascade layers**: regra fora de `@layer` em `globals.css` vence QUALQUER utilitário. Por isso a posição do `.glow-border` vive em `@layer utilities { :where(...) }`. Regras novas que conflitem com utilitários precisam do mesmo tratamento.
- **`mix-blend-mode` em filhos do header quebra o `backdrop-filter` irmão** (backdrop root do Chromium) — o gradual blur do header deixa de pintar, silenciosamente. A legibilidade do header sobre seções claras é feita por IntersectionObserver em `[data-light-section]` (marcado no footer branco), invertendo cores via classe.
- `.glow-border` depende do `GlowTracker` montado no layout (delegação global de mousemove que seta `--mx/--my`).

### Header/Menu

Header fixo (z-50) com `GradualBlur position="top"` de fundo; navegação é sempre o menu fullscreen (hambúrguer em todas as resoluções), com scroll lock e fechamento por mudança de `pathname`.

## Observação sobre as imagens

Os SVGs em `frontend/public/img` e `backend/data/uploads` são placeholders gerados (a API do Claude Design trunca downloads em 256 KiB). O layout não depende deles: as mídias reais entram pela Media Library do Strapi.
