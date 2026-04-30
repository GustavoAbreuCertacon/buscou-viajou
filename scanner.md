# Scanner — Encerramento manual de sessão

> Procedimento que **eu (usuário)** invoco antes de encerrar uma sessão
> chamando "execute scanner". Garante que toda informação relevante
> da sessão atual foi persistida em arquivos antes de eu fechar.
>
> ⚠️ Este documento **NÃO** é referenciado por `continuidade.md` —
> é manual.

---

## Como executar este scanner

Quando eu disser **"execute scanner"** (ou variação), você:

1. Lê este arquivo do início ao fim.
2. Lê `claude.md` (visão geral atual).
3. Lê `continuidade.md` (estado documentado).
4. Identifica tudo que mudou na sessão atual e ainda não está em arquivo.
5. Executa **Etapa 1** (você mesmo, sequencial).
6. Executa **Etapa 2** (subagentes em paralelo).
7. Reporta o que foi atualizado em uma tabela final.

Não pergunte permissão pra atualizar — o "execute scanner" já é a
permissão. Mas reporte cada arquivo modificado pra eu revisar.

---

## Etapa 1 — Arquivos que VOCÊ atualiza pessoalmente

Estes arquivos precisam do contexto **completo da sessão atual**
(decisões tomadas, pivots, descobertas, blockers). Subagentes não têm
esse contexto, então **VOCÊ** deve atualizá-los pessoalmente.

### 1.1. `continuidade.md` (raiz)

**Sempre atualizar**, sem exceção.

Atualizar especificamente:
- Seção **"Status atual da sessão anterior"** com a data de hoje
- Seção **"O que está pronto"** — adicionar entregas concretas
- Seção **"O que está pendente"** — remover ou adicionar conforme
- Seção **"Tarefas em aberto"** — copiar resultado real de `TaskList`
- Seção **"Onde retomar"** — qual é o próximo passo combinado
- Seção **"Regras de comportamento estabelecidas"** — adicionar novas regras
  acordadas

### 1.2. `claude.md` (raiz)

Atualizar somente se algo na **estrutura do projeto** mudou:
- Pastas criadas/removidas
- Comandos novos ou alterados (start, build, test, seed)
- Stack mudou (tecnologia adicionada/removida)
- Status de alta-nível (tabela "Status atual")
- Próximos passos (lista numerada do final)

Se nada mudou estruturalmente, deixar como está.

### 1.3. `_context/IA/*.md`

Apenas se houve **decisões novas de IA** durante a sessão:
- Rota nova/removida → `sitemap.md`
- Fluxo descoberto/corrigido → `user-flows.md`
- Estado novo → `states-matrix.md`
- Endpoint novo/alterado → `api-contract.md`

Atualizar só os afetados, sem reescrever do zero.

### 1.4. Outros docs sob `_context/`

Apenas se mudou:
- `_context/PRD_BuscouViajou_v1.md` — só se o usuário ditou mudança no PRD
  (caso raro)
- `_context/buscou-viajou-design-system.md` — só se DS mudou
- `_context/prompts/logo-nano-banana.md` — só se prompts mudaram

### 1.5. Arquivos de config (se mudou na sessão)

Confirmar que estão consistentes:
- `BuscouViajouApi/.env.example` (sem secrets, só placeholder)
- `BuscouViajouFrontend/.env.example`
- `supabase/config.toml`

---

## Etapa 2 — Arquivos paralelizáveis com subagentes

Estes podem ser delegados a **subagentes Opus 4.7 1M context** porque o
conteúdo deriva de **leitura de arquivos existentes**, não do contexto
da sessão. Cada subagente recebe um prompt **autocontido**.

### Regras dos subagentes

Todo subagente, **sem exceção**, recebe estas regras no prompt:

```
REGRAS INEGOCIÁVEIS:
1. NÃO INVENTE informação. Use apenas o que está nos arquivos
   listados. Se não souber, escreva "(não documentado — verificar)".
2. LEIA cada arquivo listado INTEIRAMENTE, sem chunking ad-hoc.
   Use Read com offset/limit em sequência se for grande, até cobrir tudo.
3. NÃO faça suposições sobre comportamento de código que não leu.
4. NÃO modifique outros arquivos além do destino indicado.
5. Use voz neutra, técnica, direta. Português PT-BR.
6. Reporte tamanho de cada arquivo lido pra eu validar que cobriu tudo.
```

### Como invocar

Use `Agent` com:
- `subagent_type: "general-purpose"`
- `model: "opus"`
- `description: "<3-5 palavras>"`
- `prompt: <prompt completo abaixo>`
- Múltiplos agentes **no mesmo `<function_calls>`** pra rodar em paralelo

### Subagente A — README do backend

```
description: "Gerar BuscouViajouApi/README.md"
prompt: """
[REGRAS INEGOCIÁVEIS — colar bloco acima]

TAREFA: Gerar D:/Github/Buscou-Viajou/BuscouViajouApi/README.md descrevendo
o backend NestJS do projeto Buscou Viajou.

ARQUIVOS A LER NA ÍNTEGRA (use Read sequencial até cobrir cada um):
- D:/Github/Buscou-Viajou/BuscouViajouApi/package.json
- D:/Github/Buscou-Viajou/BuscouViajouApi/tsconfig.json
- D:/Github/Buscou-Viajou/BuscouViajouApi/nest-cli.json
- D:/Github/Buscou-Viajou/BuscouViajouApi/.env.example
- D:/Github/Buscou-Viajou/BuscouViajouApi/src/main.ts
- D:/Github/Buscou-Viajou/BuscouViajouApi/src/app.module.ts
- D:/Github/Buscou-Viajou/BuscouViajouApi/src/config/env.ts
- D:/Github/Buscou-Viajou/BuscouViajouApi/src/auth/auth.module.ts
- D:/Github/Buscou-Viajou/BuscouViajouApi/src/auth/auth.controller.ts
- D:/Github/Buscou-Viajou/BuscouViajouApi/src/auth/auth.guard.ts
- D:/Github/Buscou-Viajou/BuscouViajouApi/src/auth/jwks.service.ts
- D:/Github/Buscou-Viajou/BuscouViajouApi/src/auth/decorators.ts
- D:/Github/Buscou-Viajou/BuscouViajouApi/src/database/supabase.service.ts
- D:/Github/Buscou-Viajou/BuscouViajouApi/src/common/filters/all-exceptions.filter.ts
- D:/Github/Buscou-Viajou/BuscouViajouApi/src/common/pipes/zod-validation.pipe.ts
- D:/Github/Buscou-Viajou/BuscouViajouApi/src/common/geo/brazil-cities.ts
- Listar src/modules/* via Glob, ler cada controller + service + module + dto

CONTEÚDO DO README:
1. Título + 1 parágrafo do que é
2. Stack (Node, NestJS, supabase-js, jose, zod, qrcode)
3. Como rodar local (.env.example, npm install, npm run start:dev)
4. Endpoints disponíveis (tabela: método, path, auth?, descrição)
5. Estrutura de pastas com descrição
6. Como rodar smoke test
7. Como rodar seed
8. Como gerar tipos (gen:types)
9. Como buildar e iniciar em prod

NÃO mencionar comportamento que não está no código lido.
NÃO copiar do PRD nem do design system — APENAS o que está no código.

Reportar ao final: lista de arquivos lidos com tamanho de cada.
"""
```

### Subagente B — README do frontend

```
description: "Gerar BuscouViajouFrontend/README.md"
prompt: """
[REGRAS INEGOCIÁVEIS]

TAREFA: Gerar D:/Github/Buscou-Viajou/BuscouViajouFrontend/README.md.

ARQUIVOS A LER:
- BuscouViajouFrontend/package.json
- BuscouViajouFrontend/tsconfig.json
- BuscouViajouFrontend/next.config.mjs
- BuscouViajouFrontend/postcss.config.js
- BuscouViajouFrontend/tailwind.config.js
- BuscouViajouFrontend/.env.example
- BuscouViajouFrontend/src/app/layout.tsx
- BuscouViajouFrontend/src/app/page.tsx
- BuscouViajouFrontend/src/lib/supabase/client.ts
- BuscouViajouFrontend/src/lib/supabase/server.ts
- BuscouViajouFrontend/src/lib/api/client.ts
- BuscouViajouFrontend/src/lib/api/types.ts
- BuscouViajouFrontend/src/lib/providers/query-provider.tsx
- BuscouViajouFrontend/src/lib/utils/cn.ts
- BuscouViajouFrontend/src/styles/tokens.css
- BuscouViajouFrontend/src/styles/globals.css
- Listar BuscouViajouFrontend/public/fonts/gotham via Glob
- Listar BuscouViajouFrontend/public/brand via Glob

CONTEÚDO DO README:
1. Título + 1 parágrafo
2. Stack (Next.js 15, Tailwind, Supabase Auth, TanStack Query, Gotham)
3. Como rodar local (.env.local + npm install + npm run dev)
4. Estrutura de pastas
5. Convenções de imports (@/* via tsconfig paths)
6. Onde estão tokens, fontes, logos
7. Como gerar tipos do banco
8. Como buildar pra produção

NÃO mencionar componentes/páginas que não existem ainda — apenas
listar o que está em /src/app/. Estado atual é "setup técnico, sem
componentes UI nem páginas estilizadas".

Reportar arquivos lidos com tamanho.
"""
```

### Subagente C — Inventário de assets de marca

```
description: "Gerar _context/brand/INVENTARIO.md"
prompt: """
[REGRAS INEGOCIÁVEIS]

TAREFA: Gerar D:/Github/Buscou-Viajou/_context/brand/INVENTARIO.md
catalogando todos os assets de marca, tamanhos, propósito.

LEITURA NECESSÁRIA:
- Listar via Bash: ls -la D:/Github/Buscou-Viajou/_context/brand/
- Listar via Bash: ls -la D:/Github/Buscou-Viajou/_context/brand/NanoBananaV2/
- Listar via Bash: ls -la D:/Github/Buscou-Viajou/_context/brand/final/
- Listar via Bash: ls -la D:/Github/Buscou-Viajou/BuscouViajouFrontend/public/brand/
- Ler D:/Github/Buscou-Viajou/_context/prompts/logo-nano-banana.md inteiro
- Ler D:/Github/Buscou-Viajou/BuscouViajouApi/scripts/process-logos.mjs inteiro
- Ler D:/Github/Buscou-Viajou/_context/brand/NanoBananaV2/v1.svg inteiro

CONTEÚDO:
1. Tabela: arquivo / tamanho / dimensões / uso / origem
2. Diagrama do pipeline: NanoBananaV2 (4-5MB) → process-logos.mjs → final/
   (~200-400KB) → public/brand/
3. Quando reprocessar (qual comando)
4. Variações disponíveis (V1-V5 + monogramas + favicons)

NÃO INVENTAR dimensões — usa ImageMagick (Bash com `identify`) ou Sharp
inline pra confirmar.

Reportar arquivos listados/lidos.
"""
```

### Subagente D — Inventário de migrations

```
description: "Gerar supabase/MIGRATIONS.md"
prompt: """
[REGRAS INEGOCIÁVEIS]

TAREFA: Gerar D:/Github/Buscou-Viajou/supabase/MIGRATIONS.md
documentando todas as migrations aplicadas e o schema resultante.

LEITURA NECESSÁRIA:
- Cada arquivo de D:/Github/Buscou-Viajou/supabase/migrations/*.sql LIDO
  INTEIRAMENTE (alguns têm 26KB / 800 linhas — ler com offset/limit
  até cobrir tudo)
- D:/Github/Buscou-Viajou/supabase/config.toml

CONTEÚDO:
1. Resumo: total de migrations, total de tabelas criadas
2. Por migration: arquivo, propósito, o que cria/altera, em ordem
3. Diagrama ER simplificado em texto (tabelas e relacionamentos principais)
4. Lista de RLS policies por tabela (resumida — quem pode SELECT/INSERT/UPDATE/DELETE)
5. Lista de storage buckets com mime-types e políticas
6. Lista de enums e seus valores
7. Triggers e funções

Use formato MARKDOWN com tabelas. NÃO INVENTAR — apenas o que está nos
SQL.

Reportar arquivos lidos com linhas e tamanho.
"""
```

### Subagente E — Manifest de tasks (snapshot)

```
description: "Gerar tasks-snapshot.md"
prompt: """
[REGRAS INEGOCIÁVEIS]

TAREFA: Gerar D:/Github/Buscou-Viajou/_context/tasks-snapshot-AAAA-MM-DD.md
(substitua AAAA-MM-DD pela data de hoje em ISO).

LEITURA:
- Use TaskList tool pra obter estado atual
- Use TaskGet em cada task pra ver descrição completa
- Cruzar com claude.md (status atual) e continuidade.md ("o que está pronto")

CONTEÚDO:
1. Snapshot da TaskList (id, status, subject, descrição, owner)
2. Discrepâncias entre tasks e claude.md/continuidade.md (se houver)
3. Recomendação de cleanup (tasks completed muito antigas que podem ser deletadas)

Apenas registro factual. Sem opinião sobre prioridade.
"""
```

### Subagente F — Inventário de fontes

```
description: "Gerar fonts/README.md"
prompt: """
[REGRAS INEGOCIÁVEIS]

TAREFA: Gerar D:/Github/Buscou-Viajou/BuscouViajouFrontend/public/fonts/README.md

LEITURA:
- ls -la D:/Github/Buscou-Viajou/BuscouViajouFrontend/public/fonts/gotham/
- D:/Github/Buscou-Viajou/_context/gotham-fonts-main/web/stylesheet.css
  (lendo inteiro)
- D:/Github/Buscou-Viajou/BuscouViajouFrontend/src/styles/tokens.css
  (lendo a parte de @font-face)

CONTEÚDO:
1. Lista de pesos disponíveis (100 thin → 900 ultra) e arquivos
   correspondentes
2. Como o frontend referencia (path /fonts/gotham/...)
3. Mapeamento weight → arquivo
4. Origem: pacote do _context/gotham-fonts-main

NÃO INVENTAR. Reportar tamanhos.
"""
```

---

## Quando rodar Etapa 1 vs Etapa 2

| Cenário | Etapa 1 | Etapa 2 |
|---|---|---|
| Sessão fez mudanças estruturais grandes | ✅ obrigatório | ✅ recomendado |
| Sessão só refatorou código | ✅ obrigatório | opcional |
| Sessão foi só documentação | ✅ obrigatório | pular |
| Sessão muito curta (<3 mensagens com efeito) | ✅ leve | pular |
| Sessão criou pastas/módulos novos | ✅ obrigatório | ✅ obrigatório |

Em geral: **Etapa 1 é sempre**, Etapa 2 é "recomendado mas opcional".

---

## Reporte final

Ao terminar, devolva uma tabela:

```
| Arquivo                                  | Modificado? | Por quem  |
|------------------------------------------|-------------|-----------|
| continuidade.md                          | ✅ sim      | eu mesmo  |
| claude.md                                | ❌ não      | —         |
| _context/IA/sitemap.md                   | ✅ sim      | eu mesmo  |
| BuscouViajouApi/README.md                | ✅ novo     | subagente A |
| BuscouViajouFrontend/README.md           | ✅ novo     | subagente B |
| _context/brand/INVENTARIO.md             | ✅ novo     | subagente C |
| supabase/MIGRATIONS.md                   | ✅ novo     | subagente D |
| _context/tasks-snapshot-2026-04-30.md    | ✅ novo     | subagente E |
| BuscouViajouFrontend/public/fonts/README.md | ✅ novo  | subagente F |
```

Inclua linhas pra arquivos que tentou modificar mas não havia o que mudar
(linha "❌ não / —").

---

## Pós-scanner

Após reportar, **NÃO** faça mais nada. Aguarde eu fechar a sessão ou
mandar nova instrução. Esta é a borda final do trabalho da sessão.
