# RUNBOOK — Apresentação Buscou Viajou

> Operacional. O que clicar, quando, e o que fazer se quebrar.
>
> **Decks disponíveis:**
> - `APRESENTACAO-TECH.md` ← **USE ESTE** se a audiência é técnica (dev/CTO/arquiteto)
> - `APRESENTACAO.md` ← versão comercial (dono de empresa, investidor)
>
> Última validação em produção: **2026-04-30 16:42 (BRT)**.

---

## URLs validadas (copiar/colar — todas testadas hoje via curl + Playwright)

| Onde | URL |
|---|---|
| **Frontend** | https://buscou-viajou.vercel.app |
| **Backend health** | https://buscou-viajou-api.onrender.com/v1/health |
| **Backend Swagger** | https://buscou-viajou-api.onrender.com/docs |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/cscblvcqjwxmgzalowop |

### Demo bookings prontos (dados reais no banco)

| Reserva | Status | URL |
|---|---|---|
| **BV-2026-ADAB** (Capital Tour, R$ 1.030,40) | CONFIRMED | https://buscou-viajou.vercel.app/reserva/f546503a-f2a7-48f3-8da5-e1f209422d7f |
| Ana → São Paulo→Campos do Jordão (10 pax) | PENDING_APPROVAL | https://buscou-viajou.vercel.app/reserva/beca9421-f948-435b-b251-e27f75ff47d9 |

### Credenciais (seed)

| Login | Senha (não usar — magic link) |
|---|---|
| `cliente1@buscouviajou.demo` | `demo12345` |
| `admin@buscouviajou.demo` | `demo12345` |

---

## T-30min — Pre-flight (acordar o backend)

Render free dorme após 15min. Cold start = ~30s. **Esquentar antes da call.**

```bash
# Acordar o backend (faça 3-4x até retornar rápido)
curl https://buscou-viajou-api.onrender.com/v1/health
curl https://buscou-viajou-api.onrender.com/v1/health
curl https://buscou-viajou-api.onrender.com/v1/health
```

Resposta esperada:
```json
{"status":"ok","database":"reachable","amenities_count":10,"latency_ms":150,"timestamp":"..."}
```

Se o primeiro hit demorar 20-40s, é cold start normal. **Refaça** até cair pra <500ms.

### Checklist T-30
- [ ] `/v1/health` responde <500ms
- [ ] Login Supabase Studio aberto em outra aba (caso precise debug)
- [ ] Playwright/DevTools fechados (a apresentação vai pelo navegador limpo)

---

## T-15min — Login real como Ana (magic link)

A apresentação **precisa** que você esteja logado de verdade. Cookie via DevTools tem limitações (HttpOnly não carrega no SSR). Faça login real:

1. Abra https://buscou-viajou.vercel.app/login
2. Email: `cliente1@buscouviajou.demo`
3. Clique **"Enviar link"**
4. Abra a caixa de email da Ana — **se você não tem acesso**, use o jeito CLI:

   ```bash
   # Gerar magic link via Supabase (admin)
   curl -X POST 'https://cscblvcqjwxmgzalowop.supabase.co/auth/v1/admin/generate_link' \
     -H "apikey: $SERVICE_ROLE_KEY" \
     -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
     -H "Content-Type: application/json" \
     -d '{"type":"magiclink","email":"cliente1@buscouviajou.demo","options":{"redirectTo":"https://buscou-viajou.vercel.app/auth/callback"}}'
   ```

   `SERVICE_ROLE_KEY` está no `.env` do backend ou no Supabase Dashboard → Settings → API.

5. Clique no link → redireciona pra `/auth/callback` → cookies seteados → você vê **"A Ana"** no avatar do canto direito.

### Checklist T-15
- [ ] Logado como Ana (avatar "A" + nome no canto da Navbar)
- [ ] Aba 1 — Landing (https://buscou-viajou.vercel.app)
- [ ] Aba 2 — `/minhas-viagens` (mostra reservas da Ana)
- [ ] Aba 3 — `/reserva/f546503a-...` (BV-2026-ADAB CONFIRMED com QR)
- [ ] Aba 4 — Swagger (https://buscou-viajou-api.onrender.com/docs) — backup técnico
- [ ] Aba 5 — Supabase Studio (mostrar 27 tabelas se perguntarem da arquitetura)

---

## T-5min — Confirmação final

- [ ] Internet estável (cabo > WiFi se possível)
- [ ] APRESENTACAO.md aberto noutra tela / impresso (script colado se travar)
- [ ] Som do laptop em silêncio (sem notificações)
- [ ] Café/água ao alcance
- [ ] Respiração — você validou tudo, está tudo no ar

---

## Roteiro técnico (acompanha APRESENTACAO-TECH.md)

> Audiência técnica espera ver **demo ao vivo + código real**, não slide.
> Tenha um **editor aberto** (VS Code) com 3 arquivos prontos:
>
> 1. `BuscouViajouApi/src/modules/quotes/quotes.service.ts` (pricing dinâmico)
> 2. `BuscouViajouApi/src/modules/bookings/bookings.service.ts` (state machine, linhas 18-31)
> 3. `supabase/migrations/20260429120000_initial_schema.sql` (schema das 27 tabelas)
>
> Alternativa pro Swagger: tenha aberto `https://buscou-viajou-api.onrender.com/docs` numa aba.

### Bloco 1 — Pitch técnico (1min)
*"Marketplace de fretamento turístico. Demo end-to-end do fluxo cliente. Stack: Next 15 + NestJS + Postgres/Supabase, sem Prisma, RLS habilitado, JWT validado via JWKS. Painel de empresa está planejado mas não construído. Quero te mostrar o que tá vivo, depois discutir as decisões."*

### Bloco 2 — Demo cliente (5min)
- Aba 1 (Landing) → SearchForm → `/busca`
- Mostre os 25 cards, fale do `locked_quotes` (preço travado por 30min)
- Click veículo → `/veiculo/:id`
- Aba 3 (BV-2026-ADAB CONFIRMED) → mostre QR
- Aba 2 (`/minhas-viagens`) → mostre RLS funcionando ("Ana só vê o que é dela")

### Bloco 3 — Código (3-4min)
- Abra `quotes.service.ts:60-208` — algoritmo do pricing dinâmico, 4 passos
- Abra `bookings.service.ts:18-31` — state machine das 12 transições
- Abra Swagger → mostre 17 endpoints + schemas Zod automáticos

### Bloco 4 — Schema + Auth (2min)
- Aba 5 (Supabase Studio) → 27 tabelas, RLS habilitado, 6 buckets
- Explique o flow: magic link → cookie HttpOnly → Bearer → JWKS público (sem segredo no backend)

### Bloco 5 — Honestidade técnica (1min)
*"Pagamento é mock — `_demo/approve-and-pay`. Stripe Connect ficaria pra Fase 4. Geocoder é hardcoded com 30 capitais — pra prod precisa Mapbox/Geoapify. Painel empresa está planejado mas não built. Sem observabilidade. Tudo isso está no `APRESENTACAO-TECH.md` seção 9-10."*

### Bloco 6 — Q&A (resto do tempo)
- Use a seção 12 do `APRESENTACAO-TECH.md` (8 perguntas técnicas com respostas prontas)
- Se travarem em algo: Aba 4 (Swagger) ou repo aberto

---

## Roteiro comercial (legacy — acompanha APRESENTACAO.md)

### Bloco 1 — Abertura (~2min)
**Aba 1 (Landing).** Mostre:
- Hero "Buscou. Encontrou. Viajou." (assinatura visual bicolor)
- Search form preenchido: São Paulo, SP → Campos do Jordão, SP → 15 mai 2026 → 10 pax
- "Buscar viagens" → mostra que vai pra `/busca`

### Bloco 2 — Busca + Comparação (~3min)
**Você está em `/busca`.** Mostre:
- 25 veículos retornados (validado: 25 em produção)
- Filtros laterais (capacidade, ar-condicionado, Wi-Fi, banheiro)
- Cards lado a lado: empresa, preço, multiplicador, JourneyTag (km/h)
- Click em um veículo → `/veiculo/[id]`

### Bloco 3 — Detalhes do veículo (~2min)
- Galeria de fotos
- Specs completas
- Reviews da empresa
- Botão "Solicitar reserva" → `/reserva/criar?...`

### Bloco 4 — Reserva ativa (~3min)
**Aba 3 (BV-2026-ADAB CONFIRMED).** Mostre:
- Status "Confirmada" (badge verde)
- Bilhete digital com QR code
- Resumo: Renault Master Executiva, Capital Tour, 10 pax
- Total R$ 1.030,40
- Botão "Cancelar reserva" (RN-FIN-002 — política de reembolso)

### Bloco 5 — Histórico do cliente (~1min)
**Aba 2 (`/minhas-viagens`).** Mostre:
- Lista de reservas da Ana
- Filtros por status
- Click em qualquer uma → reabre detalhe

### Bloco 6 — Tech stack (se perguntarem) (~2min)
**Aba 4 (Swagger).** Mostre:
- 17 endpoints REST documentados
- Tente um GET `/v1/companies` ao vivo — vai retornar JSON com 8 empresas

**Aba 5 (Supabase).** Mostre:
- 27 tabelas, RLS habilitado
- 6 storage buckets
- Migrations versionadas

### Bloco 7 — Fechamento (~2min)
- Stack: Next 15 + NestJS + Postgres
- 28/28 testes E2E
- Custo demo: $0/mês
- Próximos passos: painel de empresa (~24-30h, planejado em `_context/plano-demo-empresa.md`)

---

## Fallbacks — se algo quebrar

### "Backend não responde / página em loading infinito"
- **Causa provável:** cold start (Render dormiu).
- **Fallback:** abra a Aba 4 (Swagger) e mostre a estrutura técnica enquanto fala. Em paralelo:
  ```bash
  curl https://buscou-viajou-api.onrender.com/v1/health
  ```
  Volte ao frontend após retornar 200.
- **Frase pronta:** *"O backend está em tier free, está acordando — em produção real isso não acontece com plano pago de $7/mês."*

### "Magic link não chega"
- **Causa provável:** rate limit Supabase (4 emails/hora).
- **Fallback:** você já está logado desde o T-15. Se realmente perdeu a sessão, use o `curl` admin (T-15min, passo 4) pra gerar magic link sem email.

### "Erro 401 em qualquer rota autenticada"
- **Causa provável:** sessão expirou (1h).
- **Fallback:** clique no avatar → Sair → faça login de novo (cookie HttpOnly válido por 1h).

### "WiFi caiu"
- **Fallback:** abra `APRESENTACAO.md` direto e narre o fluxo com prints de `_context/flow-test-screenshots/` que estão salvos local.

### "Stakeholder pediu pra ver o painel da empresa"
- **Frase pronta:** *"O painel da empresa é a Fase 2, planejada em `_context/plano-demo-empresa.md`, ~24-30h de trabalho. Hoje eu mostro o lado do cliente, que é o caso crítico de conversão."*

### "Stakeholder pediu pra ver código"
- **Aba 4 (Swagger)** já mostra o backend.
- **Aba 5 (Supabase)** mostra o schema.
- Se for um dev: abra `BuscouViajouApi/src/modules/quotes/quotes.service.ts` (lógica do pricing dinâmico) ou `BuscouViajouFrontend/src/components/feature/SearchForm.tsx`.

### "Pediram pra cancelar uma reserva ao vivo"
- Use a reserva PENDING_APPROVAL (Aba não-existe ainda — abra `/reserva/beca9421-f948-435b-b251-e27f75ff47d9`).
- Click "Cancelar" → confirma → backend aplica RN-FIN-002 (>72h = 100% reembolso).
- **NÃO** cancele a CONFIRMED (BV-2026-ADAB) — você perde o demo do QR.

---

## Comandos de emergência (cole no terminal se travar)

```bash
# Backend morreu? Acorda:
curl https://buscou-viajou-api.onrender.com/v1/health

# Validação completa em 30 segundos:
curl -s https://buscou-viajou-api.onrender.com/v1/health | head -c 200
curl -s "https://buscou-viajou-api.onrender.com/v1/cities/search?q=sao" | head -c 200
curl -s -X POST https://buscou-viajou-api.onrender.com/v1/quotes \
  -H "Content-Type: application/json" \
  -d '{"origin":"São Paulo, SP","destination":"Campos do Jordão, SP","departure_date":"2026-05-15","passengers":10}' | head -c 300

# Gerar magic link sem email (admin):
TOKEN="$SERVICE_ROLE_KEY"  # do .env
curl -X POST 'https://cscblvcqjwxmgzalowop.supabase.co/auth/v1/admin/generate_link' \
  -H "apikey: $TOKEN" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"magiclink","email":"cliente1@buscouviajou.demo","options":{"redirectTo":"https://buscou-viajou.vercel.app/auth/callback"}}'
```

---

## O que foi validado hoje em produção (2026-04-30)

| Teste | Resultado |
|---|---|
| `GET /v1/health` | ✅ 200, db reachable |
| `GET /v1/cities/search?q=sao` | ✅ retorna São Paulo + outras |
| `POST /v1/quotes` (SP→Campos do Jordão, 10 pax) | ✅ 25 veículos |
| `POST /auth/v1/token` (login Ana) | ✅ access_token retornado |
| `GET /v1/auth/me` (Ana) | ✅ CLIENT VERIFIED |
| `GET /v1/bookings` (Ana) | ✅ 6 reservas |
| `GET /v1/bookings/:id/ticket` (BV-2026-ADAB) | ✅ QR SVG retornado |
| Frontend `/busca` visual | ✅ 25 cards renderizados |
| Frontend `/reserva/[id]` visual | ✅ status + resumo |
| Supabase Auth URLs (CLI push) | ✅ vercel.app whitelistado |

---

## Mensagem-chave (se ficar nervoso, leia)

> *"O Buscou Viajou é um marketplace de fretamento turístico no Brasil — o Trivago do ônibus de turismo. Hoje eu mostro o fluxo crítico do cliente: buscar uma rota, comparar veículos de várias empresas, reservar e receber o bilhete digital. Está 100% funcional em produção, com 28 testes E2E passando, 27 tabelas no banco, 17 endpoints documentados. Custo de operação na demo: zero."*

Boa apresentação. 🚌
