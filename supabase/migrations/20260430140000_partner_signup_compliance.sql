-- =====================================================================
-- BUSCOU VIAJOU — Aceite do Código de Conduta
-- =====================================================================
-- 1. Adiciona campos de aceite ao partner_applications (cadastro público).
-- 2. Cria company_compliance_acceptances pra histórico de aceites de
--    empresas já ativas (re-aceite quando código mudar de versão).
-- =====================================================================

-- =====================================================================
-- 1. Campos de aceite no cadastro público
-- =====================================================================

ALTER TABLE partner_applications
    ADD COLUMN IF NOT EXISTS code_of_conduct_version TEXT,
    ADD COLUMN IF NOT EXISTS code_of_conduct_accepted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS acceptance_ip TEXT,
    ADD COLUMN IF NOT EXISTS acceptance_user_agent TEXT;

COMMENT ON COLUMN partner_applications.code_of_conduct_version IS
    'Versão do código aceita no submit (ex.: v1.0.0)';
COMMENT ON COLUMN partner_applications.acceptance_ip IS
    'IP do solicitante no momento do aceite (extraído de X-Forwarded-For)';

-- =====================================================================
-- 2. Tabela de aceites contínuos (empresas ativas)
-- =====================================================================

CREATE TABLE IF NOT EXISTS company_compliance_acceptances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    accepted_by_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    document_version TEXT NOT NULL,
    document_url TEXT,
    document_hash TEXT,
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_address TEXT,
    user_agent TEXT,
    UNIQUE (company_id, document_version)
);

CREATE INDEX IF NOT EXISTS idx_compliance_company_date
    ON company_compliance_acceptances(company_id, accepted_at DESC);

CREATE INDEX IF NOT EXISTS idx_compliance_user
    ON company_compliance_acceptances(accepted_by_user_id);

-- =====================================================================
-- 3. Row Level Security
-- =====================================================================

ALTER TABLE company_compliance_acceptances ENABLE ROW LEVEL SECURITY;

-- SELECT: usuário vê aceites da própria empresa (qualquer role da empresa) ou super admin vê tudo
DROP POLICY IF EXISTS company_compliance_select ON company_compliance_acceptances;
CREATE POLICY company_compliance_select ON company_compliance_acceptances
    FOR SELECT USING (
        company_id = public.current_user_company_id()
        OR public.is_super_admin()
    );

-- INSERT: backend (service_role) só. Frontend NUNCA escreve aqui direto.
-- Não criamos policy de INSERT/UPDATE/DELETE — service_role bypassa RLS,
-- e nenhum role autenticado tem permissão (default deny).