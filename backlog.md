# Backlog — Buscou Viajou

> Lista priorizada de fixes e features pendentes. Origem cruzada de:
> `_context/design-review-pass-1.md` + decisões da Fase 2 do PRD.
>
> Convenção: `[ ]` pendente · `[~]` em progresso · `[x]` feito.
> ID = letra+número. Severidade nas seções.

---

## 🔴 P0 — Must Fix (bloqueadores)

Não impedem o demo de funcionar, mas são bugs visíveis ou violações sérias de
a11y. Devem entrar antes de qualquer apresentação ao cliente final.

### `[ ]` M1 — `/veiculo/[id]` mapa com origem == destino

**Arquivo:** `BuscouViajouFrontend/src/app/veiculo/[id]/page.tsx:172-181`
**Bug:** `RouteMap` recebe garagem.lat/lng em ambos `origin` e `destination`,
resultando em pin único sem polyline. Quebra storytelling de "rota traçada".
**Fix opção A:** criar `<RouteMap.SingleMarker>` ou prop `mode="single"`.
**Fix opção B:** acessar lockedQuote da busca pra passar rota completa.
**Estimativa:** 30min · **Severidade:** Funcional

### `[ ]` M2 — Sheet do navbar mobile sem `SheetTitle` (a11y)

**Arquivo:** `BuscouViajouFrontend/src/components/layout/navbar.tsx:110-149`
**Console:** `DialogContent requires a DialogTitle...`
**Fix:** adicionar `<SheetTitle className="sr-only">Menu de navegação</SheetTitle>`
dentro do `<SheetContent>`. Verificar também `vehicle-gallery.tsx` lightbox.
**Estimativa:** 10min · **Severidade:** A11y WCAG

### `[ ]` M3 — `Button variant="outline"` com `asChild` perde border

**Arquivo:** `BuscouViajouFrontend/src/components/layout/navbar.tsx:138-144`
**Bug:** Botão "Entrar" no menu mobile aparece sem border navy 2px (vira texto bold).
Slot do Radix não propaga classes corretas pro `<Link>` interno.
**Fix:** debugar com DevTools (computed styles). Alternativa: usar
`<Link className={buttonVariants({ variant: 'outline' })}>` direto sem asChild.
**Estimativa:** 45min · **Severidade:** Visual

### `[ ]` M4 — `Button size="sm"` (36px) abaixo de 44px touch target

**Arquivo:** `BuscouViajouFrontend/src/components/ui/button.tsx:39`
**Bug:** `h-9` sem `min-h-[44px]` viola WCAG 2.5.5 + design-dna `accessibility.rules`.
Usado em SortBar, BookingCard actions, FiltersSidebar "Limpar", LoginForm reenviar.
**Fix opção A:** sempre `min-h-[44px]` mesmo em sm.
**Fix opção B:** restringir size="sm" a contextos não-touch.
**Estimativa:** 15min · **Severidade:** A11y WCAG

### `[x]` M5 — SearchForm passa "Cidade, UF" em vez de "Cidade" ✅ FECHADO 2026-04-30

**Fix aplicado:** `BuscouViajouApi/src/common/geo/brazil-cities.ts:71-95` —
`resolveCity()` agora tenta match exato; se falhar e o input tiver vírgula,
splita e tenta o nome canônico antes da vírgula.
Solução cirúrgica no backend evita refactor no frontend.
**Validado:** UI E2E com SearchForm via Playwright + curl. /busca retorna 25
veículos pra "São Paulo, SP" → "Campos do Jordão" via UI submit.

---

## 🟠 P1 — Should Fix (melhorias importantes)

Não bloqueiam demo, mas prejudicam consistência ou UX em casos comuns.

### `[ ]` S1 — `/404` mobile heading display quebra em 4 linhas

**Arquivo:** `BuscouViajouFrontend/src/app/not-found.tsx:16-18`
**Fix:** trocar `BicolorHeading size="display"` por padrão responsivo já usado
no Landing: `text-h1 md:text-display`.
**Estimativa:** 10min

### `[ ]` S2 — JourneyTag aparece 2× na Landing

**Arquivo:** `BuscouViajouFrontend/src/app/page.tsx:33-34, 160`
**Viola:** `visualEffects.journeyTag.useSparingly` ("Don't repeat in same view").
**Fix:** remover do CTA fechamento ou do hero.
**Estimativa:** 5min

### `[ ]` S3 — SheetTitle "Filtros" duplicado no sheet mobile

**Arquivo:** `BuscouViajouFrontend/src/app/busca/search-results.tsx:148-158` +
`filters-sidebar.tsx:96-105`
**Fix:** prop `hideHeader` no `FiltersSidebar` ou refatorar Title pra ficar
fora.
**Estimativa:** 15min

### `[ ]` S4 — `BookingCard` cria 2 alvos focáveis (a11y)

**Arquivo:** `BuscouViajouFrontend/src/components/feature/booking-card.tsx:116-122`
**Bug:** `<Link absolute inset-0>` + action button com `relative z-10` →
keyboard nav passa em ambos, screen reader anuncia 2× a mesma destinação.
**Fix:** envolver título/rota num `<Link>` block-level ao invés do absolute overlay.
**Estimativa:** 30min · **Severidade:** A11y

### `[ ]` S5 — Truncamento agressivo em mobile

**Arquivos:** `booking-card.tsx:78-81`, `ticket-viewer.tsx:193`
**Bug:** "São Pa..." (origem) e "Fern..." (motorista) cortados em 4 chars.
**Fix:** aumentar `min-w` ou trocar `truncate` por `line-clamp-2`. No ticket,
motorista pode usar `whitespace-normal`.
**Estimativa:** 20min

### `[ ]` S6 — Bicolor heading viola "ONE word in green"

**Arquivos:** `login/page.tsx:22`, `not-found.tsx:16-18`, `auth/erro/page.tsx:39`,
`reserva/[id]/booking-detail.tsx`
**Casos:**
- `/login`: "Buscou **sem senha**." (2 palavras)
- `/404`: "Buscou aqui? **Sem rota.**" (2 palavras)
- `/auth/erro`: split por primeiro espaço, arbitrário
- `/minhas-viagens`: "**Minhas** viagens" — 1 palavra mas não a keyword
**Fix:** revisar caso a caso. Sugestões no `design-review-pass-1.md` §S6.
**Estimativa:** 30min

### `[x]` S7 — Fotos do seed inadequadas ✅ FECHADO 2026-04-30

**Fix aplicado:** `BuscouViajouApi/src/database/seed-data.ts:167-184` —
removida função `VAN_PHOTO` (5 IDs Unsplash retornavam BMW/McLaren).
Removidos 2 dos 5 `BUS_PHOTO` originais que eram Porsche e ilha tropical.
Lista final: 3 IDs validados visualmente — ônibus 2 andares colorido, ônibus
noturno em montanhas, Kombi/van em estrada. Todos os 25 veículos no seed
agora rotacionam entre as 3 fotos corretas.
**Validado:** UI `/busca` mostra apenas ônibus/vans, console sem 404,
zero carros esportivos.

### `[x]` S9 — Cancel reserva exigia motivo apesar de label "opcional" ✅ FECHADO 2026-04-30

**Fix aplicado:** `BuscouViajouApi/src/modules/bookings/bookings.dto.ts:22-29` —
trocado `reason: z.string().min(3).max(500)` por
`reason: z.string().max(500).optional()`. Alinhado ao PRD §12.3 RN-FIN-002 que
não exige motivo. Frontend não foi modificado (label "Motivo (opcional)" agora
honesta).
**Validado:** curl `POST /v1/bookings/:id/cancel` com body `{}` retorna 100%
reembolso conforme regra de antecedência.

### `[ ]` S8 — `ReserveCta` UX dead-end pro user logado

**Arquivo:** `BuscouViajouFrontend/src/app/veiculo/[id]/reserve-cta.tsx:57-60`
**Bug:** user logado clica "Solicitar reserva" e recebe toast "Em breve...
Volte a /busca". Fluxo morto.
**Fix opção A:** desabilitar com tooltip "Volte pra busca pra selecionar este veículo".
**Fix opção B:** redirect pra /busca?vehicleId=... pré-preenchido.
**Estimativa:** 30min

---

## 🟡 P2 — Could Improve (polish)

Nice-to-haves. Atacar quando os P0/P1 estiverem fechados.

### `[ ]` C1 — Logo footer V5 vs V2 recomendado pelo DS

**Arquivo:** `footer.tsx:60` — atualmente `variant="white"` (V5).
**Decisão:** atualizar design-dna.json pra permitir V5 OU trocar pra V2.
**Estimativa:** 5min

### `[ ]` C2 — Stepper `unitLabel` "passageiros" desalinhado em hero

**Arquivo:** `stepper.tsx:92-94`
**Bug:** Caption "passageiros" embaixo do controle quebra alinhamento vertical
com outros campos do form hero (Label acima nos outros).
**Fix:** remover unitLabel quando usado em form com Label, ou inline.
**Estimativa:** 15min

### `[ ]` C3 — `PriceBreakdown` row accent text-bv-warning falha contraste

**Arquivo:** `price-breakdown.tsx:147`
**Bug:** `text-bv-warning` (#E0A23B) sobre white com font-medium 14px = 2.9:1
(falha WCAG AA 4.5:1).
**Fix:** trocar pra `text-[#A06D1F]` (warning escuro do badge) ou `font-bold`.
**Estimativa:** 5min

### `[ ]` C4 — `SelectLabel` uppercase + tracking-wider em microetiquetas

**Arquivo:** `select.tsx:111`, `ticket-viewer.tsx:141, 192, 237`,
`booking-detail.tsx:71, 139`
**Decisão:** convencional em boarding pass / dashboards. Aceitar ou revisar.
**Estimativa:** discussão (sem fix obrigatório)

### `[ ]` C5 — Documentar `danger` como exceção semântica

**Arquivo:** `_context/design-dna.json` — adicionar nota em `colors.semantic.danger`.
**Fix:** "danger usado exclusivamente em ações destrutivas (cancel) e
indicador PEAK do pricing dinâmico — nunca decorativo".
**Estimativa:** 5min

---

## 🔵 P3 — Épicos pendentes (Fase 2 e além)

Itens estruturais que não estão na demo Fase 1. PRD especifica completamente.

### `[ ]` E1 — Painel da Empresa Parceira (Fase 2)

> **Status atual:** Backend tem dados de empresa (perfil público,
> avaliações, frota), mas **nenhuma UI de gestão pra empresa existe**.
> Cliente vê dados da empresa, empresa não tem onde logar pra operar.

**Telas necessárias** (PRD §6.14, §6.15.2, §6.5):

- [ ] `/painel` — Dashboard empresa (KPIs: faturamento, repasses, ocupação, avaliações)
- [ ] `/painel/reservas` — Tabela com tabs por status, ação Aprovar/Recusar/Iniciar/Concluir
- [ ] `/painel/frota` — CRUD de veículos (cadastro, fotos, comodidades, preços)
- [ ] `/painel/garagens` — CRUD de garagens com endereço/lat-lng
- [ ] `/painel/motoristas` — CRUD de motoristas com CNH
- [ ] `/painel/avaliacoes` — Lista + responder + contestar
- [ ] `/painel/financeiro` — Repasses agendados/pagos, calendário

**Backend gaps** (PRD §7):

- [ ] `POST /v1/bookings/:id/approve` — empresa aprova solicitação (atualmente só `_demo/approve-and-pay` que cliente aciona)
- [ ] `POST /v1/bookings/:id/reject` — empresa recusa
- [ ] `POST /v1/bookings/:id/start` — empresa registra embarque
- [ ] `POST /v1/bookings/:id/complete` — empresa registra conclusão
- [ ] `POST /v1/bookings/:id/no-show-client`
- [ ] `GET, POST, PUT, DELETE /v1/vehicles` — CRUD pro empresa-admin
- [ ] `GET, POST, PUT, DELETE /v1/drivers`
- [ ] `GET, POST, PUT, DELETE /v1/garages`
- [ ] `GET /v1/company/dashboard` — métricas
- [ ] `POST /v1/reviews/:id/respond` — empresa responde avaliação
- [ ] `POST /v1/bookings/:id/dispute/contest` — empresa contesta disputa

**Auth gaps:**
- [ ] Login com email + senha pra `COMPANY_ADMIN` / `COMPANY_OPERATOR` / `COMPANY_FINANCIAL` (atualmente só magic link cliente)
- [ ] RLS policies pra empresa ver apenas dados da própria company_id (já existem nas migrations, mas não testados)

**Estimativa:** ~40-60h (épico completo, 3-4 dias)

### `[ ]` E2 — Painel Super Admin (Fase 2)

- [ ] `/admin/empresas` — fila de aprovação de partner_applications
- [ ] `/admin/disputas` — gestão e resolução
- [ ] `/admin/transacoes` — listagem global
- [ ] `/admin/dashboard` — GMV, funil, NPS, mapa de calor
- [ ] `/admin/configuracoes` — system_settings, pricing events

### `[ ]` E3 — Auto-cadastro de empresa parceira (Fase 2)

- [ ] `/seja-parceiro` — landing page B2B
- [ ] `/seja-parceiro/cadastro` — wizard 3 etapas (PRD §6.6)
- [ ] `/seja-parceiro/sucesso` — confirmação
- [ ] `/seja-parceiro/[token]/complementar` — pra solicitar docs adicionais

### `[ ]` E4 — Stripe Checkout real (substituir mock)

Atualmente o endpoint `_demo/approve-and-pay` simula aprovação + pagamento.
Em produção:
- [ ] Substituir por `POST /v1/bookings/:id/pay` que retorna `stripe_checkout_session_url`
- [ ] Webhook `checkout.session.completed` confirma + gera ticket
- [ ] Stripe Connect pra repasses D+15

### `[ ]` E5 — Disputas (UC-004 do PRD)

- [ ] Cliente abrir disputa em `/reserva/[id]` (botão "Reportar problema")
- [ ] Upload de evidências (fotos/vídeos no bucket `dispute-evidences`)
- [ ] Empresa contestar via `/painel/disputas` (Fase 2)
- [ ] Super admin resolver via `/admin/disputas` (Fase 2)

### `[ ]` E6 — Avaliações (UC-005)

- [ ] Cliente avaliar em `/reserva/[id]` (botão "Avaliar" — visível em COMPLETED)
- [ ] StarRating interativo + Textarea + categorias (pontualidade, veículo, motorista, custo-benefício)
- [ ] Resposta da empresa via `/painel/avaliacoes` (Fase 2)

### `[ ]` E7 — Auth SMS OTP (PRD pede)

Demo usa magic link email. Produção pode trocar pra SMS:
- [ ] Configurar Twilio no Supabase Auth
- [ ] Trocar `signInWithOtp({ email })` por `signInWithOtp({ phone })`

### `[ ]` E8 — Bilhete em PDF (atualmente só QR no app)

- [ ] `GET /v1/bookings/:id/ticket/pdf` no backend
- [ ] Botão "Baixar PDF" no `TicketViewer` (atualmente é só visual)

### `[ ]` E9 — Notificações (in-app + email transacionais)

PRD §10.4 lista 22 emails (EMAIL-001 a EMAIL-022). Atualmente nada
implementado:
- [ ] Configurar SMTP no Supabase Auth (custom email templates)
- [ ] Endpoint de notifications já existe na tabela, falta listar/marcar lido
- [ ] Job de envio via Edge Functions ou backend cron

---

## 🟢 P4 — Tech Debt / refactor

### `[ ]` T1 — TypeScript types do `database.types.ts` ficam fora de sync

Toda mudança no schema requer rodar `npm run gen:types`. Considerar `pre-push`
hook ou job que regenera automático.

### `[ ]` T2 — Lockfile Quote (RN-PRICE-006) — countdown UI

Backend já trava preço por 30min em `locked_quotes`. Frontend não mostra
countdown nem refaz quote ao expirar.

### `[ ]` T3 — Test coverage de componentes UI

Apenas E2E coverage (28/28). Testes unitários de componentes (button, card,
bicolor-heading, etc.) seriam baratos via Vitest + RTL.

### `[ ]` T4 — Storybook ou rota `/dev/components` em produção?

`/dev/components` e `/dev/feature` estão noindex mas servem em produção. OK pra
demo, mas em produção real considerar mover pra Storybook ou bloquear no
middleware.

### `[ ]` T5 — Logo footer V2 tem bg navy embutido

Se trocar `Logo variant="white"` → `variant="whiteOnNavy"` (vide C1), fica
double-navy box. Pode ser necessário regenerar V2 sem bg embutido.

---

## Priorização sugerida

**Próxima sessão (~4h):** Fechar todos os P0 (M1-M4) + P1 (S1-S8). Re-rodar E2E.

**Sessão seguinte (~8h):** P2 + começar épico E1 (painel empresa) — pelo menos
auth + dashboard + lista de reservas.

**Demo final go-live:** ainda precisa E4 (Stripe real) + E5/E6/E7 conforme prioridade
de negócio.

---

**Origem:**
- `_context/design-review-pass-1.md` — achados detalhados com refs de código
- `_context/PRD_BuscouViajou_v1.md` — telas e endpoints da Fase 2
- `_context/IA/sitemap.md` — escopo da demo vs Fase 2

**Última atualização:** 2026-04-30
