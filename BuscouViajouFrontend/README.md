# Buscou Viajou — Frontend

Aplicação web do marketplace de fretamento turístico Buscou Viajou. Cliente Next.js 15 (App Router) que consome a API NestJS via REST autenticada com JWT do Supabase, exibe busca de cotações, detalhes de veículo, fluxo de reserva e bilhete digital com QR Code.

## Stack

Conforme `package.json`:

- **Next.js** 15.1.x com App Router e React 19
- **TypeScript** 5.7
- **Tailwind CSS** 3.4 + `tailwindcss-animate`, `tailwind-merge`, `class-variance-authority`, `clsx`
- **Supabase** — `@supabase/ssr` 0.5 e `@supabase/supabase-js` 2.46 (auth + cookies SSR)
- **TanStack Query** 5.62 (`@tanstack/react-query`)
- **Radix UI** — checkbox, dialog, label, popover, radio-group, select, slot, tooltip
- **Leaflet** 1.9 + `react-leaflet` 5 (mapa de rota)
- **lucide-react** (ícones), **sonner** (toasts), **react-day-picker** (date picker), **qrcode.react** (bilhete), **date-fns** 4, **zod** 3
- Fonte **Gotham** (heading) e Hind (body) — configuradas em `tailwind.config.js` (arquivos de fonte: não documentado — verificar; o diretório `public/fonts/` não existe no momento)
- **Playwright** 1.59 + `@axe-core/playwright` (E2E + a11y)

## Como rodar local

1. Crie `.env.local` na raiz com as variáveis de `.env.example`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://cscblvcqjwxmgzalowop.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

2. Instale dependências e suba o dev server:

   ```bash
   npm install
   npm run dev
   ```

   App em `http://localhost:3000`. Backend NestJS deve estar em `http://localhost:3001` (configurável por `NEXT_PUBLIC_API_URL`).

Scripts auxiliares (do `package.json`):

- `npm run lint` — `next lint`
- `npm run type-check` — `tsc --noEmit`

## Estrutura de pastas

```
src/
  app/                   # Rotas (App Router) + layout.tsx + middleware
  components/
    ui/                  # Primitivos do design system (barrel em index.ts)
    feature/             # Componentes de domínio (barrel em index.ts)
    layout/              # navbar, footer
  lib/
    api/                 # client.ts (browser fetch + Bearer), server.ts (SSR fetch), types.ts
    supabase/            # client.ts (browser), server.ts (cookies SSR), database.types.ts (gerado)
    auth/                # get-current-user.ts (Server Component helper)
    providers/           # query-provider.tsx (TanStack Query)
    utils/               # cn.ts (tailwind-merge custom), format.ts (BR formatters)
  styles/                # globals.css, tokens.css
  middleware.ts          # Proteção de rotas + refresh de cookies Supabase
public/
  brand/                 # Logos e favicons
tests/
  e2e/                   # Playwright specs
```

Aliases TS: `@/*` → `./src/*` (`tsconfig.json`).

## Rotas (`src/app/`)

- `/` — `page.tsx` — Home com hero, seções "Em 3 passos", "Princípios" e CTA. Lê `getCurrentUser()` SSR para Navbar.
- `/busca` — `busca/page.tsx` — Resultados de busca de cotações (não documentado em detalhe — verificar).
- `/veiculo/[id]` — Detalhe do veículo (não documentado em detalhe — verificar).
- `/minhas-viagens` — Lista de reservas do cliente. Rota protegida (middleware redireciona pra `/login` sem sessão).
- `/reserva/[id]` — Detalhe / fluxo de uma reserva. Rota protegida.
- `/login` — Login Supabase (magic link). Public-only (logado é redirecionado pra `/minhas-viagens`).
- `/auth/erro` — Página de erro de autenticação.
- `/dev/components` — Showcase dos componentes UI primitivos.
- `/dev/feature` — Showcase dos componentes de feature.

Middleware (`src/middleware.ts`):

- Protege prefixos `/minhas-viagens`, `/reserva`, `/conta` (redirect → `/login?next=...`)
- Public-only `/login` (redirect → `/minhas-viagens` se logado)
- Atualiza cookies de sessão Supabase a cada request
- Matcher exclui `/api`, `/_next`, `/favicon.ico`, `/robots.txt`, `/sitemap.xml`, `/brand`, `/fonts`

## Componentes UI (`src/components/ui/`)

Exportados via `src/components/ui/index.ts`:

- `Button` (+ `buttonVariants`, `ButtonProps`)
- `Badge` (+ `badgeVariants`, `BadgeProps`)
- `Skeleton` (+ `SkeletonProps`)
- `Logo`
- `Label`
- `Input` (+ `InputProps`)
- `Textarea` (+ `TextareaProps`)
- `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectLabel`, `SelectSeparator`
- `Checkbox`
- `RadioGroup`, `RadioItem`
- `Stepper` (+ `StepperProps`)
- `DatePicker` (+ `DatePickerProps`)
- `StarRating` (+ `StarRatingProps`)
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` (+ `cardVariants`, `CardProps`)
- `BicolorHeading`, `BicolorHighlight` (+ `BicolorHeadingProps`)
- `JourneyTag` (+ `JourneyTagProps`)
- `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`
- `Sheet`, `SheetTrigger`, `SheetClose`, `SheetPortal`, `SheetOverlay`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`
- `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent`, `SimpleTooltip`
- `Toaster`, `toast`

## Componentes feature (`src/components/feature/`)

Exportados via `src/components/feature/index.ts`:

- `PricingBadge` (+ `PricingIndicator`)
- `AmenityGrid`
- `ReviewCard` (+ `ReviewCardProps`)
- `BookingStatusBadge`
- `CityAutocomplete`
- `SearchForm` (+ `SearchFormValues`)
- `VehicleResultCard`
- `FiltersSidebar` (+ `applyFilters`, `defaultFilters`, `FiltersState`)
- `SortBar` (+ `sortResults`, `SortKey`)
- `BookingCard` (+ `BookingCardData`)
- `VehicleGallery`
- `PriceBreakdown`
- `RouteMap` (+ `RouteMapProps`) — wrapper SSR-safe; `route-map.client.tsx` é o Leaflet
- `TicketViewer` (+ `TicketViewerProps`)

Componentes de layout (`src/components/layout/`): `Navbar`, `Footer`.

## Tokens, fontes e logos

- **Tokens de design** — `tailwind.config.js` define paleta `bv.*` (navy, green, bg, grid, escalas 50–900, success/info/warning/danger), `fontFamily` (`heading: Gotham`, `body: Hind`), escala tipográfica (`display`, `h1`–`h4`, `body-lg`, `body`, `body-sm`, `caption`), spacing `bv-1` a `bv-9`, raios `bv-sm/md/lg/pill`, sombras `bv-sm/md/lg/focus`, `backgroundImage.bv-grid` e utilitários custom `.bv-canvas` e `.bv-frame-corner`.
- **CSS global** — `src/styles/globals.css` e `src/styles/tokens.css` (importado em `src/app/layout.tsx` via `@/styles/globals.css`).
- **Logos / favicons** — `public/brand/`:
  - `logo-full-color.svg`, `logo-black.png`, `logo-white.png`, `logo-white-on-green.png`, `logo-white-on-navy.png`
  - `monogram-bv-full-color.png`, `monogram-bv-black.png`, `monogram-bv-white.png`
  - `favicon-16.png`, `favicon-32.png`, `favicon-180.png`, `favicon-512.png`
- **Fontes** — diretório `public/fonts/` não foi encontrado (não documentado — verificar). O matcher do middleware já exclui `/fonts`.

Domínios remotos liberados em `next.config.mjs` para `next/image`: `images.unsplash.com`, `placehold.co`, `cscblvcqjwxmgzalowop.supabase.co`.

## Gerar tipos do banco

Script `gen:types` do `package.json`:

```bash
npm run gen:types
```

Internamente: `cd .. && supabase gen types typescript --linked --schema public > BuscouViajouFrontend/src/lib/supabase/database.types.ts`.

Requer Supabase CLI instalado e o projeto linkado (`supabase link`) na pasta-mãe do monorepo. O arquivo gerado é consumido por `src/lib/supabase/{client,server}.ts` via `Database` genérico.

## Testes E2E

Configuração em `playwright.config.ts`:

- `testDir: ./tests/e2e`
- `baseURL` padrão `http://localhost:3000` (override por `E2E_BASE_URL`)
- Locale `pt-BR`, timezone `America/Sao_Paulo`
- Projetos: `chromium` (Desktop Chrome) e `mobile-safari` (iPhone 13, restrito a `@responsive|@smoke|@critical`)
- `webServer`: em CI roda `npm run start`; local roda `npm run dev` reaproveitando se já estiver no ar
- CI: 2 retries, 2 workers, reporter `github`; local: 0 retries, reporter `list`

### Como rodar

```bash
npx playwright test                            # tudo
npx playwright test --grep @smoke              # smoke
npx playwright test --grep "@critical|@auth"   # essenciais
```

### Tags disponíveis (do header de `playwright.config.ts`)

- `@smoke` — sanity checks rápidos (<30s)
- `@critical` — fluxo cliente completo (<2min)
- `@auth` — magic link / sessão / logout
- `@filter` — filtros e ordenação em `/busca`
- `@a11y` — axe-core scan WCAG AA
- `@responsive` — viewports mobile/tablet/desktop
- `@error` — error states / cidade inválida / etc.

### Specs (`tests/e2e/`)

- `smoke.spec.ts`, `critical.spec.ts`, `auth.spec.ts`, `filters.spec.ts`, `a11y.spec.ts`, `responsive.spec.ts`
- Page Objects: `pages/home-page.ts`, `pages/search-page.ts`
- Helpers: `helpers/auth.ts`

## Build de produção

```bash
npm run build
npm run start
```

`next build` + `next start` (porta padrão 3000). `reactStrictMode: true` em `next.config.mjs`. Em CI, o `webServer` do Playwright usa `npm run start` com timeout de 120s.

---

## Notas de arquitetura

- **Auth** — `src/lib/supabase/client.ts` (browser, `createBrowserClient`) e `server.ts` (Server Component, `createServerClient` lendo `cookies()`). `src/lib/auth/get-current-user.ts` retorna `CurrentUser | null` lendo `auth.getUser()` + `profiles` (campos `first_name`, `last_name`, `role`, `company_id`, `avatar_url`).
- **Fetch da API** — `src/lib/api/client.ts` (browser, anexa Bearer do `auth.getSession()`) e `src/lib/api/server.ts` (SSR, suporta `cache` e `revalidate`). Ambos lançam `ApiError` (formato RFC 7807: `title`, `detail`, `errors`, `error_id`).
- **Tipos compartilhados** — `src/lib/api/types.ts` define `CityHit`, `QuoteSearchInput`, `QuoteResultItem`, `QuoteSearchResponse`, `BookingStatus`, `Profile`.
- **TanStack Query** — `src/lib/providers/query-provider.tsx` envolve a árvore com `staleTime: 30s`, `retry: 1`, `refetchOnWindowFocus: false`.
- **`cn` util** — `src/lib/utils/cn.ts` usa `extendTailwindMerge` registrando o grupo `font-size` com tokens do DS (`text-display`, `text-h1`...`text-caption`) pra evitar colisão com `text-white`.
- **Formatters BR** — `src/lib/utils/format.ts`: `formatCurrency`, `formatDistance`, `formatDuration`, `formatRating`, `formatDate`, `formatDateLong`, `formatTime`, `formatDateTime`, `formatRelativeDay`, `formatTimeFromNow`, `pluralReviews`, `pluralCapacity`, `VEHICLE_TYPE_LABEL`.
