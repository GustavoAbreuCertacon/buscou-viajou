# Matriz de Estados por Tela — Buscou Viajou (Demo)

> Catálogo exaustivo dos estados de cada tela. Cada estado tem texto sugerido
> com voz da marca (simples, otimista, verbos de jornada) e visual associado.
> Skeleton loaders mostrados durante fetch — nunca spinners genéricos.

## Convenções globais

| Estado | Quando aparece | Visual padrão |
|---|---|---|
| **Loading** | Fetch inicial ou navegação | Skeleton estrutural (matches do layout final) |
| **Empty** | Resposta válida sem dados | Ilustração outline navy + título h3 bicolor + CTA accent |
| **Success** | Tudo carregou | Conteúdo real |
| **Error 4xx** | Cliente errou (validação, não autorizado, não encontrado) | Card amarelo/danger + ação corrigir |
| **Error 5xx** | Backend falhou | Card danger + `error_id` + CTA "Tentar de novo" |
| **Offline** | `navigator.onLine === false` | Banner topo `--bv-warning` |

Toast pattern: aparece bottom-right desktop, top mobile. Auto-dismiss 5s. Variants:
`success` (green-50 bg / green-700 text), `info` (navy-50 / navy-700),
`warning`, `danger`.

---

## `/` — Landing/Home

| Estado | Trigger | Conteúdo / Ação |
|---|---|---|
| **Default** | sempre | Hero + form de busca + tag jornada + valores + footer |
| **Busca enviada** | submit form | Botão vira loading; ao receber resposta → redirect `/busca?...` |
| **Validação form** | campo inválido | Erro inline abaixo do campo, em `--bv-danger`, body-sm |
| **Form vazio** | submit incompleto | Botão "Buscar viagens" desabilitado (opacity 40, cursor not-allowed) |
| **Voz da marca em CTAs** | — | "Buscar viagens", "Encontrar agora", "Comparar preços" — verbos de jornada |

Validações do form:
- **Origem/Destino** vazios → "Informe a cidade"
- **Origem == Destino** → "Origem e destino devem ser diferentes"
- **Data < D+1** → "A viagem precisa ser pelo menos amanhã"
- **Passageiros < 1** → "Pelo menos 1 passageiro"
- **Passageiros > 60** → "Para grupos maiores, fale conosco"

---

## `/busca` — Resultados

| Estado | Trigger | Conteúdo / Ação |
|---|---|---|
| **Loading** | navegação inicial | Skeleton: 3 VehicleResultCards + sidebar de filtros placeholder |
| **Success** | quote retorna 1+ veículos | Lista + filtros + sortbar + contador "23 veículos disponíveis" |
| **Empty (sem resultados)** | quote retorna 0 | Ilustração + "Não encontramos veículos pra essa rota e data." + CTAs "Tentar outra data" / "Editar busca" |
| **Empty (filtros)** | filtros aplicados zeram lista | "Nenhum veículo combina com seus filtros." + CTA "Limpar filtros" |
| **400 cidade inválida** | quote retorna 400 INVALID_CITY | Toast danger + permanece em `/busca` mostrando form de busca em destaque |
| **400 cotação expirada** | usuário ficou >30min sem clicar | (na verdade isso só dispara quando vai pra reserva — aqui só se F5) Toast info "Atualizamos os preços" + refaz quote automaticamente |
| **5xx** | backend down | Card danger ocupando hero da tela: "Estamos com instabilidade. Tente em instantes." + `error_id` + botão "Tentar de novo" |
| **Edit busca** | clica "Editar busca" no header | Sheet desktop (drawer), modal mobile com form preenchido |
| **Filtros aplicados** | mudança em sidebar | Atualiza lista local instantaneamente (filtros são client-side sobre a lista) |
| **Mudança de ordenação** | mudança no SortBar | Reordena lista local |

Voz nos empty states:
- *"Não encontramos veículos pra essa rota e data."* (factual, sem culpa)
- *"Que tal tentar uma data próxima?"* (otimista, sugestão)

---

## `/veiculo/[id]` — Detalhes

| Estado | Trigger | Conteúdo / Ação |
|---|---|---|
| **Loading** | navegação inicial | Skeleton: galeria placeholder + cabeçalho + sidebar preço |
| **Success** | vehicle carrega | Tudo renderizado (galeria, preço, comodidades, mapa, avaliações) |
| **404** | vehicle não existe ou inativo | Página 404 customizada + CTA "Voltar pra busca" |
| **Sem fotos** | vehicle.photos.length === 0 | Placeholder ilustração com ícone outline veiculo + "Foto não disponível" |
| **Sem avaliações** | reviews vazias | "Este veículo ainda não tem avaliações." (tom neutro) |
| **Sem mapa** | sem coordenadas | Esconder seção mapa silenciosamente (não mostrar erro) |
| **Reservar (anônimo)** | clica "Solicitar Reserva" | Salva `lockedQuoteId` em localStorage + redirect `/login?next=/veiculo/[id]` |
| **Reservar (logado)** | clica "Solicitar Reserva" | `POST /v1/bookings` → loading button → redirect `/reserva/[id]` |
| **Cotação expirada** | tentou reservar com lockedQuote >30min | Toast info "Atualizando preço…" + refetch automático /v1/quotes da rota original |
| **Erro reserva** | 5xx ou 400 | Toast danger + mantém na página, botão "Solicitar Reserva" volta a clicável |

Voz:
- *"Solicitar Reserva"* (não "Reservar agora", que soa pressuroso)
- *"Este preço fica garantido por mais XX minutos."* (countdown visível)
- *"Adicionais"* (não "Extras" nem "Add-ons")

---

## `/login` — Login (magic link)

| Estado | Trigger | Conteúdo / Ação |
|---|---|---|
| **Default** | rota acessada | Form com input email + botão "Enviar link mágico" |
| **Email inválido** | submit com formato errado | Erro inline "Informe um e-mail válido." |
| **Email enviado** | sucesso no signInWithOtp | Tela de confirmação: "✉️ Enviamos um link pra `email@dominio.com`. Confira sua caixa de entrada." |
| **Cooldown reenvio** | clica "reenviar" antes de 60s | Botão desabilitado + countdown "Tente em 32s" |
| **Limite Supabase** | rate limit (4/h grátis) | Toast danger "Muitas tentativas. Aguarde alguns minutos." |
| **5xx no Supabase** | falha API auth | Toast danger + manter no form |
| **Já logado + acessa /login** | middleware | Redirect `/minhas-viagens` |
| **Voltar do email** | click em link | → `/auth/callback` (próxima tela) |

Voz:
- *"Buscou Viajou sem senha"* (USP do magic link)
- *"Enviamos um link pra você. É só clicar e pronto."*
- *"Sem senha, sem complicação."*

---

## `/auth/callback` — Callback do magic link

Tela técnica, geralmente o usuário nem vê (redireciona em <500ms).

| Estado | Trigger | Conteúdo / Ação |
|---|---|---|
| **Processando** | code chegou | Loading minimal: spinner + "Entrando…" |
| **Code inválido** | code expirou ou foi reusado | Redirect `/auth/erro?reason=invalid_code` |
| **Sucesso + intent pendente** | localStorage.pendingBookingIntent | Redirect `/veiculo/[id]` retomando flow |
| **Sucesso sem intent + ?next=** | param na URL | Redirect `next` (validado pra não permitir external) |
| **Sucesso default** | nada acima | Redirect `/minhas-viagens` |

---

## `/auth/erro`

| Estado | Trigger | Conteúdo / Ação |
|---|---|---|
| **invalid_code** | callback com code expirado | "Esse link expirou. Pode pedir um novo?" + CTA "Voltar pro login" |
| **server_error** | falha técnica | "Algo deu errado. Tente em instantes." + `error_id` |

---

## `/minhas-viagens` — Hub do cliente

| Estado | Trigger | Conteúdo / Ação |
|---|---|---|
| **Loading** | nav inicial | Skeleton: tabs placeholder + 3 BookingCards |
| **Success com viagens** | API retorna lista | Tabs com contadores + lista de cards |
| **Empty geral** | total === 0 | Ilustração + "Você ainda não viajou com a gente." + CTA accent "Buscar veículos" → `/` |
| **Empty por tab** | tab tem 0 mas total > 0 | "Nada por aqui ainda." (texto sutil, sem CTA — pra não confundir) |
| **5xx** | API down | Card danger no lugar da lista + retry |
| **Mudança de tab** | clique | Re-filtra lista local (sem refetch) |
| **Clique em card** | navegar | → `/reserva/[id]` |

Voz:
- *"Você ainda não viajou com a gente."* (não "0 viagens encontradas")
- *"Próximas"* / *"Em andamento"* / *"Concluídas"* / *"Canceladas"* — labels diretas
- Status badges com cores semânticas + emoji mínimo (sem exagero)

---

## `/reserva/[id]` — Detalhe + bilhete

Esta tela é a mais "stateful" — comportamento muda muito conforme `booking.status`.

### Estados por `booking.status`

| Status | UI principal | Ações |
|---|---|---|
| `PENDING_APPROVAL` | Card amarelo "Aguardando aprovação da empresa" + timeline UC-001 | **Botão DEMO** "Simular aprovação + pagamento" / "Cancelar" |
| `PENDING_PAYMENT` | Card "Aprovada, falta pagar" | "Pagar agora" (DEMO mock no demo) / "Cancelar" |
| `CONFIRMED` | **Bilhete digital com QR + dados** | "Cancelar" + share buttons |
| `IN_PROGRESS` | Card verde "Viagem em andamento" + bilhete | (sem ações) |
| `PENDING_COMPLETION` | "Viagem concluída? Confirme abaixo" | "Confirmar conclusão" / "Reportar problema" |
| `COMPLETED` | Resumo da viagem + nota | **"Avaliar viagem"** (se prazo 7d) / "Reportar problema" (se prazo 72h) |
| `CANCELLED_BY_CLIENT` | Resumo + valor reembolso | (sem ações) |
| `CANCELLED_BY_COMPANY` | Resumo + reembolso integral + alternativas (Fase 2) | "Buscar outra opção" |
| `REJECTED` | Card neutro "Solicitação não aceita" + motivo | "Buscar outra opção" |
| `EXPIRED` | Card neutro "Solicitação expirou" | "Buscar de novo" |
| `NO_SHOW_CLIENT` | Card neutro "Você não compareceu" | (sem ações) |
| `NO_SHOW_COMPANY` | Card vermelho "Empresa não compareceu" + crédito | (Fase 2 disputas) |

### Estados não-status

| Estado | Trigger | Conteúdo / Ação |
|---|---|---|
| **Loading** | nav inicial | Skeleton: card timeline + bilhete placeholder |
| **404** | id não existe ou outro user | "Reserva não encontrada." + CTA → `/minhas-viagens` |
| **403** | tentou ver de outro user | (mesmo que 404 — não revela existência) |
| **5xx** | API down | Card danger + retry |
| **Demo button click** | aprovação | Loading button "Processando..." → toast success → status atualizado |
| **Cancel modal** | clica "Cancelar" | Modal explicando RN-FIN-002 com hours-to-trip + valor estimado de reembolso |
| **Cancel sucesso** | POST /cancel ok | Toast success com valor reembolsado → re-fetch → status atualizado |
| **Cancel falhou** | 4xx (transição inválida ou prazo) | Toast danger explicando motivo |
| **QR offline** | `!navigator.onLine` | Mostrar QR cacheado (PNG base64 do response) + banner "Modo offline" |

---

## `/[404]` — Not Found

| Estado | Trigger | Conteúdo / Ação |
|---|---|---|
| **Default** | rota inexistente | Ilustração + h1 bicolor "Buscou aqui? <span green>Sem rota.</span>" + CTA "Voltar pra home" + sub-ctas pra rotas comuns |

---

## `/[erro]` — Error boundary

| Estado | Trigger | Conteúdo / Ação |
|---|---|---|
| **Default** | exceção não tratada | "Algo deu errado por aqui. Nossa equipe foi notificada." + `error_id` + CTA "Voltar" + "Tentar de novo" |

---

## Loading states — patterns

Usar **skeletons que combinem com o layout final**, não spinners genéricos.

| Tela | Skeleton sugerido |
|---|---|
| `/busca` | 3 cards verticais com placeholder de imagem (240×180), 2 linhas de texto, badge, preço grande |
| `/veiculo/[id]` | Galeria placeholder (16:9) + sidebar preço + 4 linhas de descrição |
| `/minhas-viagens` | 3 booking cards com 4 colunas placeholder |
| `/reserva/[id]` | Card grande do bilhete (com QR placeholder) + timeline 5 steps |

### Component Skeleton recomendado

```tsx
// Ex pseudo:
<Skeleton className="h-[180px] w-[240px] rounded-bv-md" />
// fundo: --bv-color-bg
// shimmer: linear-gradient com white/40 movendo da esquerda pra direita, 1.5s
```

---

## Empty states — patterns

Estrutura visual padrão:

```
┌────────────────────────────────────┐
│                                    │
│       [ilustração outline navy]    │
│        ~120px altura, centro       │
│                                    │
│      H3 bicolor (navy + green)     │
│                                    │
│     body texto, navy/72, max-w-sm  │
│                                    │
│       [Botão accent CTA]           │
│                                    │
└────────────────────────────────────┘
       py-bv-9 (96px), gap-bv-4
```

### Catálogo de empty states

| Cenário | Ilustração | Título | Texto | CTA |
|---|---|---|---|---|
| Sem reservas | mala/passport outline | "Sua próxima <green>viagem</green> começa aqui." | "Você ainda não viajou com a gente." | "Buscar veículos" → `/` |
| Sem resultados busca | lupa outline | "Buscou aqui? <green>Sem resultado.</green>" | "Não achamos veículos pra essa rota e data." | "Tentar outra data" |
| Sem avaliações | balão de fala outline | "Sem avaliações <green>ainda.</green>" | "Este veículo aguarda a primeira viagem." | (sem CTA) |
| Sem fotos | câmera outline | "Foto <green>indisponível.</green>" | (sem texto) | (sem CTA) |
| Cancelada/rejeitada | "—" subtle | "Reserva <green>cancelada.</green>" | "Esta viagem não vai acontecer." | "Buscar outra opção" |

---

## Error states — patterns

### 4xx (cliente)

Toast contextual, ação corrigível, sem `error_id`.

| Cenário | Toast |
|---|---|
| Validação | warning toast com lista do que corrigir |
| 401 não autenticado | redirect /login |
| 403 sem permissão | "Você não tem acesso a esta página." (raro no fluxo cliente) |
| 404 não encontrado | página 404 ou toast "Não encontramos esta reserva." |
| 409 conflito (cotação usada) | toast info + sugestão de refazer busca |

### 5xx (servidor)

Card destacado ou toast persistente, com `error_id` pra suporte.

```
┌────────────────────────────────────────┐
│ ⚠️  Algo deu errado por aqui.          │
│                                        │
│ Nossa equipe foi notificada e está     │
│ trabalhando pra resolver.              │
│                                        │
│ Pode tentar de novo ou voltar.         │
│                                        │
│ Código: 7d00f8de-c5d1-4782             │
│                                        │
│ [Tentar de novo]    [Voltar]           │
└────────────────────────────────────────┘
```

---

## Decisões pendentes

- [ ] Como tratar `prefers-reduced-motion`? Plano: shimmer skeleton vira pulse simples.
- [ ] Toast pode acumular? Plano: max 3 visíveis, novo empurra mais antigo.
- [ ] Confirmações destrutivas (cancel, logout): modal ou toast com undo? Plano: cancel → modal, logout → ação direta.
- [ ] Tempo de mostrar mensagem "Email enviado" antes de permitir reenvio? Plano: countdown 60s.
