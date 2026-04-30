# /busca — Redesign para padrão Trivago/Booking

> Aplicar a direção **Editorial Cartography** da LP à página de resultados,
> elevando UX/UI ao nível dos melhores comparadores (Trivago, Booking,
> Decolar). Mantém identidade BV (navy/green/Gotham) — o "premium" vem da
> precisão de hierarquia, da densidade controlada e dos detalhes de
> conversão, não de copiar visual de terceiros.

## Diagnóstico do estado atual

| Área | Problema |
|---|---|
| **Route header** | Texto simples "SP → Campos do Jordão · 230 km · 4h" sem hierarquia, sem editabilidade visível |
| **Total count** | Pequeno demais ("X veículos disponíveis" em body normal) |
| **Sort** | Dropdown padrão — Trivago usa chips visuais com ícones |
| **VehicleResultCard** | Foto pequena (280px), badges discretos, sem deal-flag, CTA "Ver detalhes" tímido, sem compare-checkbox |
| **Filtros** | Sem chips de filtros aplicados no topo, sem ícones nas seções, range só com handle máximo |
| **Empty state filtros** | Genérico, só botão "Limpar filtros" |
| **Skeleton** | Retângulo cinza simples — não comunica o que vai aparecer |
| **Compare feature** | Inexistente — a LP promete "compare lado a lado" mas o /busca só lista |

## Direção visual

**Premium = precisão, não barulho.** Tier de detalhes:

- Hierarquia tipográfica forte: route headline em Gotham black, contagem em display, filtros em h4 navy
- Deal flags como assinatura: 1 card recebe "Melhor preço", 1 recebe "Mais bem avaliado", 1 recebe "Recomendado" (algoritmo: rating × inverse-price)
- Microinterações: hover lift 2px, shadow ramp, border accent navy/24 → green
- Compare como checkbox no canto sup-direito do card → barra flutuante "Comparar (N)" no rodapé da lista
- Skeletons que copiam a forma real do card (foto + linhas + price block)
- Filtros aplicados como chips removíveis no topo dos resultados (Trivago hallmark)
- Eyebrow numerado seguindo padrão da LP ("Resultados · 23 veículos")

## Escopo de execução (executa direto, sem perguntar)

### 1. `VehicleResultCard` — premium rebuild

- Foto maior (320px desktop), gallery indicator (badge "+3 fotos") se houver múltiplas
- Logo da empresa em pill compacto + nome + rating inline
- Deal flag superior (Melhor preço / Recomendado / Mais avaliado) — passada via prop
- Compare checkbox top-right (controlled, opt-in)
- Amenities como ícone-chips (top 4 visíveis + "+N")
- Preço grande com indicação "estimativa" (alinhado ao modelo comparador)
- CTA accent "Solicitar orçamento" → `/veiculo/[id]`
- Hover: lift -2px, shadow-lg, border navy/24 → green/40
- Mobile: stack vertical com foto full-width 16:9

### 2. `FiltersSidebar` — refino editorial

- Header com h3 "Filtros" + contador "(3 aplicados)" + botão "Limpar"
- Cada seção com ícone outline alinhado ao título (Bus pra tipo, DollarSign pra preço, Star pra avaliação, Sparkles pra comodidades)
- Range de preço: dual handle (min + max) usando dois inputs estilizados
- Star rating: chips clicáveis horizontais com estrelas (4.5★+ / 4★+ / 3★+) ao invés de checkboxes
- Comodidades: top 6 + "Ver mais" pra expandir
- Empresas: scrollable list mantém

### 3. `SortBar` → `SortChips`

- Substituir Select por grupo de chips horizontais com ícone:
  - Recomendado (Sparkles), Menor preço (TrendingDown), Maior preço (TrendingUp), Melhor avaliação (Star)
- Chip ativo: bg navy white text. Inativo: bg navy-50 navy text. Hover: bg navy-100.
- Mobile: scroll horizontal sem scrollbar

### 4. `SearchResults` — composição

- Hero strip novo: SectionEyebrow "01 · RESULTADOS" + bicolor heading "X veículos pra {origem} → {destino}"
- Sub-heading: data + passageiros + distância + duração (em chips de info)
- Applied-filters chips logo abaixo da SortBar (cada chip = filtro ativo, X remove)
- Lógica de deal flags computada uma vez (cheapest, highest-rated, best-score)
- Compare bar flutuante no bottom quando há ≥2 selecionados → "Comparar (2)" abre Sheet com tabela lado-a-lado

### 5. `busca/page.tsx` — container e route hero

- Manter sticky SearchForm (já bom)
- Background bv-bg fica
- Wrapper de results ganha um pouco mais de respiro (py-bv-7)

### 6. Skeleton premium

- Skeleton de card matching real: foto 320×200 + 3 linhas texto + price block + button
- 3 cards na lista loading
- Sidebar skeleton com seções

### Fora de escopo (Tier 2 / Fase 2)

- Compare overlay completo — fica como Sheet básico nesta passada, full diff matrix depois
- Map view toggle (RouteMap pronto, mas integração foge do escopo agora)
- Save / heart / wishlist
- Price alerts
- Multiple-photo gallery em hover

## Validação

- type-check
- visual via curl em `/busca?origem=São Paulo, SP&destino=Campos do Jordão, SP&data=...&passageiros=10`
- E2E filter test ainda passa (mantém data-testid)

## Tempo estimado

~2h. Execução em paralelo de componentes onde possível.
