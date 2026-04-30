# Buscou Viajou — API

API REST do marketplace de fretamento Buscou Viajou. Backend em NestJS + Supabase, com autenticação via JWT do Supabase Auth (validação por JWKS), pricing dinâmico de cotações com lock temporário, fluxo de reservas e emissão de bilhete digital com QR Code.

## Stack

Conforme `package.json`:

- Node + TypeScript (`typescript ^5.7.2`, target `ES2022`, `commonjs`)
- NestJS 10 (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `@nestjs/config`)
- `@nestjs/swagger` 8 — documentação OpenAPI em `/docs`
- `@supabase/supabase-js` 2 — cliente Postgres + Auth
- `jose` 5 — verificação de JWT do Supabase via JWKS remoto
- `zod` 3 — validação de env e de payloads de entrada
- `qrcode` 1 — geração do QR Code do bilhete (SVG + PNG base64)
- `class-validator` / `class-transformer` (presentes nas deps)
- Dev: `@nestjs/cli`, `ts-node`, `tsconfig-paths`, `@faker-js/faker`, `sharp`

## Como rodar local

Pré-requisitos: Node + npm e um projeto Supabase já configurado (URL, anon key e service role key).

```bash
# 1. Variáveis de ambiente
cp .env.example .env
# editar .env e preencher SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY

# 2. Dependências
npm install

# 3. Modo dev (watch)
npm run start:dev
```

Variáveis aceitas (validadas por `src/config/env.ts` via Zod):

| Variável                    | Default                  | Obrigatória |
|-----------------------------|--------------------------|-------------|
| `NODE_ENV`                  | `development`            | não         |
| `PORT`                      | `3001`                   | não         |
| `CORS_ORIGIN`               | `http://localhost:3000`  | não (lista separada por vírgula) |
| `SUPABASE_URL`              | —                        | sim (URL)   |
| `SUPABASE_ANON_KEY`         | —                        | sim         |
| `SUPABASE_SERVICE_ROLE_KEY` | —                        | sim         |

A API sobe em `http://localhost:${PORT}` com prefixo de versão URI `v1` (ex.: `GET /v1/health`). Swagger disponível em `/docs`.

## Endpoints disponíveis

Todos sob o prefixo de versão `v1`. Coluna "Auth": `pública` (decorator `@Public`), `opcional` (`@OptionalAuth`) ou `Bearer` (JWT do Supabase obrigatório — `AuthGuard` é registrado como `APP_GUARD` global).

| Método | Path                                            | Auth     | Descrição |
|--------|-------------------------------------------------|----------|-----------|
| GET    | `/v1/health`                                    | pública  | Health check; retorna status do banco e contagem de `amenities`. |
| GET    | `/v1/cities/search?q=`                          | pública  | Busca cidades brasileiras no catálogo local (`brazil-cities.ts`). |
| GET    | `/v1/companies`                                 | pública  | Lista empresas com `status = ACTIVE`, ordenadas por rating. |
| GET    | `/v1/companies/:id`                             | pública  | Perfil público da empresa com endereços. |
| GET    | `/v1/companies/:id/reviews?limit&rating`        | pública  | Avaliações `PUBLISHED` da empresa. |
| GET    | `/v1/companies/:id/vehicles`                    | pública  | Veículos `ACTIVE` da empresa. |
| GET    | `/v1/vehicles/:id`                              | pública  | Detalhe público do veículo (fotos, amenities, garagem). |
| GET    | `/v1/vehicles/:id/reviews`                      | pública  | Últimas 20 avaliações `PUBLISHED` do veículo. |
| POST   | `/v1/quotes`                                    | opcional | Busca veículos para a rota e calcula preços; insere `locked_quotes` com lock de 30 minutos. |
| GET    | `/v1/auth/me`                                   | Bearer   | Retorna o profile do usuário autenticado. |
| POST   | `/v1/bookings`                                  | Bearer   | Cria reserva em `PENDING_APPROVAL` a partir de um `lockedQuoteId`. |
| GET    | `/v1/bookings?status=`                          | Bearer   | Lista reservas do cliente logado. |
| GET    | `/v1/bookings/:id`                              | Bearer   | Detalhe da reserva (veículo, empresa, motorista, paradas, addons, ticket). |
| POST   | `/v1/bookings/:id/cancel`                       | Bearer   | Cancela a reserva e calcula reembolso (100 %/50 %/0 % conforme janela). |
| POST   | `/v1/bookings/:id/_demo/approve-and-pay`        | Bearer   | Atalho de demo: simula aprovação da empresa + pagamento, vai para `CONFIRMED` e gera transação mock. |
| GET    | `/v1/bookings/:bookingId/ticket`                | Bearer   | Retorna bilhete digital com `qr_svg` e `qr_png_base64`; cria `tickets` se ainda não existir. |

Observações:
- Validação de payloads em `POST /v1/quotes`, `POST /v1/bookings` e `POST /v1/bookings/:id/cancel` é feita pelo `ZodValidationPipe` (erros viram `400` com `errors[]`).
- Erros são serializados em `application/problem+json` pelo `AllExceptionsFilter` (`type`, `title`, `status`, `detail`, `instance`, `error_id`).
- O JWT do Supabase é verificado em `JwksService` contra `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`, com `issuer = ${SUPABASE_URL}/auth/v1`.

## Estrutura de pastas

```
src/
  main.ts                       Bootstrap Nest, CORS, versionamento URI v1, Swagger em /docs
  app.module.ts                 Composição dos módulos
  config/
    env.ts                      Schema Zod das variáveis de ambiente (loadEnv)
  auth/
    auth.module.ts              Registra AuthGuard como APP_GUARD global
    auth.controller.ts          GET /v1/auth/me
    auth.guard.ts               Guard global; lê Bearer token, respeita @Public/@OptionalAuth
    jwks.service.ts             Verificação de JWT via JWKS remoto do Supabase Auth (jose)
    decorators.ts               @Public, @OptionalAuth, @CurrentUser, @CurrentJwt
  database/
    supabase.service.ts         admin (service_role, bypassa RLS) e forUser(jwt) (respeita RLS)
    supabase.module.ts          (não documentado — verificar)
    database.types.ts           Tipos gerados do Supabase
    seed.ts, seed-data.ts       (não documentados em detalhe — vide `npm run db:seed`)
  common/
    filters/all-exceptions.filter.ts   Resposta application/problem+json
    pipes/zod-validation.pipe.ts       Pipe genérico para schemas Zod
    geo/brazil-cities.ts               Catálogo de cidades + resolveCity / searchCities / haversineKm
  modules/
    health/        GET /v1/health
    cities/        GET /v1/cities/search
    companies/     GET /v1/companies, /:id, /:id/reviews, /:id/vehicles
    vehicles/      GET /v1/vehicles/:id, /:id/reviews
    quotes/        POST /v1/quotes — calcula multiplicador via pricing_events e grava locked_quotes
    bookings/      POST/GET/cancel/_demo de reservas, com máquina de estados (VALID_TRANSITIONS)
    tickets/       GET /v1/bookings/:bookingId/ticket — gera QR (HMAC-SHA256 do payload)
scripts/
  smoke-test.sh                 Smoke test ponta a ponta da API
  process-logos.mjs             (não documentado — verificar)
```

## Smoke test

`scripts/smoke-test.sh` exercita os endpoints públicos e o fluxo autenticado completo (login no Supabase Auth como `cliente1@buscouviajou.demo`, criação de reserva, demo approve-and-pay, ticket com QR e cancelamento). Requer a API rodando em `http://localhost:3001` e `python` no PATH.

```bash
# Em outro terminal, com a API já rodando (npm run start:dev):
bash scripts/smoke-test.sh
```

A última resposta de cada chamada fica em `scripts/_last-response.json`. Saída resume `PASS` / `FAIL` por endpoint.

## Seed do banco

```bash
npm run db:seed
```

Executa `ts-node -r tsconfig-paths/register src/database/seed.ts`. (Conteúdo do seed: não documentado neste README — verificar `src/database/seed.ts` e `seed-data.ts`.)

## Geração de tipos do Supabase

```bash
npm run gen:types
```

Roda no diretório pai (`cd ..`):

```
supabase gen types typescript --linked --schema public > BuscouViajouApi/src/database/database.types.ts
```

Requer Supabase CLI instalado e o projeto linkado.

## Build e produção

```bash
npm run build       # nest build → dist/
npm run start:prod  # node dist/main.js
```

`nest-cli.json` está com `deleteOutDir: true`, logo cada build limpa `dist/` antes.

Outros scripts (do `package.json`):

- `npm run start` — `nest start` (sem watch)
- `npm run start:debug` — `nest start --debug --watch`
- `npm run lint` — ESLint sobre `{src,apps,libs,test}/**/*.ts` com `--fix`
- `npm run format` — Prettier em `src/**/*.ts`
