-- =====================================================================
-- BUSCOU VIAJOU — Row Level Security (RLS) Policies
-- =====================================================================
-- Princípio:
--   - Service role (backend) ignora RLS e tem acesso total
--   - Anon/Authenticated têm acesso restrito conforme as policies abaixo
--   - Cliente vê só os dados próprios
--   - Admin de empresa vê dados da própria company_id
--   - Super admin vê tudo
-- =====================================================================

-- Habilita RLS em todas as tabelas relevantes
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE garages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_evidences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE locked_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_snapshots ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- Helper functions
-- =====================================================================

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_user_company_id()
RETURNS UUID AS $$
    SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- =====================================================================
-- COMPANIES — listagem pública (apenas ACTIVE) + acesso total para admin
-- =====================================================================

CREATE POLICY "Public can view active companies"
    ON companies FOR SELECT
    USING (status = 'ACTIVE');

CREATE POLICY "Company admin can update own company"
    ON companies FOR UPDATE
    USING (id = current_user_company_id() AND current_user_role() = 'COMPANY_ADMIN');

CREATE POLICY "Super admin full access on companies"
    ON companies FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- COMPANY_ADDRESSES — público pra empresas ativas
-- =====================================================================

CREATE POLICY "Public can view addresses of active companies"
    ON company_addresses FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM companies c
        WHERE c.id = company_addresses.company_id AND c.status = 'ACTIVE'
    ));

CREATE POLICY "Company admin manages own addresses"
    ON company_addresses FOR ALL
    USING (company_id = current_user_company_id());

CREATE POLICY "Super admin full access on company_addresses"
    ON company_addresses FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- PROFILES — usuário vê o próprio profile, admin de empresa vê os da empresa
-- =====================================================================

CREATE POLICY "User can view own profile"
    ON profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "User can update own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY "Company admin can view company profiles"
    ON profiles FOR SELECT
    USING (
        company_id = current_user_company_id()
        AND current_user_role() IN ('COMPANY_ADMIN', 'COMPANY_OPERATOR', 'COMPANY_FINANCIAL')
    );

CREATE POLICY "Super admin full access on profiles"
    ON profiles FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- GARAGES — públicas pra empresas ativas (cliente vê localização da garagem nos detalhes)
-- =====================================================================

CREATE POLICY "Public can view active garages of active companies"
    ON garages FOR SELECT
    USING (
        is_active = true
        AND EXISTS (
            SELECT 1 FROM companies c
            WHERE c.id = garages.company_id AND c.status = 'ACTIVE'
        )
    );

CREATE POLICY "Company manages own garages"
    ON garages FOR ALL
    USING (company_id = current_user_company_id());

CREATE POLICY "Super admin full access on garages"
    ON garages FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- VEHICLES — listagem pública (ACTIVE de empresas ACTIVE)
-- =====================================================================

CREATE POLICY "Public can view active vehicles of active companies"
    ON vehicles FOR SELECT
    USING (
        status = 'ACTIVE'
        AND EXISTS (
            SELECT 1 FROM companies c
            WHERE c.id = vehicles.company_id AND c.status = 'ACTIVE'
        )
    );

CREATE POLICY "Company manages own vehicles"
    ON vehicles FOR ALL
    USING (company_id = current_user_company_id());

CREATE POLICY "Super admin full access on vehicles"
    ON vehicles FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- VEHICLE_PHOTOS — público pra fotos de veículos ativos
-- =====================================================================

CREATE POLICY "Public can view photos of active vehicles"
    ON vehicle_photos FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM vehicles v
        WHERE v.id = vehicle_photos.vehicle_id AND v.status = 'ACTIVE'
    ));

CREATE POLICY "Company manages own vehicle photos"
    ON vehicle_photos FOR ALL
    USING (EXISTS (
        SELECT 1 FROM vehicles v
        WHERE v.id = vehicle_photos.vehicle_id
        AND v.company_id = current_user_company_id()
    ));

CREATE POLICY "Super admin full access on vehicle_photos"
    ON vehicle_photos FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- AMENITIES e VEHICLE_AMENITIES — leitura pública (lookup)
-- =====================================================================

CREATE POLICY "Public can view active amenities"
    ON amenities FOR SELECT
    USING (is_active = true);

CREATE POLICY "Super admin manages amenities"
    ON amenities FOR ALL
    USING (is_super_admin());

CREATE POLICY "Public can view vehicle_amenities"
    ON vehicle_amenities FOR SELECT
    USING (true);

CREATE POLICY "Company manages own vehicle_amenities"
    ON vehicle_amenities FOR ALL
    USING (EXISTS (
        SELECT 1 FROM vehicles v
        WHERE v.id = vehicle_amenities.vehicle_id
        AND v.company_id = current_user_company_id()
    ));

CREATE POLICY "Super admin full access on vehicle_amenities"
    ON vehicle_amenities FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- DRIVERS — privado da empresa
-- =====================================================================

CREATE POLICY "Company manages own drivers"
    ON drivers FOR ALL
    USING (company_id = current_user_company_id());

CREATE POLICY "Super admin full access on drivers"
    ON drivers FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- ADDONS — listagem pública (cliente vê adicionais ao escolher veículo)
-- =====================================================================

CREATE POLICY "Public can view active addons"
    ON addons FOR SELECT
    USING (is_active = true AND EXISTS (
        SELECT 1 FROM companies c
        WHERE c.id = addons.company_id AND c.status = 'ACTIVE'
    ));

CREATE POLICY "Company manages own addons"
    ON addons FOR ALL
    USING (company_id = current_user_company_id());

CREATE POLICY "Super admin full access on addons"
    ON addons FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- DOCUMENTS — privado por entidade
-- =====================================================================

CREATE POLICY "Company sees own documents"
    ON documents FOR ALL
    USING (
        (entity_type = 'COMPANY' AND entity_id = current_user_company_id())
        OR (entity_type = 'VEHICLE' AND EXISTS (
            SELECT 1 FROM vehicles v WHERE v.id = documents.entity_id
            AND v.company_id = current_user_company_id()))
        OR (entity_type = 'DRIVER' AND EXISTS (
            SELECT 1 FROM drivers d WHERE d.id = documents.entity_id
            AND d.company_id = current_user_company_id()))
    );

CREATE POLICY "Super admin full access on documents"
    ON documents FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- BOOKINGS — cliente vê os seus, empresa vê as suas
-- =====================================================================

CREATE POLICY "Client sees own bookings"
    ON bookings FOR SELECT
    USING (client_id = auth.uid());

CREATE POLICY "Client creates own bookings"
    ON bookings FOR INSERT
    WITH CHECK (client_id = auth.uid());

CREATE POLICY "Client updates own bookings"
    ON bookings FOR UPDATE
    USING (client_id = auth.uid());

CREATE POLICY "Company sees own bookings"
    ON bookings FOR SELECT
    USING (company_id = current_user_company_id());

CREATE POLICY "Company updates own bookings"
    ON bookings FOR UPDATE
    USING (company_id = current_user_company_id());

CREATE POLICY "Super admin full access on bookings"
    ON bookings FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- BOOKING_STOPS e BOOKING_ADDONS — herdam a permissão da reserva
-- =====================================================================

CREATE POLICY "Booking stops follow booking access"
    ON booking_stops FOR ALL
    USING (EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.id = booking_stops.booking_id
        AND (b.client_id = auth.uid() OR b.company_id = current_user_company_id() OR is_super_admin())
    ));

CREATE POLICY "Booking addons follow booking access"
    ON booking_addons FOR ALL
    USING (EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.id = booking_addons.booking_id
        AND (b.client_id = auth.uid() OR b.company_id = current_user_company_id() OR is_super_admin())
    ));

-- =====================================================================
-- TRANSACTIONS — visíveis pra dono da reserva (cliente ou empresa)
-- =====================================================================

CREATE POLICY "Transactions follow booking access"
    ON transactions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.id = transactions.booking_id
        AND (b.client_id = auth.uid() OR b.company_id = current_user_company_id())
    ));

CREATE POLICY "Super admin full access on transactions"
    ON transactions FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- REVIEWS — leitura pública (PUBLISHED), escrita só dono
-- =====================================================================

CREATE POLICY "Public can view published reviews"
    ON reviews FOR SELECT
    USING (status = 'PUBLISHED');

CREATE POLICY "Client creates review for own booking"
    ON reviews FOR INSERT
    WITH CHECK (
        client_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.id = reviews.booking_id
            AND b.client_id = auth.uid()
            AND b.status = 'COMPLETED'
        )
    );

CREATE POLICY "Super admin moderates reviews"
    ON reviews FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- REVIEW_RESPONSES
-- =====================================================================

CREATE POLICY "Public can view review responses"
    ON review_responses FOR SELECT
    USING (true);

CREATE POLICY "Company admin responds to own company reviews"
    ON review_responses FOR INSERT
    WITH CHECK (
        responder_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM reviews r
            WHERE r.id = review_responses.review_id
            AND r.company_id = current_user_company_id()
        )
    );

CREATE POLICY "Super admin full access on review_responses"
    ON review_responses FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- DISPUTES — cliente vê as suas, empresa vê as dela
-- =====================================================================

CREATE POLICY "Client sees own disputes"
    ON disputes FOR SELECT
    USING (client_id = auth.uid());

CREATE POLICY "Client creates own disputes"
    ON disputes FOR INSERT
    WITH CHECK (client_id = auth.uid());

CREATE POLICY "Company sees own disputes"
    ON disputes FOR SELECT
    USING (company_id = current_user_company_id());

CREATE POLICY "Company responds to own disputes"
    ON disputes FOR UPDATE
    USING (company_id = current_user_company_id());

CREATE POLICY "Super admin full access on disputes"
    ON disputes FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- DISPUTE_EVIDENCES — partes da disputa + super admin
-- =====================================================================

CREATE POLICY "Dispute evidences follow dispute access"
    ON dispute_evidences FOR ALL
    USING (EXISTS (
        SELECT 1 FROM disputes d
        WHERE d.id = dispute_evidences.dispute_id
        AND (d.client_id = auth.uid() OR d.company_id = current_user_company_id() OR is_super_admin())
    ));

-- =====================================================================
-- NOTIFICATIONS — só do próprio usuário
-- =====================================================================

CREATE POLICY "User sees own notifications"
    ON notifications FOR ALL
    USING (user_id = auth.uid());

-- =====================================================================
-- AUDIT_LOG — só super admin lê
-- =====================================================================

CREATE POLICY "Super admin reads audit_log"
    ON audit_log FOR SELECT
    USING (is_super_admin());

-- =====================================================================
-- SYSTEM_SETTINGS — leitura pública, escrita só super admin
-- =====================================================================

CREATE POLICY "Public reads system_settings"
    ON system_settings FOR SELECT
    USING (true);

CREATE POLICY "Super admin manages system_settings"
    ON system_settings FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- PARTNER_APPLICATIONS — público pode INSERT (auto-cadastro), super admin lê
-- =====================================================================

CREATE POLICY "Public can submit partner application"
    ON partner_applications FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Super admin manages partner applications"
    ON partner_applications FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- TICKETS — cliente da reserva + super admin
-- =====================================================================

CREATE POLICY "Ticket follows booking access"
    ON tickets FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.id = tickets.booking_id
        AND (b.client_id = auth.uid() OR b.company_id = current_user_company_id())
    ));

CREATE POLICY "Super admin full access on tickets"
    ON tickets FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- PRICING_EVENTS — leitura pública
-- =====================================================================

CREATE POLICY "Public reads active pricing events"
    ON pricing_events FOR SELECT
    USING (is_active = true);

CREATE POLICY "Super admin manages pricing events"
    ON pricing_events FOR ALL
    USING (is_super_admin());

-- =====================================================================
-- LOCKED_QUOTES — só dono ou anônimo (cotação sem login)
-- =====================================================================

CREATE POLICY "User sees own locked quotes"
    ON locked_quotes FOR SELECT
    USING (client_id IS NULL OR client_id = auth.uid());

CREATE POLICY "User creates own locked quotes"
    ON locked_quotes FOR INSERT
    WITH CHECK (client_id IS NULL OR client_id = auth.uid());

-- =====================================================================
-- DEMAND_SNAPSHOTS — só super admin/backend
-- =====================================================================

CREATE POLICY "Super admin reads demand snapshots"
    ON demand_snapshots FOR SELECT
    USING (is_super_admin());
