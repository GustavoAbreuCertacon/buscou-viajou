# Sitemap — Buscou Viajou (Demo)

> Mapa de todas as rotas do produto. Ordenado por perfil de acesso e fase
> de entrega. Demo (Fase 1) cobre só o **fluxo do cliente**; demais perfis
> ficam mockados ou bloqueados com mensagem "em construção".

## Convenções de URL

- **Idioma:** português, sem acentos, kebab-case (SEO-friendly).
- **IDs em URL:** UUID v4. Ex: `/reserva/71a0e34d-c243-415b-9a21-391356e5c04f`.
- **Slugs:** quando aplicável, gerados a partir do nome canônico.
  Ex: `/empresa/transtur-sp` (não usado na demo, planejado).
- **Query params:** `?origem=`, `?destino=`, `?data=`, `?passageiros=`,
  `?ordenar=`, `?tipo=`, `?preco_max=`, `?nota_min=`.

## Perfis de acesso (do PRD §3)

| Perfil | Como autentica | Acessa |
|---|---|---|
| **Anônimo** | — | Páginas públicas, busca, detalhes, login |
| **Cliente** | Magic link via Supabase Auth | + Minhas viagens, reservar, bilhete |
| **Admin Empresa** | Email + senha (Fase 2) | + Painel da empresa |
| **Operador Empresa** | Email + senha (Fase 2) | + Operação |
| **Financeiro Empresa** | Email + senha (Fase 2) | + Relatórios financeiros |
| **Super Admin** | Email + senha (Fase 2) | Tudo |

## Mapa completo

```
/                           Landing/Home
├── /busca                  Resultados (Trivago-like)
├── /veiculo/[id]           Detalhes do veículo
├── /empresa/[slug]         Perfil público da empresa     ⏳ Fase 2
│
├── /seja-parceiro          Auto-cadastro de empresa      ⏳ Fase 2
│   ├── /seja-parceiro/sucesso
│   └── /seja-parceiro/[token]/complementar
│
├── /login                  Login (magic link)
├── /auth
│   ├── /auth/callback      Callback Supabase OTP
│   └── /auth/erro          Falha na autenticação
│
├── /minhas-viagens         Hub do cliente (auth)
│   └── /reserva/[id]       Detalhe + bilhete digital (auth)
│
├── /conta                  Perfil/dados (auth)            ⏳ Fase 2
│
├── /painel                 Dashboard empresa (auth)       ⏳ Fase 2
│   ├── /painel/reservas
│   ├── /painel/frota
│   ├── /painel/motoristas
│   └── /painel/avaliacoes
│
├── /admin                  Super Admin (auth)             ⏳ Fase 2
│   ├── /admin/empresas
│   ├── /admin/disputas
│   ├── /admin/transacoes
│   └── /admin/configuracoes
│
├── /termos                 Termos de uso                  ⏳ Fase 2 (placeholder)
├── /privacidade            Política de privacidade        ⏳ Fase 2 (placeholder)
└── /cookies                Política de cookies            ⏳ Fase 2 (placeholder)

Special:
├── /[404]                  not-found.tsx
├── /[erro]                 error.tsx (qualquer rota)
├── /loading                loading.tsx (qualquer rota)
├── /robots.txt             gerado por Next.js
└── /sitemap.xml            gerado por Next.js
```

## Escopo da Demo (Fase 1)

Estas são as rotas que vão estar **funcionais e estilizadas** na entrega:

| Rota | Acesso | Tela do PRD | Origem dos dados |
|---|---|---|---|
| `/` | público | §6.1 Busca de Viagem | estático + form |
| `/busca` | público | §6.10 Resultados de Busca | `POST /v1/quotes` |
| `/veiculo/[id]` | público | §6.11 Detalhes do Veículo | `GET /v1/vehicles/:id` + `:id/reviews` |
| `/login` | público | (não no PRD, necessária pra demo) | `supabase.auth.signInWithOtp` |
| `/auth/callback` | público | (técnica) | `supabase.auth.exchangeCodeForSession` |
| `/auth/erro` | público | (estado de erro) | — |
| `/minhas-viagens` | cliente | §6.12 Minhas Viagens | `GET /v1/bookings` |
| `/reserva/[id]` | cliente | §6.8 Bilhete Digital + UC-001 | `GET /v1/bookings/:id` + `:id/ticket` |
| `/[404]`, `/[erro]` | qualquer | (estados) | — |

Total: **9 rotas funcionais** + 3 estados especiais.

## Indexação SEO

| Rota | `robots` | Indexável? | Por quê |
|---|---|---|---|
| `/` | index, follow | ✅ | Landing principal — palavra-chave "fretamento" |
| `/busca` | noindex, follow | ❌ | Resultados dinâmicos — não indexar query |
| `/veiculo/[id]` | index, follow | ✅ | Schema.org Product + AggregateRating |
| `/empresa/[slug]` (Fase 2) | index, follow | ✅ | Schema.org LocalBusiness |
| `/seja-parceiro` (Fase 2) | index, follow | ✅ | Funil B2B |
| `/login`, `/auth/*` | noindex, nofollow | ❌ | Privacidade |
| `/minhas-viagens`, `/reserva/*` | noindex, nofollow | ❌ | Auth-only |
| `/painel/*`, `/admin/*` | noindex, nofollow | ❌ | Internas |

`robots.txt` (gerado em `app/robots.ts`):

```
User-agent: *
Allow: /
Disallow: /minhas-viagens
Disallow: /reserva/
Disallow: /conta
Disallow: /painel/
Disallow: /admin/
Disallow: /auth/
Disallow: /login
Sitemap: https://buscouviajou.com.br/sitemap.xml
```

`sitemap.xml` (gerado em `app/sitemap.ts`):

```
/                                    priority 1.0    changefreq monthly
/seja-parceiro                       priority 0.8    changefreq monthly
/empresa/[slug]                      priority 0.7    changefreq weekly  (1 entry por empresa ativa)
/veiculo/[id]                        priority 0.6    changefreq weekly  (1 entry por veículo ativo)
```

## Estratégia de rendering (Next.js App Router)

| Rota | Tipo | Razão |
|---|---|---|
| `/` | **Static** (no `revalidate`) | Conteúdo estático, hero |
| `/busca` | **Dynamic** (`force-dynamic`) | Query params + chamada POST |
| `/veiculo/[id]` | **ISR** com `revalidate: 300` | SEO + cache de 5min, fresco o suficiente |
| `/empresa/[slug]` | **ISR** com `revalidate: 600` | (Fase 2) |
| `/login`, `/auth/*` | **Dynamic** | Cookies de sessão |
| `/minhas-viagens`, `/reserva/[id]` | **Dynamic** | Auth-required, dados do user |

## Middleware de proteção

`src/middleware.ts` intercepta rotas autenticadas:

```
PROTECTED = ['/minhas-viagens', '/reserva', '/conta', '/painel', '/admin']
PUBLIC_ONLY = ['/login']

if (rota PROTECTED && !session) → redirect /login?next=<rota_atual>
if (rota PUBLIC_ONLY && session) → redirect /minhas-viagens
```

## Hierarquia visual da Navbar

Itens no header conforme estado de sessão:

**Anônimo:**
- [Logo BV] | (vazio centro) | "Para empresas" (link sutil) · "Entrar" (botão accent)

**Cliente logado:**
- [Logo BV] | (vazio centro) | "Minhas Viagens" · [Avatar+Menu]
  - Menu: "Minha conta" / "Sair"

**Mobile (qualquer):**
- [Logo BV] | [☰ Menu hamburguer]
  - Sheet de baixo: nav links + CTA principal

## Footer (todas as páginas públicas)

```
┌────────────────────────────────────────────────────────┐
│  [Logo V2 white-on-navy]                               │
│                                                        │
│  Buscou         Empresa          Suporte               │
│  → Como funciona  → Sobre nós    → Central de ajuda    │
│  → Para empresas  → Blog         → Contato             │
│  → Termos         → Privacidade  → Cookies             │
│                                                        │
│  Manual da Marca · Buscou Viajou       (assinatura)    │
│                                            italic, /60 │
└────────────────────────────────────────────────────────┘
```

Bg: `--bv-color-navy`. Texto: white com opacidade variando. Links footer: hover green. Bottom-line italic, white/60.

## Decisões pendentes (Fase 2)

- [ ] Schema.org LocalBusiness usa `/empresa/[slug]` ou `/empresa/[id]`? Slug é mais SEO-friendly mas exige unique constraint.
- [ ] Página de listagem pública de empresas (`/empresas`)? Não está no PRD, mas pode aumentar páginas indexáveis.
- [ ] `/conta` virá com tabs ou rotas filhas (`/conta/dados`, `/conta/notificacoes`, `/conta/pagamento`)?
