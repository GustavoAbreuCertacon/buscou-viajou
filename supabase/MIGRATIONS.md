# Buscou Viajou — Migrations Supabase

Documento gerado a partir dos arquivos SQL em `supabase/migrations/` e do `supabase/config.toml`.

## 1. Resumo

| Item | Total |
|------|-------|
| Migrations | 5 |
| Tabelas criadas (schema `public`) | 27 |
| Enums | 9 |
| Buckets de Storage | 6 |
| Funções (helpers + triggers) | 5 |
| Triggers `set_updated_at` | 9 |
| Trigger em `auth.users` | 1 (`on_auth_user_created`) |

Tabelas (27): `companies`, `company_addresses`, `profiles`, `garages`, `vehicles`, `vehicle_photos`, `amenities`, `vehicle_amenities`, `drivers`, `addons`, `documents`, `bookings`, `booking_stops`, `booking_addons`, `transactions`, `reviews`, `review_responses`, `disputes`, `dispute_evidences`, `notifications`, `audit_log`, `system_settings`, `partner_applications`, `tickets`, `demand_snapshots`, `pricing_events`, `locked_quotes`.

---

## 2. Migrations (ordem cronológica)

### 2.1 `20260429120000_initial_schema.sql`

**Propósito:** schema inicial completo do domínio.

Cria:
- Extensão `pgcrypto`.
- 9 enums: `user_role`, `vehicle_type`, `addon_pricing_type`, `document_entity_type`, `booking_status`, `dispute_status`, `dispute_category`, `dispute_resolution`, `partner_application_status`.
- Função `public.set_updated_at()` (trigger genérico).
- 27 tabelas com PKs UUID, FKs, CHECKs e DEFAULTs.
- Índices para colunas de busca (`status`, `company_id`, `client_id`, `departure_date`, etc.).
- 9 triggers `BEFORE UPDATE` chamando `set_updated_at()` (em: `companies`, `profiles`, `garages`, `vehicles`, `drivers`, `bookings`, `reviews`, `review_responses`, `disputes`, `partner_applications`).
- Função `public.handle_new_user()` (sem `search_path` explícito) e trigger `on_auth_user_created` em `auth.users`.

### 2.2 `20260429120001_rls_policies.sql`

**Propósito:** ativar Row Level Security e definir policies.

Cria:
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` em 27 tabelas.
- 3 funções helpers: `current_user_role()`, `current_user_company_id()`, `is_super_admin()` (todas `SECURITY DEFINER STABLE`).
- Policies `SELECT/INSERT/UPDATE/ALL` por tabela (detalhe na seção 4).

### 2.3 `20260429120002_storage_buckets.sql`

**Propósito:** registrar buckets de Storage e suas policies.

Cria:
- 6 buckets em `storage.buckets` (com `ON CONFLICT DO NOTHING`).
- Policies em `storage.objects` para SELECT/INSERT por bucket (detalhe na seção 5).

### 2.4 `20260429120003_seed_static_data.sql`

**Propósito:** popular dados estáticos.

Insere:
- 10 amenities (`Wi-Fi`, `Ar-condicionado`, `Banheiro`, `TV`, `Tomada USB`, `Geladeira`, `Poltrona-leito`, `Cadeirante`, `Cooler`, `Som ambiente`).
- 15 chaves em `system_settings` (SLAs, prazos, multiplicadores, percentuais).
- 5 eventos de pricing dinâmico (`Carnaval 2026`, `Semana Santa 2026`, `Tiradentes 2026`, `Réveillon 2026/2027`, `Festas Juninas 2026`).

### 2.5 `20260429120004_fix_handle_new_user.sql`

**Propósito:** corrigir `handle_new_user()` para resolver `public.user_role` em contexto `SECURITY DEFINER`.

Altera:
- `CREATE OR REPLACE FUNCTION public.handle_new_user()` agora com `SET search_path = public, pg_temp`.
- Bloco `BEGIN/EXCEPTION` para tratar `invalid_text_representation` ao parsear `role`, fazendo fallback para `'CLIENT'`.

---

## 3. Diagrama ER simplificado

```
auth.users
   │ 1:1 (trigger handle_new_user)
   ▼
profiles ──────────────────► companies ──┬─► company_addresses
   │                            │        ├─► garages ──────► vehicles ──┬─► vehicle_photos
   │                            │        │                              ├─► vehicle_amenities ──► amenities
   │                            │        ├─► drivers                    │
   │                            │        ├─► addons                     │
   │                            │        └─► documents (entity_type)    │
   │                            │                                       │
   │ client_id                  │ company_id                            │ vehicle_id
   ▼                            ▼                                       ▼
   └──────────────────────► bookings ◄─────────────────────────────────┘
                              │   │   │   │
                              │   │   │   └─► driver_id ─► drivers
                              │   │   │
                              │   │   ├─► booking_stops
                              │   │   ├─► booking_addons ──► addons
                              │   │   ├─► transactions
                              │   │   ├─► tickets (1:1)
                              │   │   └─► disputes ──► dispute_evidences
                              │   │
                              │   └─► reviews (1:1) ──► review_responses (1:1)
                              ▼
                          (notifications, audit_log referenciam profiles)

partner_applications ──► companies (após aprovação)
locked_quotes ──► profiles, vehicles
demand_snapshots, pricing_events, system_settings (sem FK direta)
```

Relacionamentos principais (FKs declaradas):

| Origem | Coluna | Destino | ON DELETE |
|--------|--------|---------|-----------|
| `company_addresses` | `company_id` | `companies` | CASCADE |
| `profiles` | `id` | `auth.users` | CASCADE |
| `profiles` | `company_id` | `companies` | SET NULL |
| `garages` | `company_id` | `companies` | CASCADE |
| `vehicles` | `company_id` | `companies` | CASCADE |
| `vehicles` | `garage_id` | `garages` | RESTRICT |
| `vehicle_photos` | `vehicle_id` | `vehicles` | CASCADE |
| `vehicle_amenities` | `vehicle_id` / `amenity_id` | `vehicles` / `amenities` | CASCADE |
| `drivers` | `company_id` | `companies` | CASCADE |
| `addons` | `company_id` | `companies` | CASCADE |
| `documents` | `reviewed_by` | `profiles` | — |
| `bookings` | `client_id` / `vehicle_id` / `company_id` / `driver_id` / `cancelled_by` | `profiles` / `vehicles` / `companies` / `drivers` / `profiles` | — |
| `booking_stops` | `booking_id` | `bookings` | CASCADE |
| `booking_addons` | `booking_id` / `addon_id` | `bookings` / `addons` | CASCADE / — |
| `transactions` | `booking_id` | `bookings` | — |
| `reviews` | `booking_id` (UNIQUE) / `client_id` / `company_id` / `vehicle_id` | `bookings` / `profiles` / `companies` / `vehicles` | — |
| `review_responses` | `review_id` (UNIQUE) / `responder_id` | `reviews` / `profiles` | CASCADE / — |
| `disputes` | `booking_id` / `client_id` / `company_id` / `resolved_by` | `bookings` / `profiles` / `companies` / `profiles` | — |
| `dispute_evidences` | `dispute_id` / `uploaded_by` | `disputes` / `profiles` | CASCADE / — |
| `notifications` | `user_id` | `profiles` | CASCADE |
| `audit_log` | `user_id` | `profiles` | — |
| `system_settings` | `updated_by` | `profiles` | — |
| `partner_applications` | `company_id` / `reviewed_by` | `companies` / `profiles` | — |
| `tickets` | `booking_id` (UNIQUE) / `validated_by` | `bookings` / `profiles` | — |
| `pricing_events` | `created_by` | `profiles` | — |
| `locked_quotes` | `client_id` / `vehicle_id` | `profiles` / `vehicles` | — |

---

## 4. RLS policies por tabela

Convenções: "Cliente" = `auth.uid() = client_id`/`id`. "Empresa" = `current_user_company_id()`. "Super admin" = `is_super_admin()`.

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| `companies` | Público (status `ACTIVE`); Super admin (ALL) | Super admin | Empresa dona com role `COMPANY_ADMIN`; Super admin | Super admin |
| `company_addresses` | Público (de empresa `ACTIVE`); Empresa dona (ALL); Super admin (ALL) | Empresa dona; Super admin | Empresa dona; Super admin | Empresa dona; Super admin |
| `profiles` | Próprio (`id = auth.uid()`); Empresa (roles `COMPANY_*` da mesma `company_id`); Super admin (ALL) | Super admin | Próprio; Super admin | Super admin |
| `garages` | Público (ativas de empresa `ACTIVE`); Empresa dona (ALL); Super admin (ALL) | Empresa dona; Super admin | Empresa dona; Super admin | Empresa dona; Super admin |
| `vehicles` | Público (`ACTIVE` de empresa `ACTIVE`); Empresa dona (ALL); Super admin (ALL) | Empresa dona; Super admin | Empresa dona; Super admin | Empresa dona; Super admin |
| `vehicle_photos` | Público (de veículo `ACTIVE`); Empresa dona (ALL); Super admin (ALL) | Empresa dona; Super admin | Empresa dona; Super admin | Empresa dona; Super admin |
| `amenities` | Público (`is_active = true`); Super admin (ALL) | Super admin | Super admin | Super admin |
| `vehicle_amenities` | Público (todos); Empresa dona (ALL); Super admin (ALL) | Empresa dona; Super admin | Empresa dona; Super admin | Empresa dona; Super admin |
| `drivers` | Empresa dona (ALL); Super admin (ALL) | Empresa dona; Super admin | Empresa dona; Super admin | Empresa dona; Super admin |
| `addons` | Público (`is_active` + empresa `ACTIVE`); Empresa dona (ALL); Super admin (ALL) | Empresa dona; Super admin | Empresa dona; Super admin | Empresa dona; Super admin |
| `documents` | Empresa dona conforme `entity_type` (ALL); Super admin (ALL) | Empresa dona; Super admin | Empresa dona; Super admin | Empresa dona; Super admin |
| `bookings` | Cliente dono; Empresa dona; Super admin (ALL) | Cliente dono (`client_id = auth.uid()`); Super admin | Cliente dono; Empresa dona; Super admin | Super admin |
| `booking_stops` | Cliente / Empresa / Super admin (via reserva) | idem | idem | idem |
| `booking_addons` | Cliente / Empresa / Super admin (via reserva) | idem | idem | idem |
| `transactions` | Cliente / Empresa (via reserva); Super admin (ALL) | Super admin | Super admin | Super admin |
| `reviews` | Público (`status = 'PUBLISHED'`); Super admin (ALL) | Cliente dono de reserva `COMPLETED`; Super admin | Super admin | Super admin |
| `review_responses` | Público (todos); Super admin (ALL) | Empresa dona da review (`responder_id = auth.uid()`); Super admin | Super admin | Super admin |
| `disputes` | Cliente; Empresa; Super admin (ALL) | Cliente dono; Super admin | Empresa dona; Super admin | Super admin |
| `dispute_evidences` | Partes da disputa + Super admin (ALL) | idem | idem | idem |
| `notifications` | Próprio (`user_id = auth.uid()`) (ALL) | Próprio | Próprio | Próprio |
| `audit_log` | Super admin | — | — | — |
| `system_settings` | Público (todos); Super admin (ALL) | Super admin | Super admin | Super admin |
| `partner_applications` | Super admin (ALL) | Público (qualquer um); Super admin | Super admin | Super admin |
| `tickets` | Cliente / Empresa via reserva; Super admin (ALL) | Super admin | Super admin | Super admin |
| `pricing_events` | Público (`is_active = true`); Super admin (ALL) | Super admin | Super admin | Super admin |
| `locked_quotes` | Próprio ou anônimo (`client_id IS NULL`) | Próprio ou anônimo | — | — |
| `demand_snapshots` | Super admin | — | — | — |

Observação: policies declaradas `FOR ALL` cobrem SELECT/INSERT/UPDATE/DELETE simultaneamente conforme a condição `USING`/`WITH CHECK`.

---

## 5. Storage buckets

| ID / Name | Público | Limite (bytes) | MIME types permitidos |
|-----------|---------|----------------|------------------------|
| `vehicle-photos` | true | 5.242.880 (5 MB) | `image/png`, `image/jpeg`, `image/webp` |
| `driver-photos` | true | 5.242.880 (5 MB) | `image/png`, `image/jpeg`, `image/webp` |
| `company-logos` | true | 2.097.152 (2 MB) | `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml` |
| `company-documents` | false | 10.485.760 (10 MB) | `application/pdf`, `image/png`, `image/jpeg` |
| `dispute-evidences` | false | 10.485.760 (10 MB) | `image/png`, `image/jpeg`, `video/mp4` |
| `tickets-pdf` | false | 5.242.880 (5 MB) | `application/pdf` |

Policies em `storage.objects`:

| Bucket | SELECT | INSERT |
|--------|--------|--------|
| `vehicle-photos` | Público (qualquer) | `auth.role() = 'authenticated'` |
| `driver-photos` | Público (qualquer) | `auth.role() = 'authenticated'` |
| `company-logos` | Público (qualquer) | `auth.role() = 'authenticated'` |
| `company-documents` | Apenas autenticados | — |
| `dispute-evidences` | Apenas autenticados | Apenas autenticados |
| `tickets-pdf` | Apenas autenticados | — |

---

## 6. Enums

| Enum | Valores |
|------|---------|
| `user_role` | `CLIENT`, `SUPER_ADMIN`, `COMPANY_ADMIN`, `COMPANY_OPERATOR`, `COMPANY_FINANCIAL` |
| `vehicle_type` | `BUS`, `MINIBUS`, `VAN` |
| `addon_pricing_type` | `FIXED`, `PER_PERSON`, `PACKAGE` |
| `document_entity_type` | `COMPANY`, `VEHICLE`, `DRIVER` |
| `booking_status` | `PENDING_APPROVAL`, `PENDING_PAYMENT`, `CONFIRMED`, `IN_PROGRESS`, `PENDING_COMPLETION`, `COMPLETED`, `CANCELLED_BY_CLIENT`, `CANCELLED_BY_COMPANY`, `REJECTED`, `EXPIRED`, `NO_SHOW_CLIENT`, `NO_SHOW_COMPANY` |
| `dispute_status` | `OPEN`, `IN_REVIEW`, `ESCALATED`, `RESOLVED` |
| `dispute_category` | `VEHICLE_DIFFERENT`, `DELAY`, `SAFETY`, `DRIVER`, `AMENITIES`, `NO_SHOW_COMPANY`, `OTHER` |
| `dispute_resolution` | `FULL_REFUND`, `PARTIAL_REFUND`, `DISMISSED`, `PENALTY` |
| `partner_application_status` | `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `PENDING_DOCUMENTS` |

---

## 7. Triggers e funções

### 7.1 Funções

| Função | Linguagem | Atributos | Retorno | Descrição |
|--------|-----------|-----------|---------|-----------|
| `public.set_updated_at()` | plpgsql | TRIGGER | `TRIGGER` | Atribui `NEW.updated_at = now()` antes do UPDATE. |
| `public.handle_new_user()` | plpgsql | `SECURITY DEFINER`, `SET search_path = public, pg_temp` (após fix) | `TRIGGER` | Cria registro em `public.profiles` ao inserir em `auth.users`. Faz fallback de role para `CLIENT` em caso de erro de parse. |
| `public.current_user_role()` | sql | `STABLE SECURITY DEFINER` | `user_role` | Retorna `role` do `profiles` correspondente a `auth.uid()`. |
| `public.current_user_company_id()` | sql | `STABLE SECURITY DEFINER` | `UUID` | Retorna `company_id` do profile do usuário corrente. |
| `public.is_super_admin()` | sql | `STABLE SECURITY DEFINER` | `BOOLEAN` | `true` se o usuário corrente tem `role = 'SUPER_ADMIN'`. |

### 7.2 Triggers

| Trigger | Tabela | Quando | Função |
|---------|--------|--------|--------|
| `companies_set_updated_at` | `companies` | BEFORE UPDATE | `set_updated_at` |
| `profiles_set_updated_at` | `profiles` | BEFORE UPDATE | `set_updated_at` |
| `garages_set_updated_at` | `garages` | BEFORE UPDATE | `set_updated_at` |
| `vehicles_set_updated_at` | `vehicles` | BEFORE UPDATE | `set_updated_at` |
| `drivers_set_updated_at` | `drivers` | BEFORE UPDATE | `set_updated_at` |
| `bookings_set_updated_at` | `bookings` | BEFORE UPDATE | `set_updated_at` |
| `reviews_set_updated_at` | `reviews` | BEFORE UPDATE | `set_updated_at` |
| `review_responses_set_updated_at` | `review_responses` | BEFORE UPDATE | `set_updated_at` |
| `disputes_set_updated_at` | `disputes` | BEFORE UPDATE | `set_updated_at` |
| `partner_applications_set_updated_at` | `partner_applications` | BEFORE UPDATE | `set_updated_at` |
| `on_auth_user_created` | `auth.users` | AFTER INSERT | `handle_new_user` |
