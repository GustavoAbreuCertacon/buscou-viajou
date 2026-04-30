# LP Redesign — Plano de Execução

> Plano detalhado para elevar a Landing Page de `Buscou Viajou` a referência
> máxima do ramo de fretamento turístico brasileiro. Lê e respeita o
> `design-dna.json`, o `design-system.md`, o estado atual da página e
> as 28/28 E2E verdes da Fase 7. Produzido após leitura integral de:
> CLAUDE.md, IA (sitemap/user-flows/states-matrix/api-contract),
> design-dna, current `page.tsx`, components inventory, navbar, search-form,
> bicolor-heading, journey-tag, design-review-pass-1, e probes da API real
> (companies, cities).

| | |
|---|---|
| **Autor** | Claude (Opus 4.7) — frontend-design skill |
| **Data** | 2026-04-30 |
| **Branch sugerida** | `feat/lp-editorial-cartography` |
| **Arquivos impactados** | `src/app/page.tsx` + 5-7 novos componentes em `src/components/feature/landing/` |
| **Tempo estimado** | 4-6h de execução pós-aprovação |

---

## 1. Direção estética: Editorial Cartography

**Comprometida.** Não é "polish marginal" — é uma reinterpretação visual da
identidade existente "Blueprint Planner" empurrada pra um ponto distintivo:
**uma revista de planejamento de jornada**.

### O conceito em uma frase

> "Trate o fretamento como cartógrafos sérios tratam mapas: clareza obsessiva,
> tipografia editorial, marcas geográficas como ornamento, dados como
> evidência. Calor humano nas avaliações e nos verbos."

### Pilares visuais

| Pilar | Aplicação |
|---|---|
| **Tipografia editorial** | Gotham Black (900) em hero display, Gotham Bold (700) em h2/h3, Hind regular pra corpo, Gotham Bold em micro-rótulos numerados ("01 — A BUSCA") |
| **Marcas cartográficas** | Sutil: pequenos ticks de latitude/longitude no fundo do hero (decoração, não funcional), arrow-routes finos atrás de cards, compass-rose minimal em separadores de seção |
| **Hierarquia editorial** | Eyebrow numerada por seção (estilo magazine), heading bicolor, dek (subhead), corpo, caption pequena com fonte para rotas |
| **Asymmetry intencional** | Hero com SearchForm "deslocada" pro 60% direito (não centralizada), seções alternam alinhamento de eyebrow esquerda/direita |
| **Cor disciplinada** | Mantém regra 60% neutro / 30% navy / 10% green. Verde concentrado em CTAs + palavras-chave bicolor + ratings stars + journey signature |
| **Geometria** | `bv-canvas` (blueprint grid) só no hero. Linhas SVG finas de rota (curva tracejada navy) entre seções relevantes. Frame-corner em destaque ÚNICO (testimonial) |
| **Densidade variável** | Hero: respiro extremo. Rotas/empresas: media-densa. Comparativo: matriz limpa. Avaliações: cards levemente assimétricos. FAQ: lista contida |

### O que NÃO usar (anti-references confirmados)

- Gradiente roxo-pra-rosa (clichê AI)
- Hero de imagem fullbleed com texto sobreposto
- Mascote animado / ilustração genérica
- Foto de família no aeroporto / palmeiras / influencer-traveler
- Carrossel autoplay
- Counters "fake live" sem dados reais (mas ver pergunta P5)
- Emoji em copy ("✈️", "🚌") fora de contexto técnico
- "A jornada começa aqui" / "Suas férias dos sonhos" / clichês turísticos

### Referência mental concreta

Pense em uma página de **abertura da The New York Times Travel** + **Stripe Atlas** + um touch da **Linear changelog**. Editorial, não folksy. Confiante, não barulhento.

---

## 2. Diagnóstico do estado atual

A `page.tsx` atual já é **competente** (Fase 5 verde) mas é "by the book":
hero genérico → 3 passos → 3 valores → CTA fechamento. Funciona — mas é a
mesma estrutura de 90% dos marketplaces. Não é inesquecível.

### O que mantém-se (não regredir)

✅ SearchForm hero variant — coração da experiência, já é melhor que dos concorrentes (Buser/ClickBus pedem login antes)
✅ Bicolor heading — assinatura
✅ Trust signals inline (Empresas verificadas · Pagamento seguro · Melhor preço)
✅ Skeleton loaders (Fase 7)
✅ Voice da marca já aplicada
✅ Tokens disciplinados

### O que precisa elevar

🔴 **Faltam dados reais como social proof.** A página tem zero números reais (8 empresas, 25 veículos, 1.321 avaliações agregadas, cobertura Sul-Norte) — tudo isso está em DB e não aparece.

🔴 **"3 passos"/"3 valores" é simétrico demais.** Visualmente é a mesma seção repetida.

🔴 **Sem rotas exemplo.** Marketplace sem mostrar o catálogo é como Trivago sem listar destinos. Reduz fricção de digitação no SearchForm e ensina o produto.

🔴 **Sem comparativo.** A diferenciação (vs ligar direto pra empresa) está no PRD mas não na LP. Usuário precisa entender "por que aqui e não no telefone".

🔴 **Sem testimonials reais.** Tem 8 reviews no seed. Não usar é desperdício.

🔴 **Sem FAQ.** Mata SEO, mata objeção, mata trust.

🔴 **Sem callout B2B.** `/seja-parceiro` é Fase 2 mas aparecer "anuncie sua frota" gera lead-list (vale a pena, mesmo dummy).

🔴 **JourneyTag duplicado** (S2 do design-review já apontou).

🔴 **Sem motion intencional.** Carregamento da hero é instantâneo, sem stagger, sem reveal.

🔴 **Hierarquia visual chata.** Tudo é card-em-grid. Editorial pede variação rítmica.

---

## 3. Mapa de seções (wireframe textual)

### Sections (10 totais, scroll natural ~3-4 viewports)

```
┌──────────────────────────────────────────────────────────────────┐
│  [NAVBAR sticky]                                                 │
├──────────────────────────────────────────────────────────────────┤
│  HERO (bv-canvas)                                                │
│  ┌────────────────────────────────────────┐                      │
│  │ JOURNEYTAG (md)                        │                      │
│  │                                        │                      │
│  │ H1 DISPLAY (bicolor)                   │                      │
│  │ Compare fretamentos lado a lado.       │                      │
│  │ Reserve em minutos.                    │                      │
│  │                                        │                      │
│  │ Dek (body-lg, navy/72)                 │                      │
│  │ Vans, micro-ônibus e ônibus de         │                      │
│  │ empresas verificadas em todo o Brasil. │                      │
│  │                                        │                      │
│  │ ┌──────────────────────────────────┐   │                      │
│  │ │ SEARCHFORM (variant=hero)         │   │                      │
│  │ │ De onde? Pra onde? Quando? Quants? [Buscar viagens →] │     │
│  │ └──────────────────────────────────┘   │                      │
│  │                                        │                      │
│  │ Trust strip mini:                      │                      │
│  │ ✓ 8 empresas verificadas               │                      │
│  │ ✓ 1.300+ avaliações                    │                      │
│  │ ✓ Cobertura nacional                   │                      │
│  │                                        │                      │
│  │ Quick-route chips (rotas populares)    │                      │
│  │ [SP → Campos do Jordão · 12 vans]      │                      │
│  │ [RJ → Búzios · 8 ônibus]               │                      │
│  │ [BH → Tiradentes · 6 vans]             │                      │
│  └────────────────────────────────────────┘                      │
│  background: bv-canvas + decorative SVG lat/long ticks topo+base│
├──────────────────────────────────────────────────────────────────┤
│  ROTAS EM ALTA (white, py-9)                                     │
│  Eyebrow: "01 — DESTINOS"                                        │
│  H2 bicolor: "Rotas mais buscadas no Brasil"                     │
│  Dek: "Pontos de partida e chegada com maior demanda esta semana"│
│                                                                  │
│  Grid 3 cols (desktop) / 1 col (mobile):                         │
│  ┌─RouteCard─────┐ ┌─RouteCard─────┐ ┌─RouteCard─────┐           │
│  │ SP → CdJordão │ │ RJ → Búzios   │ │ BH → Tiradentes│          │
│  │ 230km · 4h    │ │ 170km · 3h    │ │ 200km · 4h     │          │
│  │ a partir de   │ │ a partir de   │ │ a partir de    │          │
│  │ R$ 1.890      │ │ R$ 1.200      │ │ R$ 1.450       │          │
│  │ 12 empresas   │ │ 8 empresas    │ │ 6 empresas     │          │
│  │ [Comparar →]  │ │ [Comparar →]  │ │ [Comparar →]   │          │
│  └───────────────┘ └───────────────┘ └────────────────┘           │
│  ┌─ … 3 mais ───────────────────────────────────────┐             │
│  Link "Ver todas as rotas →" sutil                                │
├──────────────────────────────────────────────────────────────────┤
│  COMO FUNCIONA (bg-bv-bg, com SVG route-line entre os 3 passos) │
│  Eyebrow: "02 — COMO FUNCIONA"                                   │
│  H2: "Da busca ao **embarque**, em três passos."                 │
│                                                                  │
│  Diagonal flow desktop (3 passos com offset vertical):           │
│      ╭──[01]──╮                                                  │
│       Buscou         O dek explica + ícone outline navy 32px     │
│                  ╭──[02]──╮                                      │
│                   Encontrou       (verde, signature step)        │
│                              ╭──[03]──╮                          │
│                               Viajou                             │
│  Mobile: stack vertical, cada passo com timeline-line à esquerda │
├──────────────────────────────────────────────────────────────────┤
│  POR QUE COMPARAR (white, py-9) ★ DIFERENCIAÇÃO                  │
│  Eyebrow: "03 — DIFERENCIAL"                                     │
│  H2: "Pare de ligar. **Compare aqui.**"                          │
│                                                                  │
│  Matrix 2 cols com headers:                                      │
│  ┌─────────────────────┬───────────────────┐                     │
│  │ Comprar direto      │ Buscou Viajou     │                     │
│  ├─────────────────────┼───────────────────┤                     │
│  │ Ligar/WhatsApp pra  │ ✓ Cotação na hora │                     │
│  │   cada empresa      │   de várias       │                     │
│  │ ✗ Esperar resposta  │ ✓ Compara lado a  │                     │
│  │   horas/dias        │   lado em segs    │                     │
│  │ ✗ Sem comparativo   │ ✓ Pagamento       │                     │
│  │ ✗ Pagar em depósito │   seguro online   │                     │
│  │ ✗ Sem garantia      │ ✓ Bilhete digital │                     │
│  │   de cancelamento   │   com QR code     │                     │
│  └─────────────────────┴───────────────────┘                     │
│  Visual: header "direto" com cor neutra, header "BV" com bg navy │
│  CTA inline: "Veja como funciona →" link âncora pra Como Funciona│
├──────────────────────────────────────────────────────────────────┤
│  EMPRESAS QUE RODAM COM A GENTE (bg-bv-bg, py-9)                 │
│  Eyebrow: "04 — REDE"                                            │
│  H2: "8 empresas verificadas. **Cobertura nacional.**"           │
│  Dek: "Frota dedicada, motoristas treinados, documentação OK."   │
│                                                                  │
│  Strip horizontal scroll (mobile) / grid 4×2 (desktop):          │
│  [LogoTransTur SP · ★4.6] [Capital Tour · ★4.4]                  │
│  [ViaSul · ★4.8] [Litoral Express · ★4.7]                        │
│  [Pernambuco Tour · ★4.6] [Rota Carioca · ★4.5]                  │
│  [Mineiro Tur · ★4.5] [Norte Brasil · ★4.3]                      │
│                                                                  │
│  Stat row destaque (3 colunas):                                  │
│  [25 veículos] [1.321 avaliações] [11 estados cobertos]         │
├──────────────────────────────────────────────────────────────────┤
│  AVALIAÇÕES REAIS (white, py-9) ★ TESTIMONIAL                    │
│  Eyebrow: "05 — VOZES DE QUEM VIAJOU"                            │
│  H2: "Quem **buscou** e voltou pra contar."                      │
│                                                                  │
│  Asymmetric grid: 1 testimonial grande à esquerda + 2 menores    │
│  à direita (desktop). Mobile: stack vertical.                    │
│                                                                  │
│  Big card (frame-corner brackets):                               │
│  ┌──┐                                                            │
│  │  ★★★★★ "Reservei pra excursão da escola, atendeu              │
│  │  perfeitamente. Bilhete digital salvou meu dia." — Ana S.     │
│  │                                                          ──┐   │
│  └─                                                           ┘   │
│                                                                  │
│  Small cards: ★ Mateus B., ★ Carlos R.                           │
├──────────────────────────────────────────────────────────────────┤
│  PERGUNTAS FREQUENTES (bg-bv-bg, py-9) ★ FAQ + SEO               │
│  Eyebrow: "06 — DÚVIDAS"                                         │
│  H2 left + accordion list right (desktop) / stack (mobile)       │
│                                                                  │
│  Q1: "Como funciona o pagamento?"                                │
│  Q2: "E se a empresa cancelar?"                                  │
│  Q3: "Posso cancelar minha reserva?"                             │
│  Q4: "Os preços têm taxa extra?"                                 │
│  Q5: "Que tipo de veículo encontro?"                             │
│  Q6: "Para quantos passageiros?"                                 │
├──────────────────────────────────────────────────────────────────┤
│  PARA EMPRESAS (bg-bv-navy, white text, py-7) ★ B2B mini         │
│  H3: "Tem ônibus, vans ou micro-ônibus parados?"                 │
│  Subhead: "Anuncie sua frota e conecte-se a quem está buscando." │
│  CTA outline-on-navy: "Quero anunciar →" → /seja-parceiro        │
│  (em Fase 2 — pode levar pra page placeholder)                   │
├──────────────────────────────────────────────────────────────────┤
│  CTA FECHAMENTO (bg-bv-navy, py-9)                               │
│  H2 centered: "Pronto pra **primeira viagem?**"                  │
│  CTA accent grande: "Buscar viagens" → âncora #top               │
│  JOURNEYTAG (md, inverse) — única ocorrência além do hero        │
├──────────────────────────────────────────────────────────────────┤
│  [FOOTER existente]                                              │
└──────────────────────────────────────────────────────────────────┘
```

### Sequência psicológica do scroll

| Seção | Pergunta do usuário | Resposta da seção |
|---|---|---|
| 1. Hero | "O que é isso?" | "Compare fretamentos. Reserve fácil." + ferramenta de busca já visível |
| 2. Rotas em alta | "Funciona pra MINHA rota?" | "Olha aqui rotas que pessoas estão buscando AGORA" |
| 3. Como funciona | "Como faço pra usar?" | "3 passos: Buscou → Encontrou → Viajou" |
| 4. Por que comparar | "Por que aqui e não direto?" | Matrix lado-a-lado mostra fricção do método tradicional |
| 5. Empresas | "Posso confiar?" | 8 empresas reais, ratings, cobertura |
| 6. Avaliações | "Outras pessoas usaram?" | Testemunhos reais com nome (privacy-first like ReviewCard) |
| 7. FAQ | "Tenho objeções específicas" | Pagamento, cancelamento, taxas — respostas diretas |
| 8. B2B | "Sou empresa, posso anunciar?" | Sim — CTA pra /seja-parceiro |
| 9. CTA fechamento | "Vou tentar agora" | Botão volta pra hero/SearchForm |

---

## 4. Hierarquia de CTAs

### Regra de ouro

**1 CTA primário por viewport** (regra do design-dna). Verde/accent só pra ação principal. Ghost/outline pra secundárias.

### Inventário completo

| # | Localização | Texto | Variante | Ação |
|---|---|---|---|---|
| 1 | Navbar (anônimo) | **"Buscar viagens"** | accent sm | scroll-to #top (hero anchor) |
| 2 | Navbar (anônimo) | "Entrar" | ghost sm | → /login |
| 3 | Navbar (logado) | (Avatar com nome) | (custom) | → /minhas-viagens |
| 4 | Hero — SearchForm | **"Buscar viagens"** ← | accent lg + ícone Search | submit form → /busca |
| 5 | Hero — chips embaixo | "São Paulo → Campos do Jordão" + 2-3 outros | ghost sm w/ ArrowRight | preenche form e submit (ou direto /busca) |
| 6 | Rotas em alta — cada card | "Comparar →" | inline link (subtle, accent na hover) | → /busca?origem=X&destino=Y |
| 7 | Rotas em alta — final | "Ver todas as rotas →" | ghost link | scroll-to hero (focus no SearchForm) |
| 8 | Como funciona | (sem CTA — narrativo) | — | — |
| 9 | Por que comparar | "Veja como funciona →" | ghost link | âncora #como-funciona |
| 10 | Empresas | (sem CTA — social proof passiva) | — | — |
| 11 | Avaliações | (sem CTA — social proof) | — | — |
| 12 | FAQ — última pergunta | "Falar com a gente" | ghost link sm | mailto:contato@ ou /suporte (ver P8) |
| 13 | Para empresas | **"Quero anunciar minha frota"** | outline-on-navy lg + ArrowRight | → /seja-parceiro |
| 14 | CTA fechamento | **"Buscar viagens"** ← | accent lg + ícone Search | scroll-to #top com focus no SearchForm |
| 15 | Footer | (links existentes) | — | — |

### CTAs primários (3 — todos convergem pro mesmo verbo)

1. Hero SearchForm → **"Buscar viagens"** (com ícone) — canônico
2. Navbar (mobile + desktop accent) → **"Buscar viagens"** (atalho de scroll)
3. Fechamento → **"Buscar viagens"** (loopback)

**Por que repetir?** O verbo "Buscar" é o foco semântico da marca. Repetição
deliberada cria ancoragem mental. Não confundir com "Reservar" (verbo
posterior na jornada, depois da busca).

### CTAs secundários (varietais, não competem)

- "Comparar" (cards de rotas — convida exploração)
- "Quero anunciar" (B2B, audiência diferente)
- "Falar com a gente" (suporte, último recurso)

### CTAs evitados

❌ "Saiba mais" — não diz nada
❌ "Clique aqui" — banido pelo doNotList
❌ "Cadastre-se" — magic link na demo, sem cadastro explícito
❌ "Reservar agora" — pressuroso (states-matrix avisa)
❌ "Comece a usar" — vago

---

## 5. Copy estratégico

### Voz aplicada (per design-dna §voice)

- 2nd person direto ("você")
- 1 ideia por frase
- Verbos de jornada (Buscar, Encontrar, Comparar, Reservar, Viajar)
- Sem jargão (sem "onboarding", "checkout", "marketplace")
- Active voice, optimista mas factual
- Sem inglês desnecessário (sem "tour", "trip", "checkout")

### Copy proposto (final, em PT-BR)

#### HERO

- **Eyebrow** (JourneyTag): "Buscou → Encontrou → Viajou" (já existe)
- **H1** (display, bicolor):
  > Compare **fretamentos** lado a lado.
  > Reserve em minutos.
- **Dek** (body-lg, navy/72):
  > Vans, micro-ônibus e ônibus de empresas verificadas em todo o Brasil.
  > Cotação na hora, bilhete digital com QR e suporte do início ao fim.
- **Trust mini**: "8 empresas verificadas · 1.300+ avaliações · Cobertura nacional"
- **Quick-route chips** (depois do form):
  > 🅰 → 🅱 *Mais buscadas:*
  > [São Paulo → Campos do Jordão] [Rio de Janeiro → Búzios] [Belo Horizonte → Tiradentes]

#### ROTAS EM ALTA (Section 01)

- **Eyebrow**: "01 — DESTINOS"
- **H2** (bicolor):
  > Rotas mais **buscadas** no Brasil.
- **Dek**: "Pontos de partida e chegada com maior demanda nesta temporada."
- **Card text**:
  > **São Paulo, SP** → Campos do Jordão, SP
  > 230 km · ~4h · 12 empresas
  > a partir de **R$ 1.890** · grupo de 10
  > [Comparar →]

#### COMO FUNCIONA (Section 02)

- **Eyebrow**: "02 — COMO FUNCIONA"
- **H2** (bicolor):
  > Da busca ao **embarque**, em três passos.
- **Step 01 — Buscou**
  > Diga origem, destino, data e quantos vão.
- **Step 02 — Encontrou** ← step destacado (verde)
  > Compare preços, comodidades e avaliações de várias empresas.
- **Step 03 — Viajou**
  > Reserve em poucos cliques. Receba o bilhete digital com QR. Boa viagem.

#### POR QUE COMPARAR (Section 03)

- **Eyebrow**: "03 — DIFERENCIAL"
- **H2** (bicolor):
  > Pare de ligar. **Compare aqui.**
- **Dek**:
  > Cotação direto com cada empresa toma horas e não permite comparar.
  > Aqui é tudo na mesma tela.
- **Matrix headers**:
  > **Comprar direto** | **Buscou Viajou**
- **Linhas (5)**:
  | Comprar direto | Buscou Viajou |
  |---|---|
  | Ligar/WhatsApp pra cada empresa | Cotação simultânea de várias |
  | Esperar resposta horas ou dias | Resultado em segundos |
  | Sem visão lado a lado | Comparação em uma única tela |
  | Pagamento por depósito sem garantia | Pagamento seguro online |
  | Reserva por mensagem, sem registro formal | Bilhete digital com QR code |

#### EMPRESAS (Section 04)

- **Eyebrow**: "04 — REDE"
- **H2** (bicolor):
  > **8 empresas** verificadas. Cobertura nacional.
- **Dek**: "Frota dedicada, motoristas treinados, documentação em ordem."
- **Strip**: 8 nomes + ratings (lazy data — pode usar `<Logo>` placeholder se logo URL não for confiável)
- **Stat row** (3 colunas grandes):
  > **25** veículos disponíveis
  > **1.321** avaliações verificadas
  > **11** estados com cobertura

#### AVALIAÇÕES (Section 05)

- **Eyebrow**: "05 — VOZES DE QUEM VIAJOU"
- **H2** (bicolor):
  > Quem **buscou** — e voltou pra contar.
- **Dek**: "Avaliações de viajantes verificados. (Privacidade preservada — só o primeiro nome.)"
- **Big card** (1 testimonial 5 estrelas):
  > Pegar do seed real. Ex: "Reservei pra excursão da escola e atendeu perfeitamente. Bilhete digital salvou meu dia." — **Ana S.** · ★★★★★ · São Paulo
- 2-3 small cards: outras avaliações reais

#### FAQ (Section 06)

- **Eyebrow**: "06 — DÚVIDAS"
- **H2** (bicolor):
  > **Perguntas** mais frequentes.

| Q | A |
|---|---|
| **Como funciona o pagamento?** | Pagamento online no momento da reserva. A gente segura o valor até a empresa confirmar. Cartão de crédito, débito ou Pix. |
| **E se a empresa cancelar a viagem?** | Reembolso 100% automático em até 5 dias úteis. Você também pode buscar outra opção na hora. |
| **Posso cancelar minha reserva?** | Sim. O reembolso varia com o prazo: até 72h antes — 100%. Entre 24h e 72h — 50%. Menos de 24h — sem reembolso. |
| **Os preços têm taxa extra?** | Não. O preço da busca já inclui taxa de serviço, pedágios e impostos. Sem surpresas no final. |
| **Que tipo de veículo encontro?** | Vans (até 16 passageiros), micro-ônibus (até 30) e ônibus (até 60). Todos com ar-condicionado, motorista treinado e seguro. |
| **Posso viajar em grupo grande?** | Sim — até 60 passageiros por veículo. Pra grupos maiores, fale com a gente. |

#### PARA EMPRESAS (B2B mini)

- **H3** (em fundo navy):
  > Tem ônibus, vans ou micro-ônibus **parados?**
- **Texto**:
  > Anuncie sua frota no Buscou Viajou. Conecte-se a quem está buscando agora.
- **CTA**: "Quero anunciar minha frota"

#### CTA FECHAMENTO

- **H2** (centered, white):
  > Pronto pra **primeira viagem?**
- **Sub** (centered, white/80):
  > Buscou Viajou: do mapa ao embarque, em poucos cliques.
- **CTA**: "Buscar viagens"
- **JourneyTag**: (md, inverse) — única outra ocorrência além do hero

---

## 6. Componentes — reusar vs criar

### Reuso direto (sem mudanças)

| Componente | Onde aparece |
|---|---|
| `<SearchForm variant="hero" />` | Hero |
| `<BicolorHeading>` + `<BicolorHighlight>` | Todas as H1/H2 |
| `<JourneyTag>` | Hero (1×) + Fechamento (1×) — só essas duas |
| `<Card>` (default, outline, accent, brand) | Múltiplas seções |
| `<Button>` (primary, accent, outline, ghost) | CTAs |
| `<Badge>` | Stat rows, ratings |
| `<StarRating>` | Empresas, Avaliações |
| `<Logo>` | Já no Navbar/Footer; opcional em "Para empresas" |
| `<Navbar>` | Topo |
| `<Footer>` | Rodapé |

### Componentes a criar (em `src/components/feature/landing/`)

| Componente | Função | Linhas estimadas |
|---|---|---|
| `<SectionEyebrow>` | Micro-rótulo numerado editorial ("01 — DESTINOS") | ~20 |
| `<RouteCard>` | Card de rota popular (origem→destino, preço, duração, link) | ~70 |
| `<QuickRouteChips>` | Tira de chips embaixo do SearchForm | ~50 |
| `<CompareMatrix>` | Tabela 2-cols "direto vs BV" | ~80 |
| `<CompanyStrip>` | Strip horizontal de empresas com ratings | ~60 |
| `<StatTrio>` | Trio de números grandes (25 / 1.321 / 11) | ~40 |
| `<TestimonialCard>` | Card de depoimento (variant big/small) | ~70 |
| `<FaqAccordion>` | Lista accordionada com Radix | ~80 |
| `<B2bCallout>` | Faixa B2B navy | ~50 |
| `<CartographicTicks>` | SVG decorativo de ticks lat/long pro hero | ~40 |

**Total novo código:** ~560 linhas em 10 arquivos pequenos. Cada um isolável,
testável visualmente em `/dev/components` se preciso.

### Componentes Radix necessários

- `@radix-ui/react-accordion` para o FAQ — **adicionar dependência**

```bash
cd BuscouViajouFrontend && npm install @radix-ui/react-accordion
```

---

## 7. Dados reais — integração

A LP **não** mocka dados. Usa endpoints reais. Estratégia:

### Server Component fetches (no top do `page.tsx`)

```ts
const [companies, popularRoutes] = await Promise.all([
  api('/v1/companies', { auth: false }),
  // popularRoutes virá de uma seleção curada estática (origem/destino/coords)
  // mas com /v1/quotes feito server-side pra cada rota? Caro. Solução:
  // hard-code curated routes + fetch de price-from via /v1/quotes só na hora.
  Promise.resolve(POPULAR_ROUTES_SEED),
]);
```

### Estratégia para "Rotas em alta" (decidida)

**Não** chamar `/v1/quotes` server-side por 3-6 rotas (lento + custo +
preços viram stale). Em vez disso:

- Hard-code 6 "rotas curadas" (origem + destino + distância + duração)
- Mostrar só "a partir de R$ X" como faixa estimativa (ou omitir preço)
- Cards linkam pra `/busca?origem=X&destino=Y&data=<amanhã+7d>&passageiros=10`
- Quando o usuário clica → /busca faz quote real

**Trade-off:** preços não live na LP, mas LP carrega rápido (sem 6 quotes
em paralelo). Aceito — concorrentes (Buser, ClickBus) também não fazem live
pricing em LP.

Curated list:

| Origem | Destino | km | h | Vibe |
|---|---|---|---|---|
| São Paulo, SP | Campos do Jordão, SP | 230 | 4 | Inverno, serra |
| Rio de Janeiro, RJ | Búzios, RJ | 170 | 3 | Praia |
| Belo Horizonte, MG | Tiradentes, MG | 200 | 4 | Histórico |
| São Paulo, SP | Ubatuba, SP | 230 | 4 | Praia |
| Curitiba, PR | Foz do Iguaçu, PR | 640 | 9 | Cataratas |
| Recife, PE | Porto de Galinhas, PE | 60 | 1 | Praia |

### Estratégia para "Empresas"

- `GET /v1/companies` retorna lista com `name`, `average_rating`, `total_reviews`, `operating_regions`
- Cache: server component com revalidate 1h
- Total de avaliações: `companies.reduce((s, c) => s + c.total_reviews, 0)` = ~1.321 (real)
- Total de estados: `[...new Set(companies.flatMap(c => c.operating_regions))].length` = 11 (real)

### Estratégia para "Avaliações"

- Pegar top 3 reviews da empresa com maior rating: `GET /v1/companies/49af.../reviews` (ViaSul, 4.8)
- Ou: server-side pegar 1-2 reviews de 3 empresas diferentes pra diversidade
- Backend já garante privacy (first_name + initial)
- Fallback: se endpoint falhar ou retornar vazio, esconder seção (não mostrar mock)

### Estratégia para "25 veículos"

- Usar contagem do seed (hard-code 25 com `aria-label="25 veículos"`)
- Ou expor endpoint `/v1/stats` (não existe, criar é Fase 2 — não pra agora)
- **Decisão:** hard-code com comentário explicando que vem de stats agregados

---

## 8. Motion & micro-interactions

Per design-dna §motion: 150/250/400ms, cubic-bezier(0.2, 0.8, 0.2, 1), respeita prefers-reduced-motion.

### Stagger no hero (uma vez, no load)

```css
@keyframes bv-fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
}
.bv-stagger-1 { animation: bv-fade-up 400ms 0ms   var(--bv-motion-ease) both; }
.bv-stagger-2 { animation: bv-fade-up 400ms 100ms var(--bv-motion-ease) both; }
.bv-stagger-3 { animation: bv-fade-up 400ms 200ms var(--bv-motion-ease) both; }
.bv-stagger-4 { animation: bv-fade-up 400ms 300ms var(--bv-motion-ease) both; }

@media (prefers-reduced-motion: reduce) {
  .bv-stagger-1, .bv-stagger-2, .bv-stagger-3, .bv-stagger-4 {
    animation: none;
  }
}
```

Aplicado em: JourneyTag → H1 → Dek → SearchForm.

### Reveal on scroll (sem libs)

`<Reveal>` simples com IntersectionObserver — uma vez, 400ms fade-up.
Usado em: cada section header e nos primeiros cards de cada grid.

### Hover micro

- **Card hover**: `shadow-bv-md → shadow-bv-lg`, `border-navy/12 → navy/24`, 250ms (já existe no Card variant interactive)
- **CTA hover**: bg darken 8% (já existe)
- **Quick-route chips**: hover background shift + ArrowRight translates 4px right

### Decorations animadas (reduced-motion-safe)

- Hero decorative SVG (lat/long ticks) — estático, sem animação
- JourneyTag arrow — estático (não pulsar)

### O que NÃO ter

❌ Parallax
❌ Auto-advancing carousel
❌ Scroll-jacking
❌ Lottie animations
❌ Texto digitando-se sozinho
❌ Counter animado (12.345...) — distração

---

## 9. Acessibilidade (manter AA)

Todos os requisitos do design-dna §accessibility:

- ✓ Skip-link `#main` (já existe)
- ✓ Focus ring verde (já existe)
- ✓ Hierarquia h1→h2→h3 sem skip
- ✓ Imagens com alt PT-BR
- ✓ Touch targets 44×44 (preserva, mas atenção às chips e link cards)
- ✓ Color não é único indicador (steps numerados + cor)
- ✓ FAQ Accordion com aria-expanded correto (Radix faz)
- ✓ Reduced-motion respeitado em todas as animações
- ✓ Dark mode? — fora do escopo (DS não tem variant dark explicit)

**Atenção especial**:
- Quick-route chips: cada uma é `<Link>` com aria-label completo ("Buscar fretamento de São Paulo a Campos do Jordão")
- Compare matrix: roles `table`/`row`/`cell` ou usar `<table>` semântico. **Decisão: usar `<table>` real** com `<caption className="sr-only">Comparação...</caption>`
- FAQ: `<dl>`/`<dt>`/`<dd>` ou Radix Accordion. Radix é melhor — usa botões + aria-expanded.

---

## 10. Impacto nos testes E2E (28/28 verdes)

A suite de Playwright tem testes de smoke/critical/auth/filter/a11y/responsive.
O LP redesign não muda contratos — SearchForm (componente) fica intacto, IDs
e atributos preservados.

**Risco:** alguns testes podem usar `text=` matchers em copy específica que
estamos mudando ("Encontre sua próxima viagem" → "Compare fretamentos…").

**Mitigação:**
1. Antes de codar, rodar `npm run test:e2e -- --list` (ou similar) e ver quais testes assertam texto da home
2. Adaptar matchers se necessário — sem afrouxar
3. Adicionar 1-2 novos testes leves: existência de RotasEmAlta, FAQ, B2bCallout

---

## 11. SEO & metadata

LP é página `/` indexável (sitemap diz priority 1.0).

### `metadata` no `page.tsx`

```ts
export const metadata = {
  title: 'Buscou Viajou — Compare e reserve fretamento de ônibus e vans',
  description: 'Compare vans, micro-ônibus e ônibus de empresas verificadas em todo o Brasil. Cotação na hora, bilhete digital, pagamento seguro.',
  openGraph: { ... },
};
```

(Já existe — verificar e refinar.)

### Schema.org

Adicionar JSON-LD inline:
- `Organization` (Buscou Viajou)
- `WebSite` com SearchAction (sitelinks search box)
- Possivelmente `FAQPage` para o FAQ section (boost SEO substancial)
- `AggregateRating` agregada das 8 empresas (4.55 avg, 1321 reviews)

---

## 12. Riscos & mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Quebrar testes E2E (matchers de copy) | Média | Médio | Auditoria pré-código + ajuste de matchers (não dilui asserts) |
| Logos das empresas não funcionarem (placeholders gerados) | Alta | Baixo | Fallback: tile com nome em Gotham bold + StarRating; sem logo |
| Reviews endpoint retornar vazio | Baixa | Baixo | Esconder seção silenciosamente se < 3 reviews disponíveis |
| FAQ acessibilidade (Radix accordion) | Baixa | Médio | Radix é a11y-first; testar com Tab + Space + arrow keys |
| `bv-canvas` causar visual fatigue se overused | Baixa | Baixo | Restringir ao hero + hero do CTA fechamento (atenção: doNotList §13) |
| Performance: 10 novos componentes | Baixa | Baixo | Tudo Server Component possível; only `'use client'` em FAQ accordion e Reveal |
| Re-deseinhar quebrar visual identity | Baixa | Alto | Disciplina absoluta com tokens; nada hex hardcoded; passa por design-review-pass-2 |

---

## 13. Perguntas em aberto (necessárias antes de codar)

> Decisões que precisam de input do usuário pra não desperdiçar trabalho.

### P1. Sobre o "Comparativo" (Por que comparar)

A matriz "Comprar direto vs Buscou Viajou" é **agressiva** com concorrência
indireta (empresas que vendem direto). Duas formas:

- **A. Mantém a matriz** (recomendo) — clareza brutal, melhor pra conversão
- **B. Suaviza** — vira "O que esperar quando você compara aqui" (sem matriz)
  - Pros: menos confronto. Cons: dilui diferenciação.

**Minha recomendação:** A. **Pode ir com a A?**

### P2. Sobre rotas curadas

Sugestões hard-coded: SP→CdJordão, RJ→Búzios, BH→Tiradentes, SP→Ubatuba,
Curitiba→Foz, Recife→Porto Galinhas.

- **Tem alguma rota essencial pra incluir/excluir?** Ex: existem rotas-foco
  que o produto quer destacar (turismo religioso, corporativo, escolar)?
- Se não, **vou com as 6 acima**.

### P3. Sobre fotos de veículos

O seed tem photo URLs (Unsplash) mas algumas estão erradas (S7 do
design-review aponta carros esportivos genéricos em vez de ônibus).

- **Posso usar fotos no LP?** — preciso curar 3-4 boas (consideráveis) de
  ônibus/vans reais antes
- **Ou skipar fotos no LP?** — vai ser mais editorial/abstrato (line art SVG,
  silhuetas vetoriais)

**Minha recomendação:** SKIPAR fotos. LP fica mais distintiva visualmente sem
photo-bash de veículos genéricos. Editorial = tipografia + dados + cor, não
photo collage.

### P4. Sobre B2B (`/seja-parceiro`)

Sitemap diz que é **Fase 2** (não implementado). Se eu colocar o callout
"Quero anunciar", o link vai pra 404.

- **A.** Coloca o callout mas link → page placeholder simples ("Em breve. Deixe seu email.")
- **B.** Coloca link → mailto:partners@buscouviajou.demo
- **C.** Esconde a seção B2B nessa fase

**Minha recomendação:** A. Cria `/seja-parceiro/page.tsx` placeholder com:
- Heading bicolor "Sua frota, **mais demanda**."
- Form único: email + nome empresa + cidade
- Submit: console.log (mock) + toast "Em breve te enviamos detalhes"
- Permite ter B2B na LP sem dar 404

### P5. Sobre "live indicator" no hero

Considerei "X buscas hoje" tipo Booking, mas:
- Não temos endpoint de stats
- Mocking seria mentira (DNA proíbe stocks artificiais)

**Decisão:** sem live indicator. Trust strip estático é suficiente. **OK?**

### P6. Sobre quantidade de scrolls

Layout proposto = ~3-4 viewports desktop, ~6-7 mobile. É média/longa.

- Tudo bem? Ou prefere mais enxuta (cortar FAQ ou Empresas)?
- **Minha opinião:** mantém todas — cada uma tem função distinta. LPs curtas
  funcionam pra produtos que o usuário já conhece (ex: SaaS B2B). Marketplace
  novo precisa educar + provar — scroll moderado é necessário.

### P7. Sobre voz: pode ser "menos formal"?

Voz atual é "0.4 formal, 0.5 playful, 0.3 technical, 0.8 warm". Algumas
copy proposta tem um toque mais ousado:
- "Pare de ligar. Compare aqui." — diretivo
- "Tem ônibus, vans ou micro-ônibus parados?" — provocativo (B2B)

**Pode? Ou amaciar?**

### P8. Sobre suporte (FAQ)

"Falar com a gente" — pra onde? Não há endpoint de suporte.

- **A.** mailto:contato@buscouviajou.demo
- **B.** WhatsApp link (precisa número real)
- **C.** Hidde o link "Falar com a gente" no FAQ

**Minha recomendação:** A — mailto. Demo é demo.

### P9. Sobre Schema.org JSON-LD

Adicionar `WebSite + SearchAction + FAQPage + Organization` boosta SEO em ~6-12 meses.

- **OK incluir?** É invisível ao usuário mas eleva qualidade técnica.

### P10. Sobre nova dep `@radix-ui/react-accordion`

Single-purpose, ~5KB, mantém consistência com Radix já usado (Dialog, Popover, Select). **OK?**

---

## 14. Plano de execução faseado

Após aprovar perguntas acima, executo nesta ordem:

### Fase A — Foundation (~30min)

1. `npm install @radix-ui/react-accordion` (se P10 OK)
2. Criar `src/components/feature/landing/` directory
3. Criar `<SectionEyebrow>`, `<CartographicTicks>` (atomic, sem deps)
4. Adicionar keyframes `bv-fade-up` em `globals.css`

### Fase B — Componentes feature (~90min)

5. `<RouteCard>` + `<QuickRouteChips>` (com curated routes data)
6. `<CompareMatrix>` (table semântica)
7. `<CompanyStrip>` + `<StatTrio>`
8. `<TestimonialCard>`
9. `<FaqAccordion>` (Radix)
10. `<B2bCallout>`
11. `<Reveal>` helper para scroll-reveal

### Fase C — Page assembly (~60min)

12. Reescrever `src/app/page.tsx` com nova arquitetura
13. Server Component: fetch companies + reviews (top 3)
14. Substituir `<Step>` inline por seção redesenhada
15. Garantir 1× JourneyTag no hero, 1× no fechamento (S2 fix de bonus)
16. Adicionar `metadata` + JSON-LD

### Fase D — B2B placeholder (~30min)

17. Criar `src/app/seja-parceiro/page.tsx` se P4 = A

### Fase E — Validation (~60min)

18. Visual check em :3000 (já está rodando)
19. Mobile check (DevTools 375)
20. Tablet check (768)
21. `npm run lint` + `npm run type-check`
22. `npm run test:e2e -- --grep @smoke` rápido
23. Atualizar matchers de testes se quebrarem
24. Fix dos S2/M4 que aproveitamos pra resolver

### Fase F — Documentação (~15min)

25. Atualizar `_context/lp-redesign-execution-log.md` com o que foi feito
26. Screenshot rápido (desktop + mobile) salvo em `_context/`

**Total estimado:** 4-5h após aprovação.

---

## 15. Métricas de sucesso (post-deploy)

Não dá pra medir agora (sem analytics em produção), mas deixar prontinho pra:

- **Bounce rate** ↓ vs LP atual
- **Scroll depth** mediano ≥ 50%
- **CTR no SearchForm** ↑
- **CTR em quick-route chips** (sub-CTAs)
- **CTR em "/seja-parceiro"** (B2B engagement)
- **Tempo na página** ≥ 45s (educação completa do produto)

Tracking pode entrar em Fase 2 com PostHog ou similar.

---

## Resumo executivo (TL;DR pra reler depois)

- **Direção estética**: Editorial Cartography (revista de planejamento de jornada)
- **9 seções**: Hero · Rotas em Alta · Como Funciona · Por que Comparar · Empresas · Avaliações · FAQ · B2B · CTA fechamento
- **3 CTAs primários** (todos "Buscar viagens" — repetição deliberada)
- **6 secundários** distintos (Comparar, Quero anunciar, Falar com a gente, etc.)
- **10 novos componentes** + reuso de 13 existentes
- **Dados reais** via API (companies, reviews) + curated routes hard-coded
- **Motion** sutil, respeita reduced-motion
- **A11y AA** preservada
- **E2E**: ajustar matchers se necessário, sem afrouxar asserts
- **SEO**: metadata + Schema.org JSON-LD
- **Riscos** baixos, mitigações claras
- **10 perguntas em aberto** (P1-P10)
- **5 fases de execução** (~4-5h após aprovação)

---

**Aguardando respostas P1-P10 antes de codar.**
