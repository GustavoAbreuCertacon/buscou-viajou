# Guia de Deploy — Buscou Viajou

> Step-by-step pra colocar a demo no ar **100% free**.
>
> **Stack:** Frontend Vercel + Backend Render + DB Supabase (já hospedado).
> **Tempo estimado:** 30-45 minutos.
> **Custo:** $0/mês (com cold start de ~30s no backend após 15min inativo).

---

## Pré-requisitos

Você precisa criar contas (todas free):

- [ ] **GitHub** — pra hospedar o código (já tem provavelmente)
- [ ] **Vercel** — `https://vercel.com/signup` (login com GitHub)
- [ ] **Render** — `https://render.com/register` (login com GitHub)
- [ ] **Supabase** — já criou (`cscblvcqjwxmgzalowop.supabase.co`)
- [ ] (Opcional) **UptimeRobot** — `https://uptimerobot.com` pra evitar cold start

---

## Passo 1 — Subir código pro GitHub

### 1.1 Criar repositório

1. Vá pra https://github.com/new
2. Repository name: `buscou-viajou` (ou outro nome)
3. **Public** ou **Private** (tanto faz)
4. **NÃO** marque "Initialize with README"
5. Clique **Create repository**

### 1.2 Conectar repo local ao GitHub

No terminal da raiz do projeto:

```bash
cd D:/Github/Buscou-Viajou

# Inicializa git se ainda não tem
git init
git add .
git commit -m "Initial commit — demo Buscou Viajou"

# Conecta com seu repo GitHub (substitua SEU_USUARIO)
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/buscou-viajou.git
git push -u origin main
```

⚠️ **Importante:** o `.gitignore` já existe e exclui `.env` (com as keys).
Confirme que `.env` não está no commit:
```bash
git ls-files | grep '\.env$'
# Não deve retornar nada
```

---

## Passo 2 — Configurar Supabase pra produção

### 2.1 Adicionar URLs de redirect

1. Acesse https://supabase.com/dashboard/project/cscblvcqjwxmgzalowop
2. Menu lateral: **Authentication** → **URL Configuration**
3. **Site URL:** ainda não preencha, vamos fazer depois (precisa da URL Vercel)
4. **Redirect URLs:** vamos adicionar depois também

> Ver passo 5.3 abaixo, quando tiver a URL real do Vercel.

### 2.2 Pegar suas keys

1. Mesmo dashboard: **Settings** → **API Keys**
2. Anote (ou deixa essa aba aberta):
   - **Project URL:** `https://cscblvcqjwxmgzalowop.supabase.co`
   - **anon / public key:** `eyJhbGc...` (longa, ~200 chars)
   - **service_role key:** `eyJhbGc...` (longa, ~200 chars) — **secreta, nunca expor**

---

## Passo 3 — Deploy do Backend (Render)

### 3.1 Conectar Render ao GitHub

1. Login em https://dashboard.render.com
2. Botão **New** → **Web Service**
3. **Build and deploy from a Git repository** → **Next**
4. Conectar GitHub se for primeira vez (autorize o app Render)
5. Selecione o repo `buscou-viajou` → **Connect**

### 3.2 Configurar o serviço

Render detecta o `render.yaml` automaticamente. Mas se não detectar, configure manualmente:

| Campo | Valor |
|---|---|
| **Name** | `buscou-viajou-api` |
| **Region** | Oregon (ou Frankfurt — mais próximo de você) |
| **Branch** | `main` |
| **Root Directory** | `BuscouViajouApi` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node dist/main.js` |
| **Instance Type** | **Free** |

### 3.3 Variáveis de ambiente

Vá em **Environment** (sidebar do serviço criado) e adicione:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `SUPABASE_URL` | `https://cscblvcqjwxmgzalowop.supabase.co` |
| `SUPABASE_ANON_KEY` | (cole a anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | (cole a service_role key) |
| `CORS_ORIGIN` | **Deixe em branco por enquanto** — voltar aqui após Vercel |

### 3.4 Health check

Em **Settings** → **Health & Alerts**:
- **Health Check Path:** `/v1/health`

### 3.5 Deploy

1. Clique **Create Web Service** ou **Manual Deploy → Deploy latest commit**
2. Aguarde ~3-5 minutos pro primeiro build
3. Quando aparecer "Live", anote a URL: `https://buscou-viajou-api.onrender.com` (ou o nome que você escolheu)

### 3.6 Validação rápida

Abra no navegador:
```
https://buscou-viajou-api.onrender.com/v1/health
```

Deve retornar JSON:
```json
{"status":"ok","database":"reachable","amenities_count":10,"latency_ms":150,"timestamp":"..."}
```

Se retornar isso → backend OK. Salve a URL.

---

## Passo 4 — Deploy do Frontend (Vercel)

### 4.1 Importar projeto

1. Login em https://vercel.com/new
2. **Import Git Repository** → selecione `buscou-viajou`
3. **Framework Preset:** Next.js (auto-detect)
4. **Root Directory:** clique em **Edit** e digite `BuscouViajouFrontend`
5. **Build Command:** deixar default (`next build`)
6. **Output Directory:** deixar default

### 4.2 Variáveis de ambiente

Em **Environment Variables** (mesmo formulário):

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://cscblvcqjwxmgzalowop.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (cole a anon key) |
| `NEXT_PUBLIC_API_URL` | `https://buscou-viajou-api.onrender.com` (URL do Render) |
| `NEXT_PUBLIC_SITE_URL` | será preenchido após primeiro deploy |

### 4.3 Deploy

1. Clique **Deploy**
2. Aguarde ~2-3 minutos
3. Quando aparecer "Congratulations!", anote a URL: `https://buscou-viajou.vercel.app` (ou similar)

### 4.4 Atualizar `NEXT_PUBLIC_SITE_URL`

1. No dashboard Vercel → **Settings** → **Environment Variables**
2. Adicione (ou edite):
   - `NEXT_PUBLIC_SITE_URL` = `https://buscou-viajou.vercel.app` (sua URL real)
3. **Deployments** → último deploy → **Redeploy** (com cache)

---

## Passo 5 — Conectar tudo (CORS + Supabase Auth)

### 5.1 Atualizar CORS no Render

1. Volte ao Render → seu serviço → **Environment**
2. Edite `CORS_ORIGIN`:
   ```
   https://buscou-viajou.vercel.app
   ```
   (Se tiver domínio custom Vercel, adicione separado por vírgula)
3. **Save Changes** → Render reinicia o serviço (~30s)

### 5.2 Atualizar Supabase Auth

1. Dashboard Supabase → **Authentication** → **URL Configuration**
2. **Site URL:**
   ```
   https://buscou-viajou.vercel.app
   ```
3. **Redirect URLs** (adicionar):
   ```
   https://buscou-viajou.vercel.app/auth/callback
   https://buscou-viajou.vercel.app/**
   ```
4. **Save**

### 5.3 Testar end-to-end

1. Abra `https://buscou-viajou.vercel.app`
2. Preencha SearchForm: São Paulo → Campos do Jordão → 15 mai 2026 → 10 passageiros → **Buscar viagens**
3. Deve aparecer 25 veículos (vindo do Render → Supabase)
4. Click "Solicitar reserva" → redirect pra `/login`
5. Login com `cliente1@buscouviajou.demo` (magic link via email — checa spam)

⚠️ **Primeiro request após inatividade pode demorar ~30s** (cold start Render free).

---

## Passo 6 (Opcional) — Evitar cold start com UptimeRobot

Render free dorme após 15min sem request. Pra manter sempre warm:

1. Cadastre em https://uptimerobot.com (free)
2. **+ Add New Monitor**
3. **Monitor Type:** HTTP(s)
4. **Friendly Name:** `Buscou Viajou API`
5. **URL:** `https://buscou-viajou-api.onrender.com/v1/health`
6. **Monitoring Interval:** 5 minutes
7. **Create Monitor**

Pronto — UptimeRobot pinga a cada 5min, mantém o serviço sempre warm.

---

## Passo 7 — Atualizações futuras

A partir daqui, qualquer `git push origin main` dispara deploy automático em **ambos** Vercel e Render.

Pra rebuild manual:
- **Vercel:** Dashboard → Deployments → ⋯ → Redeploy
- **Render:** Dashboard → Manual Deploy → Deploy latest commit

---

## Troubleshooting

### Backend retorna CORS error no frontend

- Confirme `CORS_ORIGIN` no Render contém **exatamente** a URL do Vercel (com https, sem barra final)
- Se mudou a URL, restart manual no Render

### Supabase Auth redireciona pra localhost

- Faltou atualizar Site URL e Redirect URLs (Passo 5.2)

### Build do Render falha

- Confirme **Root Directory** = `BuscouViajouApi`
- Veja logs em **Logs** sidebar
- Costuma ser falta de variável de ambiente

### Magic link não chega

- Supabase free permite **4 emails/hora** — checar rate limit
- Checar spam
- Em produção real: configurar SMTP custom (SendGrid, Resend, etc.)

### Cold start de 30s incomoda

- Ative UptimeRobot (Passo 6)
- Ou pague Render Hobby ($7/mês)

### Imagens não carregam (next/image)

- Confirme `next.config.mjs` tem `cscblvcqjwxmgzalowop.supabase.co` em `remotePatterns`
- E `images.unsplash.com`, `placehold.co` (já configurado)

---

## Checklist final

- [ ] GitHub repo criado e código pushed
- [ ] Render: serviço criado, deploy bem-sucedido, `/v1/health` retorna 200
- [ ] Vercel: projeto importado, deploy bem-sucedido, landing carrega
- [ ] CORS configurado (Render aceita domínio Vercel)
- [ ] Supabase Auth: Site URL + Redirect URLs apontam pra Vercel
- [ ] Teste E2E: SearchForm → /busca retorna 25 veículos
- [ ] Login magic link funciona
- [ ] (Opcional) UptimeRobot configurado

---

## URLs finais (preencher conforme deploy)

| Serviço | URL |
|---|---|
| Frontend | `https://_____.vercel.app` |
| Backend | `https://_____.onrender.com` |
| Backend health check | `https://_____.onrender.com/v1/health` |
| Backend Swagger | `https://_____.onrender.com/docs` |
| Supabase Dashboard | https://supabase.com/dashboard/project/cscblvcqjwxmgzalowop |

---

**Última atualização:** 2026-04-30
