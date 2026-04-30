# Buscou Viajou — Pitch Técnico

> **Audiência:** desenvolvedor / arquiteto / CTO. Vai cobrar craft, não TAM.
> **Honestidade:** isto é uma **demo end-to-end funcional**, não produto com usuários reais.
> **Duração:** 10-15 min + Q&A.

---

## 1. O que é (30s)

Marketplace de fretamento turístico. Cliente busca rota → vê N veículos de M empresas comparados lado a lado → reserva → paga (mock) → recebe bilhete digital com QR.

A demo cobre **100% do fluxo do cliente**. Painel de empresa e super admin estão planejados (`_context/plano-demo-empresa.md`), não construídos.

URLs vivas agora:
- Frontend: https://buscou-viajou.vercel.app
- Backend: https://buscou-viajou-api.onrender.com/docs (Swagger)
- Schema: 27 tabelas no Supabase

---

## 2. Demo (5 min) — fluxo do cliente

| Passo | URL | O que ver |
|---|---|---|
| Landing + busca | `/` | SearchForm com geocoder de cidades brasileiras (Haversine) |
| Resultados | `/busca?...` | 25 veículos de 8 empresas, pricing dinâmico calculado, locked_quote criado pra travar preço por 30min |
| Detalhe | `/veiculo/:id` | Galeria, specs, reviews, breakdown do preço |
| Login | `/login` | Magic link Supabase (sem senha) |
| Reserva | `/reserva/:id` | Status machine, QR SVG do backend, ações contextuais por estado |
| Histórico | `/minhas-viagens` | RLS no banco — cliente só vê o que é dele |

---

## 3. Stack + decisões

```
Next.js 15 (App Router) + TypeScript + Tailwind v3
        ↕  fetch com Bearer JWT
NestJS 10 + Zod + Swagger + JWKS validation (ES256)
        ↕  @supabase/supabase-js (sem Prisma)
Postgres 17 (Supabase) + RLS + 6 Storage Buckets
```

**Por que esses:**

| Decisão | Por quê |
|---|---|
| **Sem Prisma** | Schema gerenciado por migrations Supabase CLI. Tipos gerados via `supabase gen types typescript`. Não preciso de runtime adicional, conexão direta ao Postgres via `supabase-js`. Trade-off: perdi query builder fluente. Ganhei: 1 dependência a menos, sem migrations divergentes entre Prisma schema e DB real. |
| **Auth via Supabase Auth** | Magic link nativo, cookie HttpOnly setado pelo `/auth/callback`. Backend valida JWT via **JWKS público** (ES256) — nada de segredo compartilhado entre frontend/backend. |
| **RLS habilitado em todas as tabelas** | Segurança em camada de banco. Cliente só lê seus próprios `bookings`. Backend usa `service_role` quando precisa bypassar (com cuidado — apenas em fluxos administrativos). |
| **Zod end-to-end** | DTOs do NestJS (`ZodValidationPipe`) + schemas client. Validação consistente, inferência de tipos. |
| **TanStack Query no client** | Cache + invalidação por mutação. Combina bem com Server Components do Next 15 — Server Component faz fetch inicial, Client hidrata e revalida. |
| **`qrcode` no backend, `qrcode.react` no frontend** | QR é gerado server-side (assinado com payload), enviado como SVG inline. Cliente não precisa do payload bruto. |

---

## 4. Schema (27 tabelas)

```
auth.users (Supabase nativo)
   ↓
profiles (1:1 user) — tipo, dados pessoais
   ├─→ companies (1:N) — empresa parceira
   │      ├─→ vehicles (1:N) — frota
   │      │      ├─→ vehicle_photos
   │      │      └─→ vehicle_amenities ⟷ amenities
   │      ├─→ drivers (1:N)
   │      └─→ garages (1:N)
   │
   ├─→ bookings (1:N) — reserva
   │      ├─→ booking_passengers
   │      ├─→ booking_status_history (audit)
   │      ├─→ payments
   │      └─→ tickets — QR + revogação
   │
   └─→ reviews (1:N)

pricing_events — eventos sazonais que afetam multiplicador
locked_quotes — cotação travada por 30min antes de virar booking
disputes, notifications, audit_logs ...
```

**Storage:** 6 buckets com policies separadas — `vehicle-photos` (público), `company-logos` (público), `company-docs` (privado, só admin), `dispute-evidence` (privado), `client-tickets-cache` (privado, só dono), `profile-avatars` (público).

---

## 5. Auth flow (sem segredo no backend)

```
1. Cliente entra email → Supabase envia magic link
2. Cliente clica → /auth/callback?code=...
3. Next.js troca code por session (cookie HttpOnly setado)
4. Frontend chama API com Authorization: Bearer <jwt>
5. Backend valida JWT via JWKS público:
       https://cscblvcqjwxmgzalowop.supabase.co/auth/v1/.well-known/jwks.json
   (ES256, kid rotaciona, JWKS cacheado em memória)
6. AuthGuard popula req.user, decorators @CurrentUser injetam
```

**Decorators:**
- `@Public()` — bypass do guard global
- `@OptionalAuth()` — guarda popula se houver token, não rejeita se não
- `@CurrentUser()`, `@CurrentJwt()` — DI do payload

Resultado: backend stateless, sem `JWT_SECRET` em variável de ambiente. Roda em qualquer máquina sem precisar compartilhar segredo.

---

## 6. Pricing dinâmico (algoritmo)

`BuscouViajouApi/src/modules/quotes/quotes.service.ts:60-208`

```ts
const LEVEL_MULTIPLIER = { NORMAL: 1.0, HIGH: 1.2, VERY_HIGH: 1.45, PEAK: 1.8 };

// 1. Resolve cidades (geocoder estático com ~30 capitais BR)
const origin = resolveCity(dto.origin);
const destination = resolveCity(dto.destination);

// 2. Distância: Haversine × 1.15 (fator estradas)
const distanceKm = Math.round(haversineKm(origin, destination) * 1.15);

// 3. Multiplicador: maior nível ativo entre pricing_events da data + região
const events = await supabase.from('pricing_events')
  .select(...)
  .lte('start_date', date).gte('end_date', date)
  .eq('is_active', true);
const multiplier = computeMultiplier(events, originState, destState);

// 4. Por veículo: max(min_departure_cost, distance×price_per_km) × multiplier
const finalPrice = Math.max(min, distance × pricePerKm) × multiplier;

// 5. Trava cotação por 30min em locked_quotes
//    (impede mudança de preço entre busca e checkout)
```

**Trade-off honesto:** geocoder é um array hardcoded (`brazil-cities.ts`) com ~30 capitais. Pra produção real: integrar Geoapify ou Mapbox Geocoding. Não fiz por causa de chave de API + custo na demo.

---

## 7. Booking state machine (12 estados)

`BuscouViajouApi/src/modules/bookings/bookings.service.ts:18-31`

```ts
const VALID_TRANSITIONS = {
  PENDING_APPROVAL:    ['PENDING_PAYMENT', 'REJECTED', 'EXPIRED', 'CANCELLED_BY_CLIENT'],
  PENDING_PAYMENT:     ['CONFIRMED', 'CANCELLED_BY_CLIENT', 'EXPIRED'],
  CONFIRMED:           ['IN_PROGRESS', 'CANCELLED_BY_CLIENT', 'CANCELLED_BY_COMPANY', 'NO_SHOW_CLIENT', 'NO_SHOW_COMPANY'],
  IN_PROGRESS:         ['PENDING_COMPLETION'],
  PENDING_COMPLETION:  ['COMPLETED'],
  COMPLETED:           [],   // terminal
  CANCELLED_*:         [],   // terminal
  REJECTED, EXPIRED, NO_SHOW_*: []  // terminal
};
```

Toda transição:
1. Valida origem→destino contra a tabela acima
2. Insere linha em `booking_status_history` (audit log)
3. Aplica RN-FIN-002 se for cancelamento (refund 100/50/0% por janela 72h/24h/<24h)
4. Recalcula payout pra empresa

Mock atual: aprovação + pagamento são feitos pelo endpoint `_demo/approve-and-pay`. Pra produção: troca por webhook do Stripe Connect.

---

## 8. Testes E2E

28/28 Playwright passando. Tags:
- `@smoke` — endpoints respondem
- `@critical` — happy path cliente (busca → reserva → bilhete)
- `@auth` — magic link, sessão, logout
- `@filter` — filtros de busca
- `@a11y` — axe-core nas páginas chave
- `@responsive` — viewports 375/768/1280

Roda em CI a cada PR. Smoke do backend: `bash BuscouViajouApi/scripts/smoke-test.sh` — 20/20 endpoints OK.

---

## 9. O que é demo vs production-ready

| Componente | Status |
|---|---|
| Backend NestJS | ✅ Production-ready (auth, validação, errors RFC 7807, Swagger) |
| Schema + RLS | ✅ Production-ready |
| Frontend cliente | ✅ Production-ready (28 E2E + a11y + responsive) |
| Auth magic link | ✅ Production-ready (rate limit Supabase: 4/h no free) |
| Pagamento | ⚠️ **Mock** — `_demo/approve-and-pay`. Stripe não integrado. |
| Geocoder | ⚠️ Array hardcoded de 30 capitais. Falta integração externa. |
| Painel empresa | ❌ Não construído. Plano em `_context/plano-demo-empresa.md` (~30h). |
| Painel super admin | ❌ Não construído. |
| Notificações (email/SMS) | ❌ Não implementado. |
| Observabilidade | ❌ Sem Sentry/DataDog/log aggregator. |
| CI/CD | 🟡 Vercel + Render auto-deploy do `main`. Sem pipeline de testes obrigatório antes do merge. |

Custo de operação na demo: **$0/mês** (Vercel free + Render free + Supabase free). Cold start de ~30s no Render free após 15min inativo.

---

## 10. O que faltaria pra produção real

Em ordem de prioridade:

1. **Stripe Connect** — substituir `_demo/approve-and-pay` por Checkout + webhook + payout schedule. (~2 semanas)
2. **Painel empresa** — CRUD frota/motoristas, aprovar reservas, dashboard. (~30h, plano pronto)
3. **Geocoder real** — Geoapify ou Mapbox. Migration adicionando coordenadas em `bookings`/`garages`. (~1 dia)
4. **Email transacional** — Resend ou SendGrid. Webhook de status muda → envia email. (~1 dia)
5. **Observability** — Sentry pra erros, BetterStack pra uptime, Logtail pra logs. (~2 dias)
6. **Painel super admin** — moderar empresas, resolver disputas. (~25h)
7. **Pipeline CI obrigatório** — block merge se E2E falhar. (~meio dia)
8. **Domínio + email custom + SPF/DKIM** pro magic link não cair em spam.

Estimativa pra MVP comercializável: **~6-8 semanas** de dev focado.

---

## 11. Decisões controversas que você pode questionar

- **Sem Prisma** — perdi DX de query builder. Aceito.
- **Service role no backend pra bypass de RLS em fluxos admin** — cuidado tem que ser cirúrgico. Toda chamada com `supabase.admin` está num service, não controller.
- **Mock de pagamento** — não simulei Stripe Connect com test mode pra economizar tempo. Em produção, o webhook handler é não-trivial (idempotência, retries).
- **Tailwind v3 (não v4)** — v4 saiu enquanto eu construía. Mantive v3 pra estabilidade.
- **Gotham font local** — woff2 hospedado no Vercel. ~200KB extras de bundle. Trade-off: identidade visual vs performance. Optei pela marca.
- **Geocoder hardcoded** — assumido como dívida técnica pra demo.

---

## 12. Q&A técnico esperado

**P: Por que não usou Server Actions do Next 15?**
> Mantive separação frontend ⟷ backend pra que o backend NestJS possa servir um app mobile no futuro sem reescrever lógica. Server Actions acoplam business logic ao framework de UI.

**P: RLS é suficiente? E se a service_role vazar?**
> RLS é defense-in-depth. Service role está em variável de ambiente do Render (não commitada). Se vazar, rotaciono no Supabase Dashboard — minutos. Pra produção real adicionaria audit log de toda chamada admin + alerta no Sentry.

**P: Como você lida com concorrência no `locked_quotes`?**
> Cada busca cria N linhas de `locked_quotes` com TTL de 30min. Booking consome a quote (`is_used = true`). Se duas tentativas de booking competem pela mesma quote, a segunda falha em CONFLICT (constraint na coluna `is_used`). Não é trava distribuída, mas funciona pro modelo (cotação é per-cliente, não recurso compartilhado).

**P: E se o multiplicador mudar entre busca e booking?**
> Não muda — `final_price` é congelado em `locked_quotes.final_price`. Booking lê desse preço travado, não recalcula.

**P: QR code é assinado?**
> Hoje contém só o `ticket_code`. Pra produção: HMAC com chave da empresa, validado no app do motorista. Tabela `tickets` tem `revoked_at` pra invalidar bilhete em caso de cancelamento.

**P: Como você gera tipos a partir do schema?**
> `supabase gen types typescript --linked > src/database/database.types.ts`. Roda manualmente após cada migration. Em CI rodaria como check (falha PR se desatualizado).

**P: 28 testes E2E é pouco?**
> Pra demo é OK — cobre os fluxos críticos. Pra produção: adicionaria testes de unidade pra `BookingsService` (state machine), `QuotesService.computeMultiplier`, e contract tests entre frontend e backend.

**P: Cold start do Render dói?**
> ~30s no primeiro request após 15min inativo. UptimeRobot pingando a cada 5min mata o problema (free tier). Pra produção: Render Hobby ($7/mês) ou outra cloud sem cold start.

**P: Como escala o pricing dinâmico?**
> Hoje `pricing_events` é uma tabela small (dezenas de linhas). Multiplicador é computado in-memory por request — O(events). Pra escala: pré-computar índice por (data, região) e cachear no Redis. Não fiz porque não precisa.

**P: Repo é aberto?**
> Sim — me peça e mando o link. PRD completo em `_context/PRD_BuscouViajou_v1.md` (2.700 linhas). Information Architecture em `_context/IA/`. Design DNA em `_context/design-dna.json`.

---

## 13. Pra te dar acesso ao código

```
git clone <repo>
cd Buscou-Viajou
# .env do backend (te mando .env.example):
cp BuscouViajouApi/.env.example BuscouViajouApi/.env
# preenche SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# Backend
cd BuscouViajouApi && npm install && npm run start:dev
# → http://localhost:3001 + Swagger em /docs

# Frontend (outra aba)
cd BuscouViajouFrontend && npm install && npm run dev
# → http://localhost:3000
```

---

**Foco da apresentação:** demo ao vivo + 2-3 trechos de código no editor. Slides são apoio.
