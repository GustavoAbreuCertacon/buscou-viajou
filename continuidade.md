# Continuidade — Cold start de nova sessão

> Documento que **cada nova sessão** do Claude lê primeiro pra recuperar
> contexto completo do projeto. Lê de cima até o fim **antes** de fazer
> qualquer outra coisa.

---

## ⚠️ REGRAS INEGOCIÁVEIS DE LEITURA

Estas regras são **OBRIGATÓRIAS** ao iniciar uma nova sessão. Não há
exceção — descumprir significa entregar com contexto incompleto e
inventar detalhes.

1. **VOCÊ MESMO lê** cada arquivo da lista abaixo, **do início ao fim**.
2. **NÃO USE** o tool `Agent` (subagentes) para ler estes arquivos.
3. **NÃO USE** chunking ad-hoc por relevância — leia o documento
   **inteiro**, mesmo que tenha 2700 linhas.
4. **NÃO PEÇA** ao Explore agent ou Plan agent pra "resumir" — leia tudo.
5. Para arquivos grandes (PRD, design system): use `Read` com `offset`
   e `limit` em **leituras consecutivas até cobrir o arquivo todo**.
   Nunca pare no meio.
6. **NÃO INVENTE** arquivos, paths, comandos, valores. Se algo não
   estiver documentado, leia mais — ou pergunte ao usuário.
7. Os primeiros arquivos da lista têm **prioridade absoluta**. Os
   últimos podem ser lidos sob demanda quando entrar no tema.

---

## Ordem de leitura obrigatória

Leia nesta ordem. Cada item tem o tamanho aproximado pra você se
preparar pra usar `offset/limit` quando necessário.

### 🔴 Bloco 1 — Visão geral (LEITURA OBRIGATÓRIA NO COLD START)

```
1. claude.md                                      raiz, ~350 linhas
   → Visão geral, stack, estrutura de pastas, status, comandos
```

### 🔴 Bloco 2 — IA + Design DNA (LEITURA OBRIGATÓRIA)

```
2. _context/IA/sitemap.md                         ~190 linhas
3. _context/IA/user-flows.md                      ~210 linhas
4. _context/IA/states-matrix.md                   ~280 linhas
5. _context/IA/api-contract.md                    ~210 linhas
6. _context/design-dna.json                       720 linhas, 32KB
   → JSON consolidado. FONTE ÚNICA de verdade visual.
   → Tem prioridade sobre tokens.css / DS markdown / PRD em conflito.
   → Estrutura: designSystem (tokens) + designStyle (qualitativo) +
     visualEffects + componentRules + writingPatterns + doNotList + accessibility
7. _context/design-dna-readme.md                  ~127 linhas
   → Como consultar/atualizar o design-dna.json. Hierarquia de prioridade.
```

Esses 6 são a **última palavra** sobre rotas, fluxos, estados, contratos e
identidade visual. Não confie em memórias antigas ou no PRD/DS se conflitar
com Bloco 2 — Bloco 2 é mais recente.

### 🟡 Bloco 3 — Fontes de verdade (PRD + Design System)

Tudo abaixo deve ser lido **inteiro** quando você for trabalhar nas
respectivas áreas. No cold start, ler **bloco 3 completo** se for fazer
qualquer trabalho de UI, código de domínio ou regras de negócio.

```
8. _context/PRD_BuscouViajou_v1.md                ~2700 linhas, 132KB
   → Use Read com offset/limit em sequência:
     - offset 1, limit 600
     - offset 601, limit 600
     - offset 1201, limit 600
     - offset 1801, limit 600
     - offset 2401, limit 600
   → Não pare antes de cobrir TUDO

9. _context/buscou-viajou-design-system.md        ~1200 linhas, 48KB
   → Use Read com offset/limit:
     - offset 1, limit 600
     - offset 601, limit 600

10. _context/tokens.css                           ~200 linhas
11. _context/tokens.json                          ~270 linhas
12. _context/tailwind.config.js                   ~150 linhas
```

### 🟢 Bloco 4 — Estado do código (LEITURA OBRIGATÓRIA)

```
Backend NestJS:
13. BuscouViajouApi/package.json
14. BuscouViajouApi/src/main.ts
15. BuscouViajouApi/src/app.module.ts
16. BuscouViajouApi/src/auth/auth.guard.ts
17. BuscouViajouApi/src/auth/jwks.service.ts
18. BuscouViajouApi/src/auth/auth.controller.ts
19. BuscouViajouApi/src/auth/decorators.ts
20. BuscouViajouApi/src/database/supabase.service.ts
21. BuscouViajouApi/src/common/filters/all-exceptions.filter.ts
22. BuscouViajouApi/src/common/pipes/zod-validation.pipe.ts
23. BuscouViajouApi/src/common/geo/brazil-cities.ts
24. BuscouViajouApi/src/modules/quotes/quotes.dto.ts
25. BuscouViajouApi/src/modules/quotes/quotes.service.ts
26. BuscouViajouApi/src/modules/bookings/bookings.dto.ts
27. BuscouViajouApi/src/modules/bookings/bookings.service.ts
28. BuscouViajouApi/src/modules/tickets/tickets.controller.ts
29. BuscouViajouApi/scripts/smoke-test.sh
30. BuscouViajouApi/scripts/process-logos.mjs
31. BuscouViajouApi/src/database/seed.ts
32. BuscouViajouApi/src/database/seed-data.ts

Frontend Next.js:
33. BuscouViajouFrontend/package.json
34. BuscouViajouFrontend/tsconfig.json
35. BuscouViajouFrontend/tailwind.config.js
36. BuscouViajouFrontend/next.config.mjs
37. BuscouViajouFrontend/src/app/layout.tsx
38. BuscouViajouFrontend/src/app/page.tsx
39. BuscouViajouFrontend/src/styles/tokens.css
40. BuscouViajouFrontend/src/styles/globals.css
41. BuscouViajouFrontend/src/lib/supabase/client.ts
42. BuscouViajouFrontend/src/lib/supabase/server.ts
43. BuscouViajouFrontend/src/lib/api/client.ts
44. BuscouViajouFrontend/src/lib/api/types.ts
45. BuscouViajouFrontend/src/lib/providers/query-provider.tsx
46. BuscouViajouFrontend/src/lib/utils/cn.ts

Banco:
47. supabase/config.toml
48. supabase/migrations/20260429120000_initial_schema.sql
49. supabase/migrations/20260429120001_rls_policies.sql
50. supabase/migrations/20260429120002_storage_buckets.sql
51. supabase/migrations/20260429120003_seed_static_data.sql
52. supabase/migrations/20260429120004_fix_handle_new_user.sql
```

### 🔵 Bloco 5 — Sob demanda (NÃO precisa cold start)

Estes arquivos só leem quando entrar no tema específico:

```
- _context/prompts/logo-nano-banana.md             quando regerar logos
- BuscouViajouApi/src/database/database.types.ts   ~1779 linhas, gerado
- _context/brand/buscou-viajou-logo-vectorized.svg 3.9MB, NÃO ler como texto
- _context/gotham-fonts-main/                      assets de fonte, NÃO ler
- BuscouViajouFrontend/src/lib/supabase/database.types.ts  cópia do backend
```

---

## Ferramentas que VOCÊ pode usar (sem subagente)

| Tool | Uso permitido |
|---|---|
| `Read` | ✅ obrigatório pra cada arquivo da lista |
| `Glob` | ✅ pra confirmar quais arquivos existem |
| `Grep` | ✅ pra buscar referências dentro do código já lido |
| `Bash` | ✅ pra rodar comandos (start dev, smoke test, etc.) |
| `Edit` / `Write` | ✅ pra modificar arquivos |
| `TaskCreate` / `TaskUpdate` | ✅ pra tracking interno |

## Ferramentas que VOCÊ **NÃO** usa em cold start

| Tool | Por quê |
|---|---|
| `Agent` (qualquer subagent_type) | A leitura precisa entrar no SEU contexto, não num subagente |
| Plan agent / Explore agent / general-purpose | Mesmo motivo |

> **Exceção:** se o usuário pedir explicitamente um plano paralelo via
> `scanner.md` no encerramento, aí sim subagentes são autorizados — mas
> nunca pra leitura inicial de cold start.

---

## Sequência de execução depois de ler tudo

1. ✅ Confirme em uma frase que leu **todos** os blocos 1, 2, 3 e 4.
2. ✅ Liste pra você mesmo: o que está pronto, o que falta, qual a fase
   atual do plano de implementação do frontend (ver final do `claude.md`).
3. ✅ Verifique status do backend e do banco se for relevante:
   ```bash
   curl -s http://localhost:3001/v1/health     # se backend deveria estar up
   ```
4. ✅ Pergunte ao usuário onde quer continuar, sem assumir.

---

## Status atual da sessão anterior

Quando uma sessão termina, ela atualiza esta seção via `scanner.md`.
**Esta é a última verdade conhecida.** Confirme com o usuário se
mudou desde então.

### Última atualização

`2026-04-30` — fim da sessão de implementação completa do fluxo do cliente.

### O que está pronto

- ✅ Reorganização do repo em `_context/`, `BuscouViajouApi/`, `BuscouViajouFrontend/`
- ✅ Decisão de stack: NestJS + Supabase + Next.js + Tailwind + Gotham local
- ✅ Setup técnico do frontend (Next 15, tokens, fontes Gotham, Supabase clients,
  TanStack Query, API client, tipos compartilhados) — **sem componentes UI nem
  páginas estilizadas**
- ✅ Backend NestJS com 17 rotas + Swagger + JWKS auth
- ✅ Migrations Supabase: 27 tabelas + RLS + 6 storage buckets + seed estático
- ✅ Seed dinâmico aplicado: 8 empresas, 25 veículos, 15 motoristas, 16 reservas,
  8 reviews, 6 profiles
- ✅ Smoke test do backend: **20/20 endpoints OK** (`scripts/smoke-test.sh`)
- ✅ Logos: 12 assets otimizados (`public/brand/`, total 2MB)
- ✅ Information Architecture documentada (4 docs em `_context/IA/`)
- ✅ Prompts pro Nano Banana documentados (`_context/prompts/logo-nano-banana.md`)
- ✅ Documentos de continuidade (este, `claude.md`, `scanner.md`)
- ✅ **Fase 2 — Design DNA** consolidado em `_context/design-dna.json`
  (720 linhas, JSON parseable) + `_context/design-dna-readme.md` (guia de uso)
- ✅ **Fase 3 — Componentes base** (21 componentes UI) em
  `BuscouViajouFrontend/src/components/ui/` — Button, Card, Input,
  Textarea, Select, Checkbox, Radio, Stepper, DatePicker, StarRating,
  Badge, JourneyTag, BicolorHeading, Skeleton, Dialog, Sheet, Tooltip,
  Toaster, Logo, Label + Navbar/Footer em `components/layout/` + showcase
  em `/dev/components`
- ✅ **Fase 4 — Componentes de feature** (13 componentes) em
  `components/feature/` — PricingBadge, AmenityGrid, ReviewCard,
  BookingStatusBadge, CityAutocomplete, SearchForm, VehicleResultCard,
  FiltersSidebar, SortBar, BookingCard, VehicleGallery, PriceBreakdown,
  RouteMap (Leaflet), TicketViewer + showcase em `/dev/feature`
- ✅ **Fase 5 — 9 telas estilizadas e funcionais** end-to-end com dados
  reais do backend + Supabase Auth: `/`, `/busca`, `/veiculo/[id]`,
  `/login`, `/auth/callback`, `/auth/erro`, `/minhas-viagens`,
  `/reserva/[id]`, `/404`, `/error.tsx`, `robots.ts`, `sitemap.ts`,
  middleware de proteção
- ✅ **Fase 6 — UX Polish** — responsivo desktop+mobile, logo monograma
  em mobile, hero text adaptativo, skip-link a11y, motion-reduce hover
- ✅ **Fase 7 — Testes E2E Playwright** — **28/28 passando** em 46s.
  Suítes @smoke (7), @critical (4), @auth (5), @filter (3), @a11y axe-core (5),
  @responsive (4)

### O que está pendente

- ⏳ **Fase 8 — Design Review** (próximo passo combinado) — auditoria
  contra os 18 "do not" do `design-dna.json` + checklist do
  `buscou-viajou-design-system.md` §12.1
- ⏳ Fase 4 — Componentes de feature (SearchForm, VehicleResultCard,
  FiltersSidebar, SortBar, PricingBadge, VehicleGallery, PriceBreakdown,
  AmenityGrid, RouteMap, ReviewCard, BookingStatusBadge, BookingCard,
  TicketViewer)
- ⏳ Fase 5 — Páginas estilizadas (`/`, `/busca`, `/veiculo/[id]`, `/login`,
  `/auth/callback`, `/auth/erro`, `/minhas-viagens`, `/reserva/[id]`)
- ⏳ Fase 6 — UX Polish (responsivo desktop+mobile, a11y WCAG AA, motion)
- ⏳ Fase 7 — Testes E2E completos (Playwright com tags `@smoke`,
  `@critical`, `@auth`, `@filter`, `@a11y`, `@error-handling`, `@responsive`)
- ⏳ Fase 8 — Design Review final

---

## Tarefas em aberto (TaskList do agente)

Sempre verifique o estado real via `TaskList` — esta lista pode estar
defasada se a sessão for muito posterior.

```
#5-#37 [todas completed] — Fases 1 a 7 do plano frontend completas
                          + reorganização, backend, migrations, seed,
                          smoke test, logos otimizados, IA, Design DNA,
                          componentes base, feature, telas estilizadas,
                          UX polish, testes E2E (28/28).

Próxima tarefa pendente: criar #38 quando iniciar Fase 8 — Design Review.
```

---

## Onde retomar

A próxima ação acordada é **Fase 8 do plano de frontend — Design Review**:
auditoria contra os 18 "do not" do `_context/design-dna.json` + checklist
do `_context/buscou-viajou-design-system.md` §12.1, gerando relatório de
achados e fixes em `_context/design-review-pass-1.md`.

Demo está **100% navegável end-to-end** com:
- Backend NestJS rodando 17 endpoints (smoke test 20/20 OK)
- Frontend Next.js 15 com 9 telas funcionais + 2 showcase (`/dev/components`, `/dev/feature`)
- 28/28 testes E2E passando
- Login programático com `cliente1@buscouviajou.demo` / `demo12345`

Pergunte ao usuário se quer Fase 8 ou outra prioridade.

---

## Regras de comportamento estabelecidas com o usuário

Estas foram acordadas durante a sessão de setup. **Não infrinja sem
permissão explícita.**

| # | Regra |
|---|---|
| 1 | Antes de iniciar **estilização visual** (componentes UI ou páginas), aguardar confirmação explícita do usuário |
| 2 | Demo deve estar **100% funcional** end-to-end, mesmo sendo demo (sem cortar testes E2E) |
| 3 | **Magic link** via Supabase Auth (não SMS, não senha) |
| 4 | Frontend chama **endpoints reais** do backend; sem mock de dados no front |
| 5 | Cores oficiais EXATAS: Navy `#0B2A43`, Green `#2B9366` |
| 6 | **Padrão bicolor** em títulos: uma palavra navy, outra green |
| 7 | Backend usa `supabase-js` (sem Prisma); migrations via Supabase CLI |
| 8 | Logos PNG otimizados via estratégia B (sharp) — **não regerar sem necessidade** |
| 9 | Voz da marca: simples, direta, otimista; verbos de jornada nos CTAs |
| 10 | Não inventar dados, paths, valores. Quando em dúvida, ler ou perguntar |

---

## Comandos pra confirmar saúde do ambiente

```bash
# Verifica que está logado no Supabase
supabase projects list

# Verifica migrations aplicadas no remoto
cd D:/Github/Buscou-Viajou && supabase migration list --linked

# Conta registros (sanidade)
echo "SELECT (SELECT count(*) FROM companies) AS companies, (SELECT count(*) FROM vehicles) AS vehicles, (SELECT count(*) FROM bookings) AS bookings;" | supabase db query --linked

# Backend (em outro terminal)
cd D:/Github/Buscou-Viajou/BuscouViajouApi && npm run start:dev

# Smoke test
bash D:/Github/Buscou-Viajou/BuscouViajouApi/scripts/smoke-test.sh
```

---

## Se algo der errado

1. **Backend não sobe** — checar `BuscouViajouApi/.env` (URL, anon, service_role)
2. **Frontend não compila** — checar `BuscouViajouFrontend/.env.local`
3. **Migration falha** — verificar `supabase migration list --linked`,
   confirmar permissões no projeto
4. **Auth quebrada** — confirmar que o JWKS endpoint responde:
   `curl https://cscblvcqjwxmgzalowop.supabase.co/auth/v1/.well-known/jwks.json`
5. **Logos sumiram** — reprocessar via
   `cd BuscouViajouApi && node scripts/process-logos.mjs`
   e copiar de `_context/brand/final/` pra `BuscouViajouFrontend/public/brand/`

---

## Proibições reforçadas pra cold start

❌ Não use **subagente nenhum** pra ler os arquivos das listas acima
❌ Não pule arquivos do bloco 1, 2 ou 4
❌ Não invente conteúdo de arquivo que ainda não leu
❌ Não modifique código antes de ler `claude.md` + bloco 2 inteiro
❌ Não inicie estilização sem o usuário confirmar Fase 5
❌ Não delete arquivos sem o usuário confirmar
❌ Não rode `supabase db reset` (apaga banco)

✅ Pode rodar comandos read-only (status, list, query SELECT)
✅ Pode iniciar/parar o backend local (porta 3001)
✅ Pode iniciar/parar o frontend local (porta 3000)
✅ Pode rodar smoke test sempre
