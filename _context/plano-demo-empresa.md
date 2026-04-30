# Plano — Demo Apresentável da Empresa Parceira

> Painel da empresa parceira no escopo "Demo Apresentável" — segundo lado do
> marketplace, complementando o fluxo do cliente já entregue.
>
> **Estimativa total:** 24-30h (~3-4 dias de trabalho contínuo).
> **Premissas:** demo com dados reais do seed (8 empresas, 25 veículos, 16
> reservas), sem CRUD pesado, sem Stripe Connect real, sem disputas.

---

## 0. Objetivo + escopo

**O que a empresa parceira vai conseguir fazer na demo:**

1. ✅ Logar com email + senha (não magic link como cliente)
2. ✅ Ver dashboard com KPIs reais agregados do DB
3. ✅ Listar e gerenciar reservas (Aprovar / Recusar / Iniciar / Concluir)
4. ✅ Ver detalhe de reserva com timeline + cliente + valor de repasse
5. ✅ Listar frota completa (read-only) com galeria de fotos
6. ✅ Listar motoristas (read-only) com CNH e contato
7. ✅ Listar garagens com mini-mapa Leaflet
8. ✅ Listar avaliações de clientes + responder publicamente

**O que NÃO entra (vira backlog Fase 11+):**

- ❌ CRUD de criação/edição de veículos/motoristas/garagens
- ❌ Upload de fotos pra Storage
- ❌ Repasses Stripe Connect (mock no dashboard)
- ❌ Disputas (UC-004)
- ❌ Roles COMPANY_OPERATOR e COMPANY_FINANCIAL (só COMPANY_ADMIN)
- ❌ Validação de docs vencidos (RN-SEC-001)
- ❌ Painel Super Admin (Fase 11)

**Princípios de design:**

- Reusa 100% do design system + componentes UI existentes (Card, Button, Badge,
  Dialog, Sheet, etc.)
- Mantém DNA visual: bicolor headings, tokens, voz da marca
- Sidebar lateral persistente (padrão dashboards SaaS — Stripe, Linear)
- Não mexe no fluxo cliente — deve continuar 100% funcional

---

## 1. Arquitetura

### Auth

**Mudança no `/login`:**
- Adicionar toggle "Cliente / Empresa" ou detectar por email pattern
- Cliente: continua magic link via `signInWithOtp` (1 etapa email)
- Empresa: usa `signInWithPassword` (email + senha)
- Pós-login server-side: ler `profile.role` e redirecionar:
  - `CLIENT` → `/minhas-viagens`
  - `COMPANY_ADMIN` → `/painel`

**Middleware:**
```ts
PROTECTED_PREFIXES = ['/minhas-viagens', '/reserva', '/conta'];
PROTECTED_COMPANY_PREFIXES = ['/painel'];

if (isProtectedCompany && (!user || profile.role !== 'COMPANY_ADMIN')) {
  return redirect('/login?next=...');
}
```

### Backend RBAC

Adicionar decorator `@RequireRole(...)`:
```ts
@RequireRole('COMPANY_ADMIN')  // só company admin acessa
@Get('company/bookings')
async getCompanyBookings(@CurrentUser() user) { ... }
```

Implementação: AuthGuard estende verificação — busca `profile.role` do user
autenticado e compara com required.

### Database

**Já existe** nas migrations:
- `profiles.role` enum com `COMPANY_ADMIN`
- `profiles.company_id` FK
- 2 usuários no seed: `admin.empresa1@...` (TransTur SP) e `admin.empresa2@...` (Capital Tour)
- RLS policies linhas 157-163, 220-226 do `rls_policies.sql`

**Nada a adicionar no schema.**

---

## 2. Fases de execução

### Fase 10.1 — Backend foundation (3-4h)

**Tasks:**
- [ ] Decorator `@RequireRole(...roles)` + `RoleGuard` complementando AuthGuard
- [ ] Buscar role do profile no AuthGuard (cache por request)
- [ ] Module `CompanyModule` com `CompanyController` + `CompanyService`
- [ ] `GET /v1/company/dashboard` — KPIs agregados:
  - Faturamento últimos 30 dias (sum total_price WHERE status COMPLETED)
  - Reservas ativas (count WHERE status IN PENDING_APPROVAL, CONFIRMED, IN_PROGRESS)
  - Nota média (AVG rating das reviews da empresa)
  - Repasses pendentes (sum company_payout WHERE status COMPLETED AND payout_status PENDING)
  - Histórico 30 dias por dia (pra gráfico line)
  - Ocupação por veículo (count bookings agrupado por vehicle_id)
- [ ] `GET /v1/company/bookings?status=...` — lista filtrada por company_id
  - Inclui client (nome + initial), vehicle, driver
  - Suporta filtro `?status=PENDING_APPROVAL,CONFIRMED,...`
- [ ] `GET /v1/company/bookings/:id` — detalhe da reserva da empresa
- [ ] `GET /v1/company/vehicles` — frota da empresa (com photos + amenities)
- [ ] `GET /v1/company/drivers` — motoristas
- [ ] `GET /v1/company/garages` — garagens com lat/lng
- [ ] `GET /v1/company/reviews?has_response=...` — avaliações da empresa

**Arquivos:**
```
BuscouViajouApi/src/
├── auth/role.guard.ts          (novo)
├── auth/decorators.ts           (adiciona @RequireRole)
└── modules/company/
    ├── company.module.ts        (novo)
    ├── company.controller.ts    (novo, ~150 linhas)
    └── company.service.ts       (novo, ~250 linhas)
```

**Validação:**
- Smoke test: login admin.empresa1 + GET dashboard retorna números > 0
- Smoke test: GET bookings retorna 4 reservas (TransTur SP)
- Smoke test: outro user não admin → 403 Forbidden

---

### Fase 10.2 — Backend operações (3-4h)

**Tasks:**
- [ ] DTO `ApproveBookingSchema { driverId: uuid }` e `RejectBookingSchema { reason: string min 5 max 500 }`
- [ ] `POST /v1/bookings/:id/approve` (auth empresa): valida transição PENDING_APPROVAL → CONFIRMED, atribui driver_id, mock Stripe payment intent (igual `_demo/approve-and-pay` mas separado)
- [ ] `POST /v1/bookings/:id/reject` (auth empresa): PENDING_APPROVAL → REJECTED, registra rejection_reason
- [ ] `POST /v1/bookings/:id/start` (auth empresa): CONFIRMED → IN_PROGRESS, registra actual_start_at
- [ ] `POST /v1/bookings/:id/complete` (auth empresa): IN_PROGRESS → PENDING_COMPLETION, registra actual_end_at, agenda payout em D+15
- [ ] `POST /v1/reviews/:id/respond` (auth empresa): cria registro em `review_responses`, valida que review é da empresa logada
- [ ] Verificação em todos: `booking.company_id === profile.company_id` (autorização horizontal)

**Arquivos:**
```
BuscouViajouApi/src/modules/bookings/
├── bookings.controller.ts       (adiciona 4 endpoints)
├── bookings.dto.ts              (adiciona ApproveBookingSchema, RejectBookingSchema)
└── bookings.service.ts          (adiciona approve, reject, start, complete)
```

**Validação:**
- Smoke test estendido: admin TransTur aprova reserva pendente → status muda
- Smoke test: tentar aprovar reserva de OUTRA empresa → 403
- Smoke test: tentar IN_PROGRESS direto de PENDING_APPROVAL → 422 (transição inválida)

---

### Fase 10.3 — Auth + Layout frontend (2-3h)

**Tasks:**
- [ ] `LoginForm` aceitar password mode com toggle "Sou empresa parceira"
- [ ] `signInWithPassword` quando empresa
- [ ] Após login, server-side ler profile.role e usar `redirect()` do Next baseado em role
- [ ] Middleware: adicionar `PROTECTED_COMPANY_PREFIXES = ['/painel']` + check role
- [ ] `/painel/layout.tsx` — sidebar persistente com:
  - Logo BV
  - Avatar empresa (TransTur SP)
  - Nav links: Dashboard, Reservas, Frota, Motoristas, Garagens, Avaliações
  - Botão Sair no fim
- [ ] Helper `getCurrentCompany()` em `/lib/auth/get-current-company.ts` — retorna profile + company joined
- [ ] Layout responsivo: sidebar vira sheet em mobile

**Componentes UI novos (~3 componentes):**
- `<SidebarNav>` — nav lateral com active state
- `<RoleBadge>` — badge mostrando "Empresa Parceira" no avatar
- `<EmptyPanelState>` — empty state genérico do painel

**Arquivos:**
```
BuscouViajouFrontend/src/
├── app/login/login-form.tsx     (modificar)
├── app/painel/
│   ├── layout.tsx               (novo)
│   └── _components/
│       └── sidebar-nav.tsx      (novo)
├── lib/auth/get-current-company.ts (novo)
├── middleware.ts                (modificar)
└── components/ui/role-badge.tsx (novo)
```

---

### Fase 10.4 — Telas Reservas (8-10h)

**Tela mais importante. Recebe maior atenção visual.**

#### `/painel` — Dashboard (3h)

**Componentes novos:**
- `<KpiCard>` — label uppercase + valor grande tabular-nums + delta% (+/-) verde/vermelho + ícone
- `<MiniLineChart>` — Recharts line, 30 pontos, sem axis labels (sparkline)
- `<MiniBarChart>` — barras horizontais com label inline

**Layout:**
```
┌──────────────────────────────────────────────┐
│ Bicolor heading: "Bem-vindo, TransTur SP"    │
│ Subtitle: "Aqui está o resumo do seu negócio"│
├──────────────────────────────────────────────┤
│ [Faturamento R$X][Confirmadas X][Nota X][Repasses pendentes R$X] │
├──────────────────────────────────────────────┤
│ [Mini chart: Faturamento 30d][Mini chart: Ocupação por veículo] │
├──────────────────────────────────────────────┤
│ Últimas 5 reservas (lista compacta + Ver todas →) │
└──────────────────────────────────────────────┘
```

#### `/painel/reservas` — Listagem (4h)

**Componentes novos:**
- `<DataTable>` — tabela genérica responsive (vira cards em mobile) com colunas tipadas
- `<BookingActionsCell>` — célula com botão contextual baseado em status

**Layout:**
- Tabs scroll horizontal: "Novas (X)" | "Confirmadas (X)" | "Em andamento (X)" | "Concluídas (X)" | "Outras (X)"
- Tabela: Código, Cliente, Rota, Data, Veículo, Motorista, Valor (R$), Status, Ações
- Filtros inline: período, busca por código/cliente
- Ações por linha:
  - PENDING_APPROVAL → "Aprovar" (modal) | "Recusar" (modal)
  - CONFIRMED → "Registrar embarque"
  - IN_PROGRESS → "Registrar conclusão"
- Click na linha → `/painel/reservas/[id]`

**Modais:**
- `<ApproveBookingDialog>` — Title bicolor + select motorista (cards com avatar) + botão Confirmar
- `<RejectBookingDialog>` — Title + Textarea reason min 5 + botão Confirmar Recusa (danger)

#### `/painel/reservas/[id]` — Detalhe (3h)

**Componentes:**
- Reusa `BookingStatusBadge` da feature
- `<BookingTimeline>` — vertical timeline com events (Solicitada → Aprovada → Paga → Em viagem → Concluída)

**Layout:**
- Header: bicolor heading da rota + status badge + data
- 2 colunas:
  - Esquerda: Cliente (nome + passageiros), Veículo (link `/painel/frota/[id]`), Motorista alocado, Timeline de eventos
  - Direita: Valor total + breakdown (preço base, multiplicador, taxa plataforma, **repasse esperado**), datas key
- Footer: actions contextual conforme status

---

### Fase 10.5 — Telas secundárias (4-5h)

#### `/painel/frota` (1.5h)

**Read-only listing.**

- Grid 3-col responsive (3/2/1 col)
- `<VehicleAdminCard>` — card com:
  - Foto principal (Image)
  - Modelo + Tipo Badge + capacidade
  - Status badge (ACTIVE / INACTIVE / MAINTENANCE)
  - Nota média + total reviews
  - Price per km + min departure cost
  - Garagem name + city
- Click → `/painel/frota/[id]` (galeria + amenities + dados completos, read-only)

#### `/painel/motoristas` (1h)

- Tabela ou grid de cards
- Avatar (inicial) + Nome + CPF (mask) + CNH categoria + validade + telefone + status
- Visual de "vencimento próximo" se cnh_expiry_date < 30 dias (sem ação, só visual)

#### `/painel/garagens` (1.5h)

- Grid de cards
- Cada card: nome + endereço + cidade/UF + mini-mapa Leaflet (140px alt) com pin verde
- Reusa `<RouteMap>` mas com modo "single marker"

#### `/painel/avaliacoes` (1.5h)

- Feed scroll vertical de cards
- Reusa `<ReviewCard>` da feature (já mostra cliente + nota + comentário)
- Filtros tabs: "Todas" | "Sem resposta (X)" | "Respondidas"
- Botão "Responder" no rodapé do card → modal `<RespondReviewDialog>`
- Modal: Title + Textarea (max 500) + Counter + botão Confirmar
- Após resposta: card mostra a response inline (já renderizado pelo ReviewCard)

---

### Fase 10.6 — E2E + Polish (2-3h)

**Suite `@company` Playwright (~5-7 testes):**

```ts
test('@company login admin redireciona pra /painel', ...)
test('@company dashboard mostra KPIs com números', ...)
test('@company reservas tab "Novas" lista pendentes', ...)
test('@company aprovar reserva muda status pra Confirmada', ...)
test('@company recusar reserva exige motivo', ...)
test('@company /painel/frota mostra veículos da empresa', ...)
test('@company responder avaliação atualiza card', ...)
```

**Polish:**
- Visual review: cores, espaçamentos, hierarquia
- Mobile responsivo da sidebar (sheet)
- Empty states em cada tela quando sem dados
- Loading skeletons
- Atualizar `_context/IA/sitemap.md` com rotas `/painel/*`
- Atualizar `_context/IA/api-contract.md` com endpoints novos

---

## 3. Componentes a criar (resumo)

| Componente | Local | Uso | Estimativa |
|---|---|---|---|
| `KpiCard` | `components/feature/` | Dashboard | 30min |
| `MiniLineChart` | `components/feature/` | Dashboard | 45min |
| `MiniBarChart` | `components/feature/` | Dashboard | 45min |
| `DataTable` | `components/ui/` | Reservas, Frota, Motoristas | 1.5h |
| `BookingTimeline` | `components/feature/` | Reserva detalhe | 1h |
| `BookingActionsCell` | `components/feature/` | Tabela reservas | 30min |
| `ApproveBookingDialog` | `components/feature/` | Reservas | 1h |
| `RejectBookingDialog` | `components/feature/` | Reservas | 30min |
| `RespondReviewDialog` | `components/feature/` | Avaliações | 30min |
| `VehicleAdminCard` | `components/feature/` | Frota | 1h |
| `SidebarNav` | `app/painel/_components/` | Layout painel | 1h |
| `RoleBadge` | `components/ui/` | Navbar | 15min |
| `EmptyPanelState` | `components/ui/` | Telas vazias | 30min |

**Total ~10h** de componentes novos. O resto é reuso (Card, Button, Badge,
Dialog, Sheet, Input, Textarea, StarRating, Skeleton, etc.).

---

## 4. Reuso do que já existe

✅ **100% do design system** (tokens, fontes, cores, escalas)
✅ **17 componentes UI base** sem modificação
✅ **`BookingStatusBadge`** — mesma badge usada no cliente serve no painel
✅ **`PricingBadge`** — pode mostrar pricing aplicado às reservas
✅ **`ReviewCard`** — mesma card usada em /veiculo/[id] funciona em /painel/avaliacoes
✅ **`RouteMap`** — usar em /painel/garagens (variant single marker)
✅ **`Logo`** componente
✅ **Backend Auth Guard, JWKS, RFC 7807, Zod, SupabaseService**
✅ **Tipos compartilhados** (`@/lib/api/types`)
✅ **API client wrapper** com Bearer JWT automático
✅ **TanStack Query** provider
✅ **Toaster** (Sonner)

---

## 5. Sequência de execução recomendada

```
Dia 1 (8h):
├── Manhã: Fase 10.1 (Backend foundation)
└── Tarde: Fase 10.2 (Backend operações)

Dia 2 (8h):
├── Manhã: Fase 10.3 (Auth + Layout)
└── Tarde: Fase 10.4 parte 1 (Dashboard)

Dia 3 (8h):
├── Manhã: Fase 10.4 parte 2 (Reservas listagem + detalhe)
└── Tarde: Fase 10.5 (Frota + Motoristas + Garagens + Avaliações)

Dia 4 (4-6h):
├── Manhã: Fase 10.6 (E2E + Polish)
└── Tarde: Buffer pra fixes + revisão
```

**Total:** 24-30h ≈ 4 dias.

---

## 6. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Sidebar fica complexa em mobile | Sheet existente serve, vira hamburguer |
| `signInWithPassword` no /login quebra magic link cliente | Toggle visual claro + roteamento por intent (querystring `?as=empresa`) |
| RBAC adiciona latência no JWKS | Cachear profile.role no request scope |
| Recharts pesa bundle | Dynamic import só nas páginas /painel |
| RLS policies não testadas pra empresa | Validar com smoke test cada endpoint novo |
| Datas dos seeds (2026-04-30 base) podem deixar bookings "no passado" | Re-rodar seed se necessário, ou ajustar offset_days no seed-data |

---

## 7. Validação de aceite

A demo apresentável da empresa estará pronta quando:

- [ ] Admin TransTur loga com email + senha → vai pra /painel
- [ ] Dashboard mostra 4 KPIs com números reais > 0
- [ ] Lista de reservas mostra 4 reservas da TransTur (não as 16 globais)
- [ ] Aprovar uma PENDING_APPROVAL via UI → status vira CONFIRMED no DB
- [ ] Cliente vê (em /reserva/[id]) que reserva foi aprovada (estado integrado)
- [ ] Marcar embarque + conclusão funciona (cycle completo da viagem)
- [ ] /painel/frota mostra veículos com fotos
- [ ] /painel/avaliacoes lista 8 reviews + permite responder uma
- [ ] Admin de OUTRA empresa não vê dados da TransTur (autorização horizontal)
- [ ] Cliente comum tentando acessar /painel é redirecionado pra /login
- [ ] E2E suite @company verde
- [ ] Backend smoke test 25/25 OK (atualmente 20/20 + 5 novos)
- [ ] Visual: bicolor headings, sidebar verde no active, KPIs com tabular-nums

---

## 8. O que vira backlog Fase 11+ (não entra)

- CRUD criar/editar veículo com upload de fotos
- CRUD motorista (foto + CNH PDF)
- CRUD garagem com input lat/lng
- Roles COMPANY_OPERATOR (sem financeiro) e COMPANY_FINANCIAL (só leitura)
- Job de validação de docs vencidos (RN-SEC-001)
- Painel financeiro completo (calendário de repasses)
- Stripe Connect real
- Disputas (UC-004) — empresa contesta
- Auto-cadastro de empresa (`/seja-parceiro` wizard)

---

## 9. Decisões em aberto pra confirmar

- [ ] **Login**: toggle visual "Cliente / Empresa" ou detectar pelo email pattern? (Recomendo toggle pra clareza)
- [ ] **Sidebar mobile**: vira Sheet (hamburguer) ou bottom-nav fixed? (Recomendo Sheet, padrão consistente)
- [ ] **Recharts vs Tremor vs custom SVG**: pra mini charts (Recomendo Recharts — leve com dynamic import)
- [ ] **Avatar empresa**: logo da empresa ou inicial em circle? (Recomendo logo se existir, fallback inicial)
- [ ] **Cores no painel**: mesma paleta cliente, ou variação sutil pra diferenciar contextualmente? (Recomendo mesma paleta — consistência da marca)

---

## 10. Próximo passo

Quando autorizado:

1. Revisar e validar este plano com o usuário
2. Criar tasks `TaskCreate` para as 6 sub-fases
3. Iniciar Fase 10.1 (Backend foundation)

**Documentos relacionados:**
- `_context/PRD_BuscouViajou_v1.md` §6.5, §6.14, §6.15.2 — specs originais
- `_context/IA/sitemap.md` — adicionar rotas `/painel/*` quando implementadas
- `_context/IA/api-contract.md` — adicionar endpoints novos quando implementados
- `backlog.md` — épico E1 (essa demo é o subset apresentável dele)

**Última atualização:** 2026-04-30
