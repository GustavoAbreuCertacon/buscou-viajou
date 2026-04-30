# API Contract — Mapeamento Tela ↔ Endpoint

> Tabela de referência rápida pra cada tela: que endpoint do backend
> consome, que dado precisa, que ações dispara, que mutations.
> Backend já implementado — ver `BuscouViajouApi/`. Smoke test 20/20 OK.

## Endpoints disponíveis

| Método | Path | Auth? | Descrição |
|---|---|---|---|
| GET | `/v1/health` | público | Status do backend e DB |
| GET | `/v1/cities/search?q=` | público | Autocomplete de cidades BR |
| GET | `/v1/companies` | público | Lista empresas ativas |
| GET | `/v1/companies/:id` | público | Perfil de empresa |
| GET | `/v1/companies/:id/reviews` | público | Avaliações da empresa |
| GET | `/v1/companies/:id/vehicles` | público | Frota da empresa |
| GET | `/v1/vehicles/:id` | público | Detalhe completo do veículo |
| GET | `/v1/vehicles/:id/reviews` | público | Avaliações do veículo |
| POST | `/v1/quotes` | público (auth opcional) | Busca + pricing + lock 30min |
| GET | `/v1/auth/me` | auth | Profile do user logado |
| GET | `/v1/bookings` | auth | Lista reservas do cliente |
| POST | `/v1/bookings` | auth | Criar reserva (PENDING_APPROVAL) |
| GET | `/v1/bookings/:id` | auth | Detalhe da reserva |
| POST | `/v1/bookings/:id/_demo/approve-and-pay` | auth | DEMO: aprovar + pagar (mock) |
| GET | `/v1/bookings/:id/ticket` | auth | QR code + dados do bilhete |
| POST | `/v1/bookings/:id/cancel` | auth | Cancelar (aplica RN-FIN-002) |

Auth: header `Authorization: Bearer {supabase_jwt}`. JWT validado por JWKS ES256.

## Mapeamento tela → endpoints

### `/` — Landing/Home

| Quando | Endpoint | Por quê |
|---|---|---|
| Autocomplete origem/destino | `GET /v1/cities/search?q=...` | À medida que digita (debounce 300ms) |
| Submit form | (nada — só monta query string e navega) | Cotação real só em `/busca` |

Sem fetch inicial. Página estática.

### `/busca` — Resultados

| Quando | Endpoint | Body / Params |
|---|---|---|
| Carregar | `POST /v1/quotes` | `{ origin, destination, departureDate, passengers, ?returnDate }` |
| Editar busca | re-`POST /v1/quotes` | mesmo body atualizado |
| Filtrar/ordenar | (client-side) | sobre `data[]` da resposta |

Resposta tipada em `QuoteSearchResponse` (já está em `src/lib/api/types.ts`).

### `/veiculo/[id]` — Detalhes

| Quando | Endpoint |
|---|---|
| Carregar tela (server component) | `GET /v1/vehicles/:id` |
| Carregar avaliações (paralelo) | `GET /v1/vehicles/:id/reviews` |
| Carregar perfil empresa (paralelo) | `GET /v1/companies/:companyId` *(se quisermos o perfil completo — opcional, pois `/vehicles/:id` já traz `company`)* |
| Clicar "Solicitar Reserva" (logado) | `POST /v1/bookings` com `lockedQuoteId` (do localStorage) |
| Clicar "Solicitar Reserva" (anônimo) | salva intent + redirect `/login` |

`POST /v1/bookings` body:
```json
{
  "lockedQuoteId": "uuid-da-cotacao",
  "passengers": 10,
  "isRoundTrip": false
}
```

### `/login` — Login

| Quando | Endpoint |
|---|---|
| Submit email | `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: '...' }})` |

Não chama backend NestJS. Direto no Supabase Auth via `@supabase/supabase-js`.

### `/auth/callback`

| Quando | Endpoint |
|---|---|
| Code chega | `supabase.auth.exchangeCodeForSession(code)` |
| Sessão criada + intent pendente | `POST /v1/bookings` com intent salvo |

### `/minhas-viagens`

| Quando | Endpoint |
|---|---|
| Carregar | `GET /v1/bookings` |
| Filtro por tab | (client-side sobre `data[]`) |

Resposta vem com vehicle, company, ticket aninhados.

### `/reserva/[id]`

| Quando | Endpoint |
|---|---|
| Carregar | `GET /v1/bookings/:id` |
| Status `CONFIRMED+` precisa do bilhete | `GET /v1/bookings/:id/ticket` |
| Botão DEMO aprovar | `POST /v1/bookings/:id/_demo/approve-and-pay` |
| Botão Cancelar | `POST /v1/bookings/:id/cancel` |

Cancel body: `{ "reason": "string min 3 max 500" }`

---

## Padrões de fetch

### Server Components (Next.js App Router)

Usar pra páginas com SEO ou auth:

```tsx
// src/app/veiculo/[id]/page.tsx
import { api } from '@/lib/api/client';

export default async function VehiclePage({ params }) {
  const { id } = await params;
  const [vehicle, reviews] = await Promise.all([
    api(`/v1/vehicles/${id}`),
    api(`/v1/vehicles/${id}/reviews`),
  ]);
  return <VehicleDetail vehicle={vehicle} reviews={reviews} />;
}
```

### Client Components (com TanStack Query)

Usar pra interatividade (filtros, ações de cancelamento, etc):

```tsx
'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

const { data: bookings } = useQuery({
  queryKey: ['bookings'],
  queryFn: () => api('/v1/bookings'),
});

const cancelMutation = useMutation({
  mutationFn: (reason: string) =>
    api(`/v1/bookings/${id}/cancel`, { method: 'POST', body: { reason } }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
});
```

### Padrão de cache (TanStack Query)

| Query | staleTime | cacheTime | Refetch on focus? |
|---|---|---|---|
| `cities` (autocomplete) | 1h | infinity | não |
| `companies` listing | 5min | 30min | não |
| `vehicles/:id` | 1min | 10min | não |
| `bookings` (lista) | 0 (sempre fresh) | 5min | sim |
| `bookings/:id` | 30s | 5min | sim |
| `tickets/:id` | infinity | infinity | não (imutável após emissão) |

## Tratamento de erros

Backend retorna **RFC 7807** (`application/problem+json`):

```json
{
  "type": "https://api.buscouviajou.com.br/errors/validation-failed",
  "title": "Validation failed",
  "status": 400,
  "detail": "...",
  "instance": "/v1/quotes",
  "error_id": "uuid-da-falha",
  "errors": [
    { "field": "origin", "message": "Required", "code": "invalid_type" }
  ]
}
```

Frontend usa `ApiError` (já implementado em `lib/api/client.ts`):

```ts
try {
  await api('/v1/quotes', { method: 'POST', body });
} catch (e) {
  if (e instanceof ApiError) {
    if (e.status === 400 && e.errors) {
      // Mostrar erros de validação inline nos campos
    } else if (e.status >= 500) {
      // Toast danger com e.errorId
    }
  }
}
```

### Mapa: status code → estratégia visual

| Status | Ação UX |
|---|---|
| 400 | Toast warning + corrigir inline se houver `errors[]` |
| 401 | Redirect `/login?next=...` (silencioso) |
| 403 | Toast danger genérico + botão voltar |
| 404 | Tela 404 customizada ou toast |
| 409 | Toast info contextual (ex: cotação já usada) |
| 422 | Mesmo que 400 |
| 5xx | Card destacado + `error_id` + retry |
| Network error | Banner "Sem conexão" topo + retry quando voltar |

## Auth / sessão

### Como o frontend pega o JWT

```ts
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

### Como mandar pro backend

`lib/api/client.ts` já injeta automaticamente:

```ts
if (auth) {
  const token = await getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
}
```

Default: `auth: true`. Pra endpoints públicos, passar `{ auth: false }`.

### Validação no backend

NestJS valida via JWKS endpoint público `https://[ref].supabase.co/auth/v1/.well-known/jwks.json` (algoritmo ES256). Em caso de token expirado, frontend recebe 401 e middleware deve fazer logout silencioso.

## Deeplinks de demo

URLs úteis pra testar cada tela rapidamente em dev:

| Tela | URL exemplo |
|---|---|
| Home | `http://localhost:3000/` |
| Busca SP→Campos do Jordão | `/busca?origem=Sao%20Paulo&destino=Campos%20do%20Jordao&data=2026-05-15&passageiros=10` |
| Veículo (qualquer) | `/veiculo/4430eebe-85a2-4f43-b927-c5d0bafc17cc` (id real do seed) |
| Login | `/login` |
| Minhas viagens | `/minhas-viagens` (auth) |
| Reserva | `/reserva/[id]` (auth) |

Credenciais demo (do seed):
- `cliente1@buscouviajou.demo` / `cliente2@...` / `cliente3@...`
- Senha pra dev: `demo12345` (mas vamos usar magic link na demo)
