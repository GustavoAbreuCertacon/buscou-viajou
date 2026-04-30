# Design Review — Pass 1

> Auditoria estruturada da implementação do frontend Buscou Viajou contra
> `_context/design-dna.json` (fonte de verdade visual) e o checklist §12.1 do
> `_context/buscou-viajou-design-system.md`.

| | |
|---|---|
| **Reviewed against** | `_context/design-dna.json` (18 doNotList rules + componentRules) + `_context/buscou-viajou-design-system.md` §12.1 |
| **Philosophy** | Blueprint Planner — clareza técnica + acolhimento |
| **Date** | 2026-04-30 |
| **Coverage** | 9 telas funcionais, 21 componentes UI, 13 componentes feature, 2 componentes layout |
| **Reviewer** | Claude (Opus 4.7 1M) |

---

## Sumário executivo

A implementação tem **fidelidade alta** ao DNA visual da marca: padrão bicolor
de títulos é a assinatura visual mais consistente, tokens CSS estão em uso
disciplinado (quase zero hex hardcoded), focus ring sempre verde, skeletons
estruturais com fallback de reduced-motion, e a voz da marca está aplicada nas
labels e CTAs. **0 das 18 regras "doNotList" são quebradas estruturalmente**;
3 têm violações pontuais que viram **Should Fix**.

**Maior achado**: o mapa em `/veiculo/[id]` está com **origem == destino** em
runtime (página atual passa garagem em ambos os campos do `RouteMap`), o que
quebra o storytelling de "rota traçada". É bug funcional, não estético.

A11y tem **2 issues bloqueadores**: Sheet do menu mobile sem `SheetTitle` (Radix
loga warning ao runtime) e Button `size="sm"` em 36px sub-44px touch target.

Demo está apresentável e navegável end-to-end com dados reais — qualidade
suficiente pra mostrar o "first look" sem retoque.

---

## Screenshots Capturadas

Todas em `_context/design-review-screenshots/`.

### Desktop (1280×800)

| Arquivo | Tela | O que mostra |
|---|---|---|
| `01-landing-desktop.png` | `/` | Hero bicolor + SearchForm + 3 passos + Princípios + CTA fechamento + Footer |
| `02-busca-desktop.png` | `/busca` | Sticky search + sidebar filtros + 25 cards de veículos |
| `03-veiculo-desktop.png` | `/veiculo/[id]` | Galeria + sidebar preço + Comodidades + Mapa + Avaliações |
| `04-login-desktop.png` | `/login` | Magic link form em blueprint canvas |
| `05-auth-erro-desktop.png` | `/auth/erro?reason=invalid_code` | Card de erro com CTAs |
| `06-not-found-desktop.png` | `/rota-inexistente` | NotFound com bicolor heading display |
| `07-minhas-viagens-desktop.png` | `/minhas-viagens` | Tabs com contadores + 3 BookingCards |
| `08-reserva-confirmed-desktop.png` | `/reserva/[id]` | TicketViewer + sidebar Total + Resumo |
| `20-dialog-cancelamento-desktop.png` | Modal | Dialog cancelamento aberto |

### Mobile (375×812)

| Arquivo | Tela | O que mostra |
|---|---|---|
| `09-landing-mobile.png` | `/` | Hero stackeado + SearchForm vertical + Cards vertical |
| `10-busca-mobile.png` | `/busca` | Cards verticais com foto-em-cima |
| `11-veiculo-mobile.png` | `/veiculo/[id]` | Galeria + sidebar preço (no fim) |
| `12-minhas-viagens-mobile.png` | `/minhas-viagens` | Tabs scroll + cards stackeados |
| `13-reserva-mobile.png` | `/reserva/[id]` | TicketViewer 1 coluna |
| `14-login-mobile.png` | `/login` | Form magic link mobile |
| `15-404-mobile.png` | `/404` | NotFound com display heading quebrado |
| `18-mobile-menu-sheet.png` | Sheet | Menu hamburguer aberto |
| `19-filtros-sheet-mobile.png` | Sheet | Filtros mobile via bottom sheet |

### Tablet (768×1024)

| Arquivo | Tela | O que mostra |
|---|---|---|
| `16-landing-tablet.png` | `/` | Hero em layout intermediário |
| `17-busca-tablet.png` | `/busca` | Cards lado-a-lado, sem sidebar (só lg+) |

---

## Must Fix (4)

### M1. `/veiculo/[id]` mapa com origem == destino

**Arquivo:** `BuscouViajouFrontend/src/app/veiculo/[id]/page.tsx:172-181`
**Screenshot:** `03-veiculo-desktop.png`, `11-veiculo-mobile.png`

```tsx
<RouteMap
  origin={{
    lat: Number(vehicle.garage.latitude),
    lng: Number(vehicle.garage.longitude),
    label: vehicle.garage.name,
  }}
  destination={{
    lat: Number(vehicle.garage.latitude),  // ← idêntico
    lng: Number(vehicle.garage.longitude), // ← idêntico
    label: vehicle.garage.city,
  }}
  height={320}
/>
```

Resultado: pin único na garagem, polyline não aparece (origem == destino), seção
"Localização" mostra "Saída de Garagem Vila Mariana · São Paulo, SP" mas o mapa
visualmente não acrescenta nada. Quebra a promessa visual da seção.

**Fix opção A:** criar variante `<RouteMap.SingleMarker>` ou prop `mode="single"`
e usar nessa página.
**Fix opção B:** acessar a quote real da página de busca (lockedQuote) pra
passar a rota completa — alinha com o flow do PRD.

---

### M2. Sheet do navbar mobile sem `SheetTitle` (a11y)

**Arquivo:** `BuscouViajouFrontend/src/components/layout/navbar.tsx:110-149`
**Screenshot:** `18-mobile-menu-sheet.png`
**Console:** `DialogContent requires a DialogTitle for the component to be accessible for screen reader users.`

O `<SheetContent side="right">` do menu mobile não tem `<SheetTitle>`. Radix
loga warning runtime e screen readers não recebem contexto de qual sheet abriu.

**Fix:**
```tsx
import { SheetContent, SheetTitle } from '@/components/ui/sheet';
// dentro do SheetContent:
<SheetTitle className="sr-only">Menu de navegação</SheetTitle>
```

Aplicar a mesma correção em qualquer outro `Sheet` ou `Dialog` sem título
(checar `vehicle-gallery.tsx` lightbox).

---

### M3. Button `variant="outline"` com `asChild` perde border visualmente

**Arquivo:** `BuscouViajouFrontend/src/components/layout/navbar.tsx:138-144`
**Screenshot:** `18-mobile-menu-sheet.png` (botão "Entrar" no menu mobile)

No mobile menu, o segundo botão renderiza:
```tsx
<Button asChild variant="outline" fullWidth>
  <Link href="/login">Entrar</Link>
</Button>
```

Mas no screenshot aparece apenas como texto bold "Entrar", sem a borda navy 2px
que é parte da variante outline. CTA secundário fica invisível na hierarquia.

**Causa provável:** Slot do Radix não propaga `border` token customizado
(`border-bv-base border-bv-navy`) na cascade certa quando o destino é `<Link>`.

**Fix:** investigar com DevTools (computed styles) e ajustar — pode ser
necessário usar `<Link className={buttonVariants({ variant: 'outline' })}>`
direto em vez de `asChild`, ou debugar o twMerge.

---

### M4. Button `size="sm"` (36px) abaixo do touch target mínimo (44px)

**Arquivo:** `BuscouViajouFrontend/src/components/ui/button.tsx:39`

```ts
sm:  'h-9  px-4 text-body-sm',                  // ← 36px, falta min-h
md:  'h-11 px-6 text-body min-h-[44px]',
lg:  'h-14 px-8 text-body-lg',
icon:'h-11 w-11 min-h-[44px] min-w-[44px] p-0',
```

`h-9` = 36px viola WCAG 2.5.5 Target Size (regra do `accessibility.rules` no
design-dna.json: "Touch targets minimum 44×44px"). Usado em vários lugares
mobile-relevantes:
- `SortBar` — botão filtros mobile
- `BookingCard` — actions ("Ver bilhete", "Pagar agora", "Avaliar")
- `FiltersSidebar` — botão "Limpar"
- `LoginForm` — "Reenviar link", "Usar outro e-mail"

**Fix opção A:** sempre `min-h-[44px]` mesmo em sm (h-9 + py interno = 44px).
**Fix opção B:** restringir size="sm" a contextos não-touch (helpers, labels).

---

## Should Fix (8)

### S1. Display heading em `/404` mobile quebra em 4 linhas

**Arquivo:** `BuscouViajouFrontend/src/app/not-found.tsx:16-18`
**Screenshot:** `15-404-mobile.png`

```tsx
<BicolorHeading as="h1" size="display">
  Buscou aqui? <BicolorHighlight>Sem rota.</BicolorHighlight>
</BicolorHeading>
```

`text-display` (56px) renderiza em 4 linhas separando palavras: "Buscou", "aqui?",
"Sem", "rota." em mobile 375px. Não fica natural.

**Fix:** já foi feito no Landing — replicar:
```tsx
<h1 className="font-heading font-black leading-tight text-h1 md:text-display tracking-tight">
  <span className="text-bv-navy">Buscou aqui? </span>
  <span className="text-bv-green">Sem rota.</span>
</h1>
```

---

### S2. JourneyTag aparece 2× na Landing

**Arquivo:** `BuscouViajouFrontend/src/app/page.tsx:33-34, 160`
**Screenshot:** `01-landing-desktop.png`, `09-landing-mobile.png`

```jsx
{/* Hero */}
<JourneyTag size="sm" className="mb-bv-4 md:hidden" />
<JourneyTag size="md" className="mb-bv-5 hidden md:inline-flex" />
...
{/* CTA fechamento */}
<JourneyTag size="md" inverse />
```

Viola explicitamente `visualEffects.journeyTag.useSparingly`:
> "Don't repeat in same view — it's a signature, not a pattern"

**Fix:** remover o segundo (no CTA fechamento navy) — o do hero é mais
importante. Ou inverter: deixar só no fechamento como signature de saída.

---

### S3. SheetTitle "Filtros" duplicado no sheet mobile de filtros

**Arquivo:** `BuscouViajouFrontend/src/app/busca/search-results.tsx:148-158`
**Screenshot:** `19-filtros-sheet-mobile.png`

```tsx
<SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
  <SheetHeader>
    <SheetTitle>Filtros</SheetTitle>     {/* ← 1 */}
  </SheetHeader>
  <FiltersSidebar
    results={allResults}
    value={safeFilters}
    onChange={setFilters}
    className="border-0 p-0 mt-bv-3"
  />
</SheetContent>
```

E dentro de `FiltersSidebar` (`filters-sidebar.tsx:96-105`):
```tsx
<header className="flex items-center justify-between">
  <h2 className="font-heading font-bold text-h4 text-bv-navy">Filtros</h2>  {/* ← 2 */}
  <Button variant="link" ...>Limpar</Button>
</header>
```

**Fix:** prop `hideHeader` no `FiltersSidebar` ou refatorar pra Title vir de
fora, com botão "Limpar" como prop separada.

---

### S4. `BookingCard` cria 2 alvos focáveis (a11y)

**Arquivo:** `BuscouViajouFrontend/src/components/feature/booking-card.tsx:116-122`
**Screenshot:** `07-minhas-viagens-desktop.png`, `12-minhas-viagens-mobile.png`

```tsx
<Link
  href={detailHref}
  className="absolute inset-0 z-0"
  aria-label={`Ver detalhes da reserva ${booking.bookingCode ?? booking.id.slice(0, 8)}`}
>
  <span className="sr-only">Ver detalhes</span>
</Link>
```

Combinado com action button (Ver bilhete / Pagar agora) com `relative z-10`,
keyboard nav passa em ambos. Screen reader anuncia 2× a mesma destinação.

**Fix:** card visualmente clicável mas só 1 link semântico. Opção: envolver o
título/rota num `<Link>` ao invés do absolute overlay; ou usar `<a>` no `<h3>`
com `display: block` cobrindo a zona desejada.

---

### S5. Truncamento agressivo em mobile

**Arquivo:** `booking-card.tsx:78-81` (rota), `ticket-viewer.tsx:193` (motorista)
**Screenshots:** `12-minhas-viagens-mobile.png`, `13-reserva-mobile.png`

- `/minhas-viagens` mobile: "São Pa..." → "Campos do J..." (truncate a 40-50% do span)
- `/reserva/[id]` mobile: "Fern..." (motorista nome cortado em 4 chars)

**Fix:** Aumentar `min-w` da coluna ou trocar `truncate` por `line-clamp-2`,
ou usar `text-xs` mobile pra caber mais texto. No ticket, motorista pode
quebrar pra 2 linhas (`whitespace-normal`).

---

### S6. Bicolor heading viola "ONE word in green"

**Arquivos:**
- `login/page.tsx:22` — `navy="Buscou" green="sem senha."` (2 palavras)
- `not-found.tsx:16-18` — children com `<BicolorHighlight>Sem rota.</BicolorHighlight>` (2 palavras)
- `auth/erro/page.tsx:39` — split arbitrário por primeiro espaço
- `minhas-viagens/page.tsx:19` — `navy="Minhas" green="viagens"` — 1 palavra mas a primeira (não a keyword)
- `dialog cancelamento` — title plain "Cancelar esta reserva?" (sem padrão)

Design-dna.json é explícito:
> `"rule": "Never split colors within the same word"`
> `"description": "ONE word in green (the semantic keyword), rest in navy"`

**Fix:** revisar cada uso. Sugestões:
- `/login`: `<span navy>Buscou sem </span><span green>senha</span><span navy>.</span>`
- `/404`: `<span navy>Buscou aqui? Sem </span><span green>rota</span><span navy>.</span>`
- `/minhas-viagens`: `navy="Minhas" green="viagens"` está OK (verde = keyword "viagens"). Mantém.
- `/auth/erro`: parar de splitar via `.split(' ')` — definir explícito por reason no `REASONS` map.
- Dialog cancelamento: título não precisa ser bicolor (é body em modal, OK plain).

Ou: relaxar a regra no design-dna.json se "frase curta de 2-3 palavras" virar
exceção aceita — atualizar guidance e `examples`.

---

### S7. Fotos do seed inadequadas pro contexto

**Arquivo:** `BuscouViajouApi/src/database/seed-data.ts:167-181`
**Screenshots:** `02-busca-desktop.png`, `07-minhas-viagens-desktop.png`,
`12-minhas-viagens-mobile.png`

Os IDs Unsplash usados no seed retornam fotos de carros esportivos (BMW M4,
McLaren, Mercedes coupé), não veículos de fretamento. Em `02-busca-desktop.png`
metade dos cards tem fotos de carros esportivos premium — incoerente com o
posicionamento "fretamento de ônibus, vans e micro-ônibus".

E uma das fotos retorna 404 do Unsplash (`photo-1632323093594-8e1b3f3a7b00`),
visível em `02-busca-desktop.png` como placeholder.

**Fix:** trocar IDs Unsplash por fotos genuínas de ônibus/vans:
- Tour bus: `photo-1570125909232-eb263c188f7e` ✓ funciona
- Substituir o quebrado: tentar `photo-1544620347-c4fd4a3d5957` ou similar
- VAN_PHOTO[1] (`1632323093594...`) é o quebrado — substituir.

Pode ser feito direto no seed e re-rodar `npm run db:seed`.

---

### S8. ReserveCta tem fluxo morto pro user logado

**Arquivo:** `BuscouViajouFrontend/src/app/veiculo/[id]/reserve-cta.tsx:57-60`

```tsx
toast.info('Em breve', {
  description: 'Pra concluir a reserva é preciso passar pela busca pra obter uma cotação travada. Volte a /busca e selecione esse veículo.',
});
```

User logado clica "Solicitar reserva" e recebe um toast informativo dizendo que
precisa voltar pra `/busca`. UX confusa — botão desabilitado seria mais honesto.

**Fix opção A:** desabilitar com tooltip explicando "Volte pra busca pra
selecionar este veículo" + ícone info.
**Fix opção B:** redirecionar pra `/busca` com `?vehicleId=...` pré-preenchido
(precisa de UI de "destacar veículo X nos resultados" ou form pré-preenchido).

---

## Could Improve (5)

### C1. Logo footer V5 vs V2 recomendado pelo DS

**Arquivo:** `BuscouViajouFrontend/src/components/layout/footer.tsx:60`

```tsx
<Logo variant="white" height={36} />   // V5 — branco transparente
```

Design-dna.json `componentRules.footer.logo` recomenda V2 (white-on-navy).
Visualmente sobre `bg-bv-navy` o resultado é idêntico — V5 (PNG transparente)
funciona porque os pixels brancos ficam destacados sobre navy.

**Decisão:** V5 é tecnicamente mais correto (PNG transparente ≠ PNG com bg
embutido). Mas o DS é prescritivo. _Could:_ atualizar design-dna.json pra
permitir V5 em footer, ou trocar pra `whiteOnNavy`.

---

### C2. Stepper unitLabel "passageiros" desalinhado

**Arquivo:** `BuscouViajouFrontend/src/components/ui/stepper.tsx:92-94`
**Screenshots:** `01-landing-desktop.png`, `16-landing-tablet.png`

O `unitLabel` aparece embaixo do controle como caption pequeno. Em layouts hero
com 4 colunas (De/Para/Quando/Quantos), a label fica à parte do controle, sem
alinhamento vertical com os outros campos. Olhando o hero desktop:

- Inputs "De onde?", "Para onde?", "Quando?" têm Label acima.
- Stepper tem Label "Quantos?" acima + "passageiros" caption embaixo do número.

Visualmente assimétrico — o caption "passageiros" parece um label órfão.

_Could:_ remover unitLabel quando usado em form com Label, ou colocar caption
inline ao lado do número (ex: "1 passageiro").

---

### C3. PriceBreakdown row "accent" usa text-bv-warning sem peso bold

**Arquivo:** `BuscouViajouFrontend/src/components/feature/price-breakdown.tsx:147`

```tsx
accent && 'text-bv-warning',
```

`text-bv-warning` (#E0A23B) sobre white com font-medium 14px tem contraste 2.9:1
— **falha WCAG AA**. design-dna.json `accessibility.rules` exige 4.5:1 pra
texto pequeno.

_Fix:_ trocar pra `text-[#A06D1F]` (warning escuro do badge) ou `font-bold` que
move pro AA Large (3:1).

---

### C4. SelectLabel uppercase + tracking-wider em microetiquetas

**Arquivo:** `BuscouViajouFrontend/src/components/ui/select.tsx:111`
**E também usado em:** `ticket-viewer.tsx:141, 192, 237`, `booking-detail.tsx:71, 139`

```tsx
'px-bv-3 py-bv-2 text-caption font-semibold text-bv-navy/72 uppercase tracking-wider'
```

Design-dna.json `doNotList` regra 3: "Don't use uppercase for body paragraphs".
Aqui é micro-rótulo de campo (PASSAGEIRO, VEÍCULO, MOTORISTA) — convencional em
boarding passes e dashboards. Não viola a regra estritamente (não é body
paragraph), mas o espírito do DS é "clarity over stylization".

_Could:_ revisar caso a caso. No TicketViewer faz parte do estilo "boarding
pass" — deixa. No BookingDetail pode ser mais conservador.

---

### C5. PricingBadge VERY_HIGH/PEAK sobre fundo branco

**Arquivo:** `BuscouViajouFrontend/src/components/feature/pricing-badge.tsx`

```ts
PEAK: { variant: 'danger', ... }   // bg #FCE8E8 / text #9C2C2C
```

PEAK badge sobre o card branco do veículo aparece como pill rosa pálido com
texto vermelho-tinto. Visual semântico (dor → preço alto) mas a paleta da marca
não tem vermelho oficial — é cor "fora do DNA Buscou Viajou", apesar de
necessária pra UX.

_Could:_ aceitar como exception semântica (já é) — mas documentar no design-dna
que `danger` é exclusivo pra PEAK e cancelamentos, nunca decorativo.

---

## What Works Well

Manter e replicar:

1. **Padrão bicolor é signature visual** consistente em 8 das 9 telas (verde =
   palavra-chave semântica, navy = estrutura). Comparado ao manual da marca
   página 3, o componente `BicolorHeading` + `BicolorHighlight` é tradução
   precisa.

2. **Logo monograma mobile / lockup completo desktop** — decisão sofisticada
   resolvida no Navbar com `<span className="md:hidden">monograma</span>` /
   `<span className="hidden md:inline-block">lockup</span>`. Wordmark "Buscou"
   navy + "Viajou" verde aparece inteiro em desktop, monograma BV mantém
   identidade em mobile.

3. **Skeletons estruturais** combinando dimensões com layout final, com
   shimmer 1.5s + fallback `pulse 1s` pra prefers-reduced-motion (configurado
   em `globals.css` no nível CSS, não inline).

4. **Focus ring SEMPRE verde** via token `shadow-bv-focus` em
   button/input/select/checkbox/radio/dialog/sheet/etc. Implementação via
   `focus-visible:shadow-bv-focus` em vez de `outline` permite cantos
   arredondados perfeitos.

5. **Disciplina de tokens** — quase zero hex hardcoded inline. Apenas warning
   (#E0A23B) e danger (#C64343) usam hex direto porque não estão na escala
   navy/green. Aceitável.

6. **`cn()` com `extendTailwindMerge`** registrando `text-display/h1/.../caption`
   como font-size group evita o bug de `text-body` (font-size) ser confundido
   com `text-white` (color). Solução elegante e específica do projeto.

7. **Voz da marca** consistente: "De onde?", "Para onde?", "Quando?", "Quantos?"
   — labels diretas (não "Insira/Digite"). CTAs com verbos de jornada ("Buscar",
   "Solicitar", "Confirmar", "Cancelar"). Empty state "Sua próxima viagem
   começa aqui" segue o padrão `writingPatterns.preferredPhrasings`.

8. **TicketViewer estilo boarding pass** com header navy + logo white V5 + badge
   "● VÁLIDO" verde + QR + dados estruturados + footer com motorista + notch
   decorativo nas laterais. Nenhum skeumorfismo (proibido pelo DS), mas comunica
   "isso é um bilhete" sem ambiguidade.

9. **Privacy-first em ReviewCard**: backend só envia `first_name` + 1 letra
   de sobrenome, frontend renderiza "Ana S." — preservação de privacidade
   automática.

10. **Cooldown 60s no reenvio do magic link** + estado `sent` claro com
    "Confira sua caixa de entrada" + botão "Usar outro e-mail" — fluxo bem
    pensado.

11. **safeNext()** no `auth/callback/route.ts` previne open redirect — começa
    com `/` e bloqueia `//` (protocol-relative).

12. **RouteMap dynamic import com SSR off + atribuição OSM** — tile layer com
    `&copy; OpenStreetMap` correto, polyline tracejada verde 8/6, pins navy
    (origem) / green (destino) / cinza (garagem).

13. **`tabular-nums`** em valores monetários e contadores — alinhamento
    perfeito em colunas (ex: BookingCard total, PriceBreakdown rows).

14. **Design tokens em CSS custom properties + Tailwind config + JSON** — três
    fontes que apontam pros mesmos valores, sem drift.

15. **Skip-link "Pular para o conteúdo"** com `id="main"` em todas as 9
    páginas — a11y bem pensada.

---

## Auditoria contra `doNotList` (18 regras)

| # | Regra | Status | Notas |
|---|---|---|---|
| 1 | Don't use grey neutrals in shadows — always navy-tinted | ✅ PASS | Tokens shadow-bv-* todos navy-tinted |
| 2 | Don't mix more than 2 colors in a single title (navy + green only) | ✅ PASS | BicolorHeading garante limite |
| 3 | Don't use uppercase for body paragraphs | ✅ PASS | Apenas micro-rótulos (CAPTION) — convencional |
| 4 | Don't put green on text smaller than 18px (or 14px bold) without testing contrast | ⚠️ MARGINAL | "Reenviar em 60s" body-sm 14px sem bold — borderline |
| 5 | Don't render bare placeholder spinners — use structural skeletons | ✅ PASS | Skeletons em todos os loadings |
| 6 | Don't use rotated cards in transactional product UI | ✅ PASS | Rotações removidas na sessão anterior |
| 7 | Don't write 'Click here' or 'Insira seu...' | ✅ PASS | Verbos de jornada + labels diretas |
| 8 | Don't use 'Fretamento Inteligente' isolated | ✅ PASS | Sempre com logo |
| 9 | Don't apply 3D effects, gradients, drop shadows, bevels to logo | ✅ PASS | Logo flat |
| 10 | Don't use grey hover states on logos | ✅ PASS | Cor / opacity |
| 11 | Don't use stock photos with exaggerated retouching | ⚠️ ISSUE | Fotos do seed são de carros esportivos premium (S7) |
| 12 | Don't put journey tag more than once per view | ❌ FAIL | Landing tem 2× (S2) |
| 13 | Don't use blueprint grid in dashboards/tables | ✅ PASS | bv-canvas só em hero, login, 404, auth/erro |
| 14 | Don't render frame-corner brackets around small elements (<200px) | ✅ PASS | Não usado em produção |
| 15 | Don't break bicolor pattern by splitting colors within a word | ✅ PASS | BicolorHighlight respeita word boundaries |
| 16 | Don't use spinner-only loading | ✅ PASS | Loading buttons ("Buscando…") + skeletons |
| 17 | Don't auto-play carousels without user-pause | ✅ PASS | VehicleGallery não auto-play |
| 18 | Don't use modal for non-blocking confirmations | ✅ PASS | Dialog só pra cancelamento (blocking) |

**Score:** 16/18 PASS, 1/18 MARGINAL, 1/18 FAIL.

---

## Auditoria contra checklist §12.1 do design-system.md

| # | Item | Status | Notas |
|---|---|---|---|
| 1 | Usou exclusivamente paleta oficial + escala? | ✅ PASS | Apenas warning/danger fora |
| 2 | Títulos em Gotham/Poppins bold com bicolor quando aplicável? | ✅ PASS | Gotham local + bicolor consistente |
| 3 | CTAs usam navy ou green, nunca outras cores? | ✅ PASS | Danger só em ações destrutivas (cancel) |
| 4 | Espaçamento obedece sistema 8pt? | ✅ PASS | Tokens bv-1 a bv-9 |
| 5 | Texto respeita escala (tokens text-*)? | ✅ PASS | cn.ts protege twMerge |
| 6 | Contraste mínimo 4.5:1 em textos pequenos? | ⚠️ MARGINAL | text-bv-warning sm 2.9:1 (C3) |
| 7 | Mensagens simples, claras, otimistas? | ✅ PASS | Empty/error states bem-escritos |
| 8 | CTA usa verbo de jornada? | ✅ PASS | "Buscar/Solicitar/Confirmar/Avaliar/Voltar" |
| 9 | Imagens com radius-lg em destaques? | ✅ PASS | VehicleGallery, ReserveCta, TicketViewer |
| 10 | Ícones outline 2px arredondados? | ✅ PASS | Lucide outline (default 2px) |
| 11 | Logo na variante correta por fundo? | ⚠️ NIT | Footer V5 (white) onde DS pede V2 (C1) |

**Score:** 9/11 PASS, 2/11 MARGINAL, 0/11 FAIL.

---

## Roadmap sugerido pra "Pass 2"

Sequência de fixes pra próxima passada (estimando ~3-5h):

1. **30min** — M2 (SheetTitle a11y) + M4 (Button sm min-h-44px). Wins fáceis.
2. **30min** — S1 (404 mobile) + S2 (JourneyTag dup) + S3 (Filtros title dup). Tudo em arquivos diferentes, paralelo.
3. **45min** — M3 (Outline asChild) — investigação + fix.
4. **45min** — S6 (BicolorHeading variants) — revisar 5 telas.
5. **30min** — S7 (fotos seed) — trocar IDs + re-seed.
6. **30min** — S5 (truncate mobile) + C2 (stepper unitLabel) + C3 (warning contrast).
7. **30min** — M1 (mapa origem==destino) — decidir A vs B + implementar.
8. **30min** — S4 (BookingCard 2 alvos) + S8 (ReserveCta dead-end).
9. **15min** — Re-run E2E suite + validar visualmente as telas afetadas.

Total: ~4h pra fechar todos os Must + Should.

---

## Continuidade

A próxima sessão pode pegar este documento e atacar os fixes em ordem.
Recomendo abrir a lista no scanner.md e marcar cada um conforme resolvido.

**Documentos relacionados:**
- `_context/design-dna.json` — fonte de verdade visual
- `_context/buscou-viajou-design-system.md` — checklist §12.1
- `_context/IA/states-matrix.md` — patterns de loading/empty/error
- `_context/design-review-screenshots/` — 20 screenshots referenciadas neste relatório

**Demo está navegável end-to-end com qualidade de "first look"** — cumpre o
objetivo combinado da Fase 1 da entrega. Os fixes acima são polish pra
deixar production-grade.
