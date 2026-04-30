# Buscou Viajou — Visão Geral do Projeto

> Documento-mapa do repositório. Explica o que é o projeto, qual a stack, como
> está organizado e o que cada arquivo/diretório significa. Mantenha sempre
> atualizado quando a estrutura mudar.

---

## O que é

**Buscou Viajou** é um marketplace de fretamento turístico no Brasil — o
"Trivago do fretamento de ônibus, vans e micro-ônibus". O cliente busca uma
rota, compara veículos de várias empresas parceiras lado a lado e reserva em
poucos cliques. As empresas parceiras gerenciam frota, motoristas e reservas
no painel próprio.

A entrega atual é uma **demo navegável end-to-end** focada no **fluxo do
cliente** (busca → reserva → bilhete digital). Painel de empresa e super
admin ficam pra fase 2.

### Posicionamento

- **Cliente:** busca, compara, reserva, paga, recebe bilhete digital com QR
- **Empresa:** se auto-cadastra, gerencia frota, aprova reservas, recebe repasses
- **Super admin (Buscou Viajou):** modera empresas, resolve disputas, configura taxas

### Modelo de negócio

Marketplace estilo Trivago: agrega oferta, processa pagamento, repassa pra
empresa parceira descontando taxa de serviço. Pricing dinâmico (0.8x a 2.0x)
estilo Uber surge baseado em oferta/demanda + sazonalidade.

---

## Stack técnica

| Camada | Tecnologia |
|---|---|
| **Frontend** | Next.js 15 (App Router) + TypeScript + Tailwind v3 + Gotham (web fonts) |
| **Auth (cliente)** | Supabase Auth (magic link via email) |
| **API** | NestJS 10 + `@supabase/supabase-js` + JWKS validation (ES256) |
| **Banco** | Postgres 17 hospedado no Supabase |
| **Storage** | Supabase Storage (6 buckets: photos, logos, docs, evidências, tickets) |
| **Migrations** | Supabase CLI (`supabase migration new` + `supabase db push`) |
| **Tipos compartilhados** | `database.types.ts` gerado via `supabase gen types typescript --linked` |
| **Validation** | Zod (DTOs do backend e schemas client) |
| **Estado client** | TanStack Query |
| **QR codes** | `qrcode` (backend) + `qrcode.react` (frontend) |
| **Mapas** | Leaflet + OpenStreetMap (planejado, sem chave de API) |

### Decisões arquiteturais

- **Sem Prisma** — usamos `supabase-js` diretamente. Migrations gerenciadas
  pelo Supabase CLI (não exige senha do banco em runtime).
- **JWT validado por JWKS** — backend não armazena segredo de auth; valida
  cada request via endpoint público do Supabase.
- **RLS habilitado** em todas as tabelas — segurança em camada de banco.
  Backend usa `service_role` quando precisa bypassar (com cuidado).
- **Stripe mockado** — endpoint `_demo/approve-and-pay` simula aprovação +
  pagamento na demo. Em produção, troca pra Stripe Checkout real.

---

## Estrutura de pastas

```
D:/Github/Buscou-Viajou/
│
├── _context/                       Documentação-fonte (PRD, DS, IA, prompts)
│   ├── PRD_BuscouViajou_v1.md      PRD enterprise (~2700 linhas)
│   ├── README.md                   README original do design system
│   ├── buscou-viajou-design-system.md   Design system completo
│   ├── tokens.css                  CSS custom properties (cópia da fonte)
│   ├── tokens.json                 Tokens em padrão W3C DTCG
│   ├── tailwind.config.js          Config Tailwind (cópia da fonte)
│   ├── buscou-viajou-logo-vectorized.svg   SVG original (3.9MB, auto-trace)
│   ├── gotham-fonts-main/          Pacote Gotham (otf, ttf, web/)
│   ├── brand/                      Assets de marca processados
│   │   ├── NanoBananaV2/           Logos gerados pelo Nano Banana (originais 4-5MB)
│   │   └── final/                  Logos otimizados pra produção (~2MB total)
│   ├── IA/                         Information Architecture
│   │   ├── sitemap.md              Mapa de rotas + perfis + SEO
│   │   ├── user-flows.md           Diagramas Mermaid dos fluxos principais
│   │   ├── states-matrix.md        Catálogo de estados por tela
│   │   └── api-contract.md         Mapa tela ↔ endpoint
│   └── prompts/
│       └── logo-nano-banana.md     Prompts de geração de logo (9 variações)
│
├── BuscouViajouApi/                Backend NestJS
│   ├── src/
│   │   ├── main.ts                 Bootstrap, Swagger, CORS, versioning
│   │   ├── app.module.ts           Root module
│   │   ├── config/env.ts           Loader de env com Zod
│   │   ├── auth/                   Validação JWT via JWKS + decorators
│   │   │   ├── jwks.service.ts
│   │   │   ├── auth.guard.ts       Guard global (com @Public e @OptionalAuth)
│   │   │   ├── auth.controller.ts  GET /v1/auth/me
│   │   │   ├── auth.module.ts
│   │   │   └── decorators.ts       @CurrentUser, @CurrentJwt, @Public, @OptionalAuth
│   │   ├── common/
│   │   │   ├── filters/            ExceptionFilter (RFC 7807)
│   │   │   ├── pipes/              ZodValidationPipe
│   │   │   └── geo/                brazil-cities (geocoder simplificado) + Haversine
│   │   ├── database/
│   │   │   ├── supabase.service.ts Client admin (service_role) + per-user
│   │   │   ├── supabase.module.ts
│   │   │   ├── database.types.ts   Tipos gerados do schema (~1779 linhas)
│   │   │   ├── seed-data.ts        Dados estáticos do seed
│   │   │   └── seed.ts             Script de seed dinâmico
│   │   └── modules/
│   │       ├── health/             GET /v1/health
│   │       ├── cities/             GET /v1/cities/search
│   │       ├── companies/          GET /v1/companies + :id + :id/reviews + :id/vehicles
│   │       ├── vehicles/           GET /v1/vehicles/:id + :id/reviews
│   │       ├── quotes/             POST /v1/quotes (busca + pricing dinâmico)
│   │       ├── bookings/           CRUD + máquina de estados + RN-FIN-002
│   │       └── tickets/            GET /v1/bookings/:id/ticket (QR)
│   ├── scripts/
│   │   ├── smoke-test.sh           Smoke test de todos os endpoints
│   │   └── process-logos.mjs       Otimiza/regenera logos do Nano Banana
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env                        (gitignored) credenciais Supabase
│   └── .env.example
│
├── BuscouViajouFrontend/           Frontend Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          Root layout com QueryProvider
│   │   │   ├── page.tsx            Home (placeholder técnico — sem estilo)
│   │   │   ├── icon.png            Favicon 32×32 (convenção Next.js)
│   │   │   └── apple-icon.png      Apple touch icon 180×180
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts       Browser client
│   │   │   │   ├── server.ts       Server client com cookies
│   │   │   │   └── database.types.ts   Tipos compartilhados (cópia do backend)
│   │   │   ├── api/
│   │   │   │   ├── client.ts       Wrapper fetch com Bearer JWT automático
│   │   │   │   └── types.ts        Tipos das respostas da API
│   │   │   ├── providers/
│   │   │   │   └── query-provider.tsx   TanStack Query
│   │   │   └── utils/
│   │   │       └── cn.ts           clsx + tailwind-merge helper
│   │   └── styles/
│   │       ├── tokens.css          @font-face + CSS custom properties
│   │       └── globals.css         Base CSS
│   ├── public/
│   │   ├── fonts/gotham/           16 woff2 (8 pesos × 2 estilos)
│   │   └── brand/                  12 PNGs+SVG (logos otimizados)
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── next.config.mjs
│   ├── tsconfig.json
│   ├── next-env.d.ts
│   ├── package.json
│   ├── .env.local                  (gitignored)
│   └── .env.example
│
├── supabase/                       CLI Supabase + migrations
│   ├── config.toml                 Config local (não usamos local DB)
│   ├── .gitignore
│   ├── .temp/                      cache do CLI (gitignored)
│   └── migrations/
│       ├── 20260429120000_initial_schema.sql      27 tabelas + enums + triggers
│       ├── 20260429120001_rls_policies.sql        RLS pra todas as tabelas
│       ├── 20260429120002_storage_buckets.sql     6 buckets + policies
│       ├── 20260429120003_seed_static_data.sql    amenities + settings + events
│       └── 20260429120004_fix_handle_new_user.sql Fix do trigger de profile
│
├── claude.md                       ESTE arquivo (visão geral)
├── continuidade.md                 Init de nova sessão (Claude lê em cold start)
└── scanner.md                      Encerramento manual de sessão (você executa)
```

---

## Status atual

| Área | Status |
|---|---|
| **Backend** | ✅ 17 rotas funcionais, smoke test 20/20 OK, Swagger em `/docs` |
| **Banco** | ✅ 27 tabelas + RLS + storage buckets aplicados no Supabase remoto |
| **Seed** | ✅ 8 empresas, 25 veículos, 15 motoristas, 16 reservas, 8 reviews, 6 profiles |
| **Logos** | ✅ 12 assets otimizados em `public/brand/` (38MB → 2MB) |
| **Frontend (setup)** | ✅ Next 15, Tailwind, Gotham local, supabase client, TanStack Query |
| **Frontend (UI)** | ✅ 21 componentes UI + 13 feature + Navbar/Footer |
| **Information Architecture** | ✅ sitemap, user-flows, states-matrix, api-contract documentados |
| **Design DNA** | ✅ `_context/design-dna.json` (720 linhas) + readme |
| **Componentes base** | ✅ Fase 3 — `/dev/components` showcase |
| **Componentes feature** | ✅ Fase 4 — `/dev/feature` showcase |
| **Páginas estilizadas** | ✅ Fase 5 — 9 rotas funcionais com dados reais |
| **UX Polish** | ✅ Fase 6 — responsivo, a11y, motion-reduce |
| **Testes E2E** | ✅ Fase 7 — **28/28** Playwright (smoke/critical/auth/filter/a11y/responsive) |
| **Design Review** | ✅ Fase 8 — `_context/design-review-pass-1.md` + 20 screenshots |
| **Flow Test E2E** | ✅ `_context/flow-test-report.md` — fluxo cliente validado via UI; M5+S9 (bugs descobertos) corrigidos |
| **Painel Empresa** | ⏳ Fase 10 — não implementado (Fase 2 do PRD) |
| **Painel Super Admin** | ⏳ Fase 11 — não implementado (Fase 2 do PRD) |

---

## O que cada documento `.md` significa

### Raiz

| Arquivo | Conteúdo | Quando ler |
|---|---|---|
| **`claude.md`** | Visão geral (este arquivo) | Sempre primeiro em nova sessão |
| **`continuidade.md`** | Init de nova sessão: ordem de leitura obrigatória + status + próximos passos | Cold start de qualquer sessão |
| **`scanner.md`** | Procedimento manual de encerramento: o que atualizar antes de encerrar | Quando você pedir "execute scanner" |

### `_context/`

| Arquivo | Conteúdo |
|---|---|
| `PRD_BuscouViajou_v1.md` | Product Requirements Document completo (~2700 linhas, 132KB). Visão, modelo de negócio, 7 casos de uso (UC-001 a UC-007), 15 telas (§6), API spec (§7), schema SQL completo (§8), 50+ regras de negócio (§12). **Fonte de verdade do produto.** |
| `README.md` | README original do pacote de design system (instruções de instalação dos tokens) |
| `buscou-viajou-design-system.md` | Design System completo (~1200 linhas). Identidade visual, paleta, tipografia, componentes base (botão, card, input...), regras de uso, exemplos de aplicação, 10 lacunas/ambiguidades. **Fonte de verdade visual.** |
| `tokens.css` | Cópia dos CSS custom properties (mesma versão do `BuscouViajouFrontend/src/styles/tokens.css` mas sem `@font-face` da Gotham local — usa Google Fonts) |
| `tokens.json` | Mesmos tokens em padrão W3C DTCG |
| `tailwind.config.js` | Config Tailwind original (sem paths de Next.js) |

### `_context/IA/`

Information Architecture produzida na Fase 1 do plano de frontend.

| Arquivo | Conteúdo |
|---|---|
| `sitemap.md` | Mapa completo de rotas (públicas, auth, super admin), perfis de acesso, SEO, robots.txt, sitemap.xml, estratégia de rendering (Static/ISR/Dynamic), middleware de proteção, hierarquia da Navbar, decisões pendentes |
| `user-flows.md` | 4 fluxos com diagramas Mermaid: (1) anônimo → primeira reserva [crítico], (2) cliente retorna → cancela, (3) auth magic link [técnico], (4) logout. Tabelas de transição com endpoints. Decisões UX. Caminho crítico do `@critical` E2E |
| `states-matrix.md` | Catálogo exaustivo de estados por tela (loading/success/empty/4xx/5xx/edge cases). Voz da marca aplicada. Patterns de skeleton, empty state, error state. Decisões pendentes |
| `api-contract.md` | Mapa tela ↔ endpoint. Padrões de fetch (Server vs Client). Cache config TanStack Query. Tratamento RFC 7807. Deeplinks de demo + credenciais do seed |

### `_context/prompts/`

| Arquivo | Conteúdo |
|---|---|
| `logo-nano-banana.md` | 9 prompts pro Nano Banana (Gemini 2.5 Flash Image): master brief + V1-V5 lockups + 3 monogramas + favicon. Cores hex exatas, anti-references, output specs |

### `_context/brand/`

| Item | Conteúdo |
|---|---|
| `buscou-viajou-logo-vectorized.svg` | SVG original entregue pelo cliente. Auto-trace de 7300 paths, 3.9MB. **Referência visual** — não usar diretamente em produção |
| `NanoBananaV2/` | 9 logos gerados pelo Nano Banana (originais 4-5MB cada). Fonte para reprocessamento via `BuscouViajouApi/scripts/process-logos.mjs` |
| `final/` | 12 assets otimizados (95% redução). Idênticos a `BuscouViajouFrontend/public/brand/` |

### `BuscouViajouApi/`

Backend não tem README dedicado — comportamento documentado via Swagger em `/docs`.

### `BuscouViajouFrontend/`

Frontend não tem README dedicado — está em fase de setup técnico, sem estilização.

### `supabase/`

Migrations seguem ordem cronológica YYYYMMDDHHMMSS. Aplicáveis via `supabase db push --linked`.

---

## Comandos críticos

### Subir backend

```bash
cd D:/Github/Buscou-Viajou/BuscouViajouApi
npm install                    # uma vez
npm run start:dev              # http://localhost:3001 + Swagger em /docs
```

### Subir frontend

```bash
cd D:/Github/Buscou-Viajou/BuscouViajouFrontend
npm install                    # uma vez
npm run dev                    # http://localhost:3000
```

### Smoke test do backend (20/20 OK na última execução)

```bash
# Backend precisa estar rodando em :3001
bash D:/Github/Buscou-Viajou/BuscouViajouApi/scripts/smoke-test.sh
```

### Banco de dados

```bash
cd D:/Github/Buscou-Viajou
supabase migration list --linked            # ver migrations aplicadas
supabase db push --linked                   # aplicar pendentes
echo "SELECT count(*) FROM bookings;" | supabase db query --linked   # SQL ad-hoc
cd BuscouViajouApi && npm run db:seed       # repopular dados
cd BuscouViajouApi && npm run gen:types     # regenerar database.types.ts
```

### Reprocessar logos (caso o Nano Banana V2 mude)

```bash
cd D:/Github/Buscou-Viajou/BuscouViajouApi
node scripts/process-logos.mjs              # gera _context/brand/final/
# Depois copiar pra public/brand/ no frontend
```

---

## Credenciais demo (seed populou)

Senha pra todos: `demo12345` (mas **vamos usar magic link** na demo).

| Perfil | Email |
|---|---|
| Cliente | `cliente1@buscouviajou.demo`, `cliente2@...`, `cliente3@...` |
| Admin Empresa (TransTur SP) | `admin.empresa1@buscouviajou.demo` |
| Admin Empresa (Capital Tour) | `admin.empresa2@buscouviajou.demo` |
| Super Admin | `admin@buscouviajou.demo` |

---

## Ambiente

- **Plataforma:** Windows 11
- **Shell:** bash (via Git Bash) — sintaxe Unix, paths com forward slash
- **Node:** 24.12.0
- **npm:** 11.12.1
- **Supabase CLI:** 2.90.0
- **Projeto Supabase:** `cscblvcqjwxmgzalowop` (BuscouViajou, sa-east-1)
- **JWT:** ES256 com JWKS endpoint público

---

## Próximos passos (alta nível)

Conforme o plano de implementação do frontend:

1. ⏳ **Fase 2** — Design DNA (JSON consultável, próximo passo combinado)
2. ⏳ Fase 3 — Componentes base (Button, Card, Input, Badge, Navbar, Footer, etc.)
3. ⏳ Fase 4 — Componentes de feature (SearchForm, VehicleResultCard, FiltersSidebar...)
4. ⏳ Fase 5 — 5 telas estilizadas (Landing, Resultados, Detalhes, Reserva, Minhas Viagens) + login + callback
5. ⏳ Fase 6 — UX Polish (responsivo, a11y, micro-interações)
6. ⏳ Fase 7 — Testes E2E completos (Playwright)
7. ⏳ Fase 8 — Design Review final

Cada fase com checkpoint pra você aprovar antes da próxima.

---

## Regras estabelecidas com o usuário

> Estas regras foram acordadas e devem ser seguidas em todas as sessões.

1. **Não estilizar nem criar componentes UI sem aprovação explícita.** Setup
   técnico OK; visual depende de "go".
2. **Tudo deve estar funcionando, mesmo na demo** — sem cortar testes E2E.
3. **Magic link** como auth do cliente (Supabase Auth nativo).
4. **Todos os endpoints reais**, sem mock no frontend (backend funcional).
5. **Logos otimizados via estratégia B** já aplicada (Nano Banana + sharp).
6. **Cores oficiais EXATAS:** Navy `#0B2A43`, Green `#2B9366`. Nada de variantes.
7. **Padrão bicolor de títulos:** uma palavra navy, outra green (assinatura visual).
