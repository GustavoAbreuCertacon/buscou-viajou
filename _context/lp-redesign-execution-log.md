# LP Redesign — Execution Log

> Registro do que foi efetivamente entregue. Complementa
> `lp-redesign-plan.md` (intenção original) com decisões tomadas durante a
> execução, especialmente o realinhamento de posicionamento no meio do
> caminho.

| | |
|---|---|
| **Data execução** | 2026-04-30 |
| **Tempo total** | ~3h |
| **Branch** | `main` (commits diretos) |
| **Status** | Entregue + validado visualmente + type-check 0 erros |

---

## 1. Mudança de posicionamento (decisão crítica do meio do caminho)

A LP foi planejada como **marketplace transacional** (BV processa pagamento,
emite bilhete digital com QR, gerencia reembolso). Durante a execução, o
cliente entregou um **FAQ definitivo de 8 perguntas** estabelecendo que a
plataforma é apenas **comparador / buscador / intermediadora**:

- BV não presta serviço de transporte
- Pagamento e reserva são direto com a empresa parceira
- Cancelamento e atraso resolvem com a empresa
- BV cuida só da busca, comparação e moderação da rede

Esse FAQ virou a **fonte de verdade**. Todos os trechos da LP que
contradiziam foram reescritos:

| Local | Antes | Depois |
|---|---|---|
| Hero H1 (linha 2) | "Reserve em minutos." | "Encontre em minutos." |
| Hero subhead | "...bilhete digital com QR e pagamento seguro online" | "...compare em uma só tela — depois fale direto com a empresa que melhor atende" |
| Como Funciona Step 03 | "Reserve em poucos cliques. O bilhete digital com QR chega na hora." | "Fale direto com a empresa escolhida e feche a reserva. Boa viagem." |
| Compare Matrix linha 4 | "Pagamento online seguro com proteção" | "Avaliações independentes de viajantes verificados" |
| Compare Matrix linha 5 | "Bilhete digital com QR e suporte do início ao fim" | "Filtros por capacidade, avaliação, tipo de veículo e preço" |
| Compare Matrix linha 6 | "Política clara de reembolso por prazo" | "Empresas com baixo desempenho saem da rede" |
| StatTrio caption | "De viajantes reais, sem moderação." | "De viajantes que já contrataram pelas empresas." |
| JSON-LD Organization | `aggregateRating` agregava ratings das empresas como se fossem da BV | Removido — BV não presta serviço, ratings ficam com cada empresa |
| JSON-LD Organization description | "Marketplace de fretamento turístico..." | "Plataforma de intermediação digital e comparação de preços..." |

---

## 2. Entregas concretas

### Componentes novos (`src/components/feature/landing/`)

10 arquivos:

- `section-eyebrow.tsx` — micro-rótulo numerado editorial
- `cartographic-ticks.tsx` — decoração SVG estilo atlas
- `curated-routes.ts` — 6 rotas hard-coded (data-only)
- `route-card.tsx` — card de rota com origem/destino + métricas
- `quick-route-chips.tsx` — atalho de rotas no hero
- `compare-matrix.tsx` — tabela "vs comprar direto"
- `company-strip.tsx` — directório das 8 empresas reais
- `stat-trio.tsx` — três números grandes
- `testimonial-card.tsx` — depoimento real com frame-corner
- `faq-accordion.tsx` — FAQ Radix com 8 perguntas
- `b2b-callout.tsx` — faixa B2B navy
- `reveal.tsx` — wrapper de scroll-reveal client-side

### Páginas reescritas / novas

- `src/app/page.tsx` — landing com **9 seções** + JSON-LD (WebSite, Organization, FAQPage)
- `src/app/seja-parceiro/page.tsx` — placeholder B2B com `lead-form.tsx`
- `src/app/termos/page.tsx` — Termos de Uso e Política de Privacidade (5 seções com TOC sticky)

### Páginas existentes — Footer adicionado

Páginas que **não tinham Footer** receberam pra que o **aviso legal**
apareça em todas as rotas conforme exigido:

- `src/app/login/page.tsx`
- `src/app/not-found.tsx`
- `src/app/error.tsx`
- `src/app/auth/erro/page.tsx`

### Footer (`src/components/layout/footer.tsx`)

- Reorganizado em 3 colunas: Buscou · Empresa · Suporte
- Adicionado link "Perguntas frequentes" pra `/#duvidas`
- Adicionado link "Para empresas" pra `/seja-parceiro`
- Privacidade vai para `/termos#dados` (deep-link)
- Cancelamentos vai para `/termos#cancelamentos`
- Contato é mailto direto
- **Bloco "Aviso legal" novo** com o disclaimer fixo em todas as páginas:
  > "A Buscou Viajou é uma plataforma de intermediação digital e comparação
  > de preços. Não prestamos serviços de transporte ou turismo. A
  > responsabilidade pela prestação do serviço contratado é exclusiva da
  > empresa parceira escolhida pelo usuário."

### Consent LGPD (checkbox required)

Adicionado em **dois pontos de coleta de dados**:

- `src/app/login/login-form.tsx` — antes de pedir o magic link
- `src/app/seja-parceiro/lead-form.tsx` — antes de submeter o lead B2B

Texto exato:
> "Li e concordo com os Termos de Uso e Política de Privacidade da Buscou
> Viajou e entendo que a plataforma atua apenas como intermediadora de
> comparação de preços."

Comportamento:
- Checkbox required, bloqueia submit se não marcado
- Erro inline em vermelho + toast warning
- Link pros Termos abre em nova aba (`target="_blank"`)
- Borda em `bv-danger` no estado de erro

### Tokens CSS adicionados (`src/styles/globals.css`)

- `bv-stagger` — fade-up sequencial pro hero (delays 0/100/200/300/400/500ms)
- `bv-reveal` / `is-visible` — fade-up disparado por IntersectionObserver
- `prefers-reduced-motion` cobre todas — instant ou pulse

### Tailwind config (`tailwind.config.js`)

- Keyframes + animation `accordion-down`/`accordion-up` para Radix Accordion
- Usa `var(--radix-accordion-content-height)` (nativa do Radix)

### Dependência nova

- `@radix-ui/react-accordion` (~5KB) pro FAQ

---

## 3. Estrutura final da Landing

```
[NAVBAR]
HERO (bv-canvas + ticks cartográficos + bv-stagger)
  • JourneyTag · H1 bicolor · Dek · SearchForm
  • Trust mini (8 empresas · 1.321 avaliações · cobertura nacional)
  • QuickRouteChips (4 rotas populares como atalhos)

01 — DESTINOS — Rotas em alta (6 RouteCards 3×2 desktop)
02 — COMO FUNCIONA — 3 passos com diagonal flow + SVG line conectando
03 — DIFERENCIAL — Pare de ligar. Compare aqui. (CompareMatrix)
04 — REDE — 8 empresas reais (CompanyStrip) + StatTrio
05 — VOZES — 1 testimonial big + 2 small (dados reais via API)
06 — DÚVIDAS — 8 FAQ items (texto definitivo do cliente)
B2B Callout — "Tem ônibus, vans ou micro-ônibus parados?" (navy)
CTA Fechamento — JourneyTag + "Buscar viagens"

[FOOTER com 3 cols + Aviso Legal + assinatura]
```

---

## 4. Validação executada

- ✅ `npx tsc --noEmit` — 0 erros
- ✅ Visual probe (curl) em 7 rotas — todos status corretos (200 ou 404)
- ✅ Conteúdo verificado em 41 markers únicos (8 FAQ Q's + sections + disclaimers)
- ✅ Backend health — `database: reachable`, latência ~80ms
- ✅ Hash anchors — `/termos#dados`, `/termos#cancelamentos` resolvem
- ⚠️  E2E Playwright NÃO rodado (dependeria de instalar Chromium — pulado a pedido)
- ⚠️  Lint NÃO rodado (next-lint pediria setup interativo — pulado)

### Matchers E2E ajustados

- `tests/e2e/pages/home-page.ts:16` — heading regex passou pra `/Compare fretamentos/i`
- `tests/e2e/responsive.spec.ts:17` — mesmo ajuste

Os outros matchers (`getByRole('button', { name: /Buscar viagens/i })`,
`#origin`, `#destination`, `#date`) **não mudaram** e continuam compatíveis.

---

## 5. Fora de escopo (intencionalmente não fiz)

Coisas que existem no demo mas contradizem o novo posicionamento — vão
exigir decisão de produto antes de mexer:

- `/veiculo/[id]` botão "Solicitar Reserva" → cria booking via BV. Se BV
  não processa reserva, esse fluxo precisa virar lead-handoff (envia
  contato pra empresa, não cria booking).
- `/reserva/[id]` mostra bilhete digital com QR + botão DEMO de
  approve-and-pay. Mesmo problema.
- `/minhas-viagens` agrega bookings da BV. Sob comparador puro,
  faria mais sentido mostrar histórico de leads enviados.
- Backend: rotas `POST /v1/bookings`, `_demo/approve-and-pay`, `/cancel`,
  `/ticket` — todas pressupõem BV transacional. Em produção viram
  endpoints de lead-tracking ou somem.

**Recomendação:** decisão estratégica de produto. Se o caminho for
"comparador puro" definitivamente, há um Fase 2 substancial pra remodelar
o backend e os flows de pós-busca. Se o caminho for "comparador hoje,
marketplace amanhã", a LP atual já comunica a fase atual com clareza.

---

## 6. Próximos passos sugeridos

1. **Decidir oficialmente o modelo** (ver §5 acima)
2. **Atualizar PRD** (`_context/PRD_BuscouViajou_v1.md`) pra refletir o modelo escolhido
3. **Atualizar `_context/IA/`** (sitemap, user-flows, states-matrix, api-contract) caso o modelo mude
4. **Rodar suite E2E** completa quando Playwright Chromium for instalado
5. **Coletar foto real de ônibus/vans** (S7 do design-review-pass-1) pra eventual seção visual
6. **Substituir mailto:contato@buscouviajou.demo** por email real de produção
7. **Customizar template do magic link** no Supabase pra match brand

---

## 7. Arquivos tocados (resumo)

### Criados (15)
```
src/app/seja-parceiro/page.tsx
src/app/seja-parceiro/lead-form.tsx
src/app/termos/page.tsx
src/components/feature/landing/section-eyebrow.tsx
src/components/feature/landing/cartographic-ticks.tsx
src/components/feature/landing/curated-routes.ts
src/components/feature/landing/route-card.tsx
src/components/feature/landing/quick-route-chips.tsx
src/components/feature/landing/compare-matrix.tsx
src/components/feature/landing/company-strip.tsx
src/components/feature/landing/stat-trio.tsx
src/components/feature/landing/testimonial-card.tsx
src/components/feature/landing/faq-accordion.tsx
src/components/feature/landing/b2b-callout.tsx
src/components/feature/landing/reveal.tsx
_context/lp-redesign-plan.md
_context/lp-redesign-execution-log.md (este)
```

### Modificados (12)
```
src/app/page.tsx                    (reescrito completo)
src/app/login/page.tsx              (Footer adicionado, min-h ajustado)
src/app/login/login-form.tsx        (consent LGPD)
src/app/not-found.tsx               (Footer + bicolor inline fix)
src/app/error.tsx                   (Footer adicionado)
src/app/auth/erro/page.tsx          (Footer adicionado)
src/components/layout/footer.tsx    (cols reorganizadas + aviso legal)
src/lib/api/types.ts                (tipos Company + CompanyReview)
src/styles/globals.css              (animations stagger + reveal)
tailwind.config.js                  (animations accordion)
tests/e2e/pages/home-page.ts        (heading regex novo)
tests/e2e/responsive.spec.ts        (heading regex novo)
package.json + package-lock.json    (radix-accordion adicionado)
```
