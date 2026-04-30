# Design DNA — Como usar `design-dna.json`

> O arquivo `design-dna.json` é a **fonte única de verdade visual** consultada
> nas Fases 3-8 da implementação do frontend. Toda decisão de UI deve passar
> por ele primeiro.

---

## O que é

Um JSON estruturado em **3 dimensões** que consolida tudo que o
`buscou-viajou-design-system.md` (1200 linhas) descreve em formato narrativo
+ tudo que está nos `tokens.css`/`tokens.json`/`tailwind.config.js`, plus
decisões pragmáticas que vão guiar a implementação.

```
designSystem/    → tokens "duros" (cores hex, tipografia, espaçamento, sombras)
designStyle/     → estilo "qualitativo" (philosophy, voice, imagery, layout)
visualEffects/   → efeitos específicos da marca (blueprint grid, frame corners, bicolor titles, journey tag)
componentRules/  → regras consolidadas por componente (buttons, cards, inputs, etc.)
writingPatterns/ → CTAs, mensagens, erros, formatos numéricos
doNotList/       → 18 regras explícitas do que NÃO fazer
accessibility/   → WCAG AA checklist
```

## Quem consome

| Fase | Skill | Como usa o JSON |
|---|---|---|
| **3** Componentes base | `frontend-design` | `componentRules.*` ditam variantes/anatomia. `designSystem.colors` e `motion` ditam estados |
| **4** Componentes de feature | `frontend-design` + `micro-100-200ms` | `visualEffects.*` aplicam padrões da marca (blueprint, frame, bicolor) |
| **5** Páginas estilizadas | `frontend-design` | `designStyle.philosophy` + `imagery` + `layoutPrinciples` orientam composição |
| **6** UX Polish | `ui-ux-polish` | `accessibility` + `motion.respectsReducedMotion` ditam acabamento |
| **7** Testes E2E | `playwright-best-practices` | `accessibility.testing` define `@a11y` suite |
| **8** Design Review | `design-review` | `doNotList` vira checklist de auditoria |

## Como invocar nas próximas fases

Sempre que invocar uma skill ou criar componente, mencione **explicitamente**
o caminho do JSON e a seção relevante:

```
Use as decisões de _context/design-dna.json para guiar a implementação.
Em particular:
- componentRules.buttons (variantes, estados, anatomia)
- designSystem.colors.contrast (regras de contraste)
- visualEffects.bicolorTitle (aplicar em headlines)
- writingPatterns.ctaVerbs (texto dos botões)
- doNotList (18 regras inegociáveis)
```

## Ordem de prioridade quando há conflito

Se algo em `design-dna.json` conflitar com outra fonte, esta é a hierarquia:

1. **`design-dna.json`** ← (mais recente, consolidado)
2. `tokens.css` / `tokens.json` / `tailwind.config.js` (tokens base)
3. `buscou-viajou-design-system.md` (DS narrativo)
4. PRD `§6` (specs de tela)

Se descobrir conflito, **avise antes de codar** — talvez seja erro do JSON
que precisa ser corrigido.

## Modificações

`design-dna.json` deve mudar só com aprovação explícita do usuário. Mudanças
típicas que justificam atualização:

- Tokens novos (cor, peso de fonte, breakpoint)
- Decisão UX nova (ex: "padrão de empty state mudou")
- Regra de "do not" identificada na review
- Componente novo com regras específicas

Não modificar pra cada componente individual — `componentRules` cobre o
genérico, detalhes específicos vão no código do componente.

## Validação

`design-dna.json` tem schema parseable (válido JSON). Pra validar:

```bash
node -e "JSON.parse(require('fs').readFileSync('_context/design-dna.json'))"
# silent = válido
```

## Atalhos úteis

```bash
# Ver paleta navy completa
jq '.designSystem.colors.scales.navy' _context/design-dna.json

# Lista de "do not"
jq '.doNotList[]' _context/design-dna.json

# Regras dos botões
jq '.componentRules.buttons' _context/design-dna.json

# Voz da marca
jq '.designStyle.voice' _context/design-dna.json
```

## Por que JSON e não markdown?

- **Consultável programaticamente** (subagentes podem ler trecho específico
  via `jq` sem ler 1200 linhas de markdown)
- **Tipável** — futuro: gerar TypeScript types a partir do schema
- **Diff-friendly** — mudanças aparecem com clareza em PRs
- **Single source of truth** — não precisa ler 4 arquivos pra decidir cor de um botão

Mas para humanos (você, revisores, novos contribuidores), o
`buscou-viajou-design-system.md` continua sendo a leitura primária — ele tem
o "porquê" das decisões. O JSON tem o "o quê".

## O que NÃO está no JSON

| Tópico | Onde está |
|---|---|
| Justificativa histórica de decisões | `_context/buscou-viajou-design-system.md` |
| Layouts específicos por tela | `_context/PRD_BuscouViajou_v1.md §6` |
| Fluxos de usuário | `_context/IA/user-flows.md` |
| Estados por tela | `_context/IA/states-matrix.md` |
| Endpoints da API | `_context/IA/api-contract.md` |
| Texto detalhado de e-mails transacionais | `_context/PRD_BuscouViajou_v1.md §10.4` |
| Catálogo de logos e variações | `_context/prompts/logo-nano-banana.md` |

Quando precisar disso, leia o arquivo apropriado **inteiro**, conforme
manda `continuidade.md`.
