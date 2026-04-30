# Flow Test Report — 2026-04-30

> Validação end-to-end via Playwright + curl/SQL do **fluxo cliente** e
> auditoria do **fluxo empresa**. Screenshots em
> `_context/flow-test-screenshots/`.

---

## A. Fluxo Cliente — End-to-End

Validado em **viewport desktop 1280×800**, sessão limpa (anônimo no início,
login programático no meio). Backend `:3001` + Frontend `:3000`.

### Resultado: **8 steps PASS · 2 bugs descobertos · 1 dead-end conhecido**

| # | Step | Status | Screenshot | Notas |
|---|---|---|---|---|
| 1 | Landing renderiza anônimo | ✅ PASS | (já em design-review) | Hero bicolor + JourneyTag + SearchForm |
| 2 | SearchForm renderiza 4 campos com validação | ✅ PASS | `step-01-search-form-filled.png` | Origem, Destino, Quando?, Quantos? |
| 3 | CityAutocomplete chama `GET /v1/cities/search` com debounce | ✅ PASS | `step-01-search-form-filled.png` | Dropdown mostra "São Paulo, SP" e "Morro de São Paulo, BA" |
| 4 | DatePicker pt-BR abre com calendário | ✅ PASS | `step-02-datepicker-open.png` | "maio 2026" em pt-BR, weekdays DOM SEG TER... |
| 5 | Submit do form → `/busca?...` | ❌ **BUG M5** | `step-04-busca-results.png` | URL contém `destino=Campos+do+Jordão%2C+SP`. Backend `resolveCity()` não bate (espera só "Campos do Jordão"). Retorna **400 "Não encontramos essa cidade"** → tela de erro "Algo deu errado." |
| 5b | Workaround com URL correta | ✅ PASS | `step-05-busca-results-correct.png` | 25 veículos retornados, sidebar filtros, sortbar |
| 6 | Filtro "Van" reduz 25 → 7 (client-side) | ✅ PASS | (snapshot via JS) | `applyFilters()` funcional |
| 7 | Click "Ver detalhes" → `/veiculo/[id]` | ✅ PASS | `step-06-veiculo-detail.png` | Bicolor heading, sidebar preço sticky, galeria, comodidades, mapa, avaliações |
| 7b | Bug visual conhecido: mapa origem == destino | ⚠️ **BUG M1** | `03-veiculo-desktop.png` (review) | RouteMap recebe garagem em ambos campos |
| 8 | "Solicitar reserva" anônimo → middleware redirect `/login?next=...` | ✅ PASS | (URL change validado) | Middleware `/middleware.ts` funcional |
| 9 | Login programático Supabase | ✅ PASS | (cookie set via JS) | sb-cscblvcqjwxmgzalowop-auth-token |
| 10 | Pós-login: ReserveCta UX | ⚠️ **S8 conhecido** | — | Toast "Em breve. Volte pra busca" — fluxo morto |
| 10b | Workaround: criar booking via API + navegar pra `/reserva/[id]` | ✅ PASS | `step-07-reserva-pending.png` | PENDING_APPROVAL renderizado: status badge warning, card amarelo "Aguardando aprovação da empresa", DEMO button visível |
| 11 | Click "Simular aprovação + pagamento" → CONFIRMED + ticket | ✅ PASS | `step-08-reserva-confirmed-with-ticket.png` | Status → "Confirmada" verde, card verde "Viagem confirmada", **TicketViewer completo com QR real**, toast success |
| 12 | Click "Cancelar reserva" sem motivo | ❌ **BUG S9** | `step-09-reserva-cancelled.png` | Toast danger "Não foi possível cancelar / Validation failed". Backend exige `reason.min(3)` mas label diz "(opcional)" |
| 12b | Cancel com motivo "Mudei a data da viagem" | ✅ PASS | `step-10-reserva-cancelled-success.png` | Status → "Cancelada por você", **toast verde "Reserva cancelada (100% reembolso) — Cancelamento dentro do prazo"**, RN-FIN-002 calculou correto |
| 13 | `/minhas-viagens` lista bookings | ✅ PASS | `step-11-minhas-viagens-final.png` (carregando) + screenshots anteriores | Tabs por status, BookingCards |

### Bugs descobertos no teste cliente (já no backlog)

- **M5** — SearchForm passa "Cidade, UF" → backend 400 (BLOQUEANTE)
- **S9** — Cancel reserva permite submit com motivo vazio → backend rejeita

### Conclusão fluxo cliente

> **O fluxo end-to-end FUNCIONA**, mas com 2 bugs que prejudicam o happy path:
> - M5 quebra o submit do SearchForm via UI (URL manual funciona)
> - S9 rejeita cancel sem motivo apesar do label "(opcional)"
>
> O resto da experiência (busca → detalhe → reserva → DEMO approve →
> bilhete → cancel) está sólido. RN-FIN-002 (reembolso por antecedência)
> calculado corretamente. TicketViewer renderiza QR real do backend.
> Status timeline completo: PENDING → CONFIRMED → CANCELLED.

---

## B. Fluxo Empresa — Status

### Resultado: **NÃO IMPLEMENTADO (épico E1 da Fase 2)**

A demo Fase 1 cobre **apenas o fluxo cliente**. UI da empresa parceira foi
explicitamente deixada pra Fase 2 conforme `_context/IA/sitemap.md`.

### O que existe (parcialmente):

| Item | Status | Detalhe |
|---|---|---|
| Login admin de empresa | 🟡 Backend OK · UI ❌ | `admin.empresa1@buscouviajou.demo` / `demo12345` autentica via Supabase Auth e backend retorna profile com `role: COMPANY_ADMIN`, `company_id: 297f9320-...`. Mas frontend `/login` só tem magic link cliente — não há `/login/empresa` com email+senha. |
| Profile pra empresa | ✅ | `GET /v1/auth/me` retorna `role`, `company_id`. Visível em `step-12-painel-empresa-404.png` (admin logado vai pro /minhas-viagens cliente). |
| Dados públicos da empresa | ✅ | `GET /v1/companies`, `:id`, `:id/reviews`, `:id/vehicles` retornam dados (mas servem o cliente lendo perfil de empresa, não a empresa logada gerindo). |
| Listar bookings da empresa | ❌ | `GET /v1/bookings` filtra por `client_id = auth.uid()` — empresa logada vê 0 bookings, mesmo tendo 4 reservas no DB (validado via SQL: `SELECT count(*) FROM bookings JOIN companies ON c.name = 'TransTur SP' = 4`). |

### O que NÃO existe (gaps confirmados):

**Backend endpoints (PRD §7.3, §7.4 não implementados):**

```
❌ POST /v1/bookings/:id/approve        — empresa aprova solicitação
❌ POST /v1/bookings/:id/reject         — empresa recusa
❌ POST /v1/bookings/:id/start          — registra embarque
❌ POST /v1/bookings/:id/complete       — registra conclusão
❌ POST /v1/bookings/:id/no-show-client — registra no-show
❌ GET  /v1/bookings (com filtro empresa) — listagem por company_id
❌ GET  /v1/company/dashboard           — KPIs (faturamento, repasses, etc.)
❌ POST /v1/vehicles                    — empresa cadastra veículo
❌ POST /v1/drivers                     — empresa cadastra motorista
❌ POST /v1/garages                     — empresa cadastra garagem
❌ POST /v1/reviews/:id/respond         — empresa responde avaliação
❌ POST /v1/disputes/:id/contest        — empresa contesta disputa
```

**Frontend telas (PRD §6.5, §6.14, §6.15.2 não implementadas):**

```
❌ /login/empresa            — login email+senha pra COMPANY_ADMIN
❌ /painel                   — dashboard empresa
❌ /painel/reservas          — gestão de reservas (Aprovar/Recusar/Iniciar/Concluir)
❌ /painel/frota             — CRUD veículos
❌ /painel/garagens          — CRUD garagens
❌ /painel/motoristas        — CRUD motoristas
❌ /painel/avaliacoes        — listar + responder + contestar
❌ /painel/financeiro        — repasses agendados/pagos
❌ /seja-parceiro            — landing B2B (auto-cadastro)
❌ /seja-parceiro/cadastro   — wizard 3 etapas
```

**Schema/RLS (existe nas migrations mas não testado):**

```
✅ profiles.role enum tem COMPANY_ADMIN/OPERATOR/FINANCIAL
✅ profiles.company_id FK pra companies
✅ Tabelas vehicles, drivers, garages, addons com company_id
✅ RLS policy "Company manages own vehicles" etc. (rls_policies.sql:157-163)
🟡 Falta testar policies end-to-end (com role real, sem service_role)
```

### Comportamento atual quando empresa loga

Reproduzido no teste:

1. Admin loga via Supabase Auth (backend) → recebe JWT válido
2. Cookies setados → middleware permite acessar `/minhas-viagens` e `/reserva/*`
3. Navbar mostra avatar "Admin" (vide `step-13-empresa-em-rota-cliente.png`)
4. `/minhas-viagens` carrega com skeletons + lista vazia (RLS filtra por `client_id`)
5. `/painel` retorna 404 (vide `step-12-painel-empresa-404.png`)
6. Empresa fica "preso" sem nada relevante pra fazer — UX broken pra esse perfil

### Conclusão fluxo empresa

> **Não há fluxo da empresa pra testar.** Backend tem dados (4 bookings da
> TransTur SP existem no DB), mas:
> - Nenhuma rota frontend pra empresa
> - Endpoints de operação (approve/reject/start/complete) não implementados
> - `GET /v1/bookings` não considera role COMPANY_ADMIN
> - Magic link login no /login funciona pra empresa via backdoor (password no
>   Supabase Auth), mas não há UI dedicada
>
> Implementar fluxo empresa = **épico E1 do backlog** (~40-60h).

---

## C. Bugs descobertos durante teste

Já adicionados ao `backlog.md`:

| ID | Severidade | Resumo |
|---|---|---|
| **M5** | 🔴 Must Fix | SearchForm passa "Cidade, UF" → backend retorna 400 |
| **S9** | 🟠 Should Fix | Cancel reserva exige motivo apesar de label "(opcional)" |

---

## D. O que está sólido (manter)

1. ✅ **Auth flow** — login programático Supabase + cookie + middleware redirect
2. ✅ **CityAutocomplete** com debounce e match no backend
3. ✅ **DatePicker** pt-BR completo com `react-day-picker`
4. ✅ **Filtros client-side** (applyFilters, sortResults)
5. ✅ **Status machine de booking** (PENDING → CONFIRMED → CANCELLED)
6. ✅ **DEMO approve-and-pay** simula empresa + pagamento corretamente
7. ✅ **TicketViewer** com QR real do backend, dados, motorista, ações
8. ✅ **RN-FIN-002** (cálculo de reembolso por antecedência) funcional
9. ✅ **Toasts** semânticos (success verde, danger vermelho)
10. ✅ **Bicolor heading** consistente em todos os títulos principais
11. ✅ **Navbar responsive** (logo lockup desktop / monograma mobile)
12. ✅ **Footer** navy com 4 colunas + JourneyTag inverse + signature italic

---

## E. Próximos passos sugeridos

**Imediato (~30min):**
- Fix M5 (SearchForm city name vs label)
- Fix S9 (cancel motivo opcional)

**Demo apresentável (~4-6h):**
- Todos os fixes do backlog Must (M1-M5) + Should (S1-S9)

**Versão produto (~3-5 dias):**
- Épico E1 — Painel Empresa (UI + endpoints + auth próprio)
- Épico E4 — Stripe Checkout real
- Épicos E5/E6 — Disputas + Avaliações UI

---

**Documentos relacionados:**
- `backlog.md` (raiz do repo) — todas as tarefas priorizadas
- `_context/design-review-pass-1.md` — review visual completa
- `_context/IA/user-flows.md` — flows documentados (PRD)
- `_context/PRD_BuscouViajou_v1.md` §6, §7 — specs originais

**Última atualização:** 2026-04-30
