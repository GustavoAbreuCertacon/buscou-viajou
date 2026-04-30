-- =====================================================================
-- BUSCOU VIAJOU — Initial Schema
-- Derivado do PRD seção 8 (modelo de dados)
-- 27 tabelas + enums + triggers updated_at
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- ENUMS
-- =====================================================================

CREATE TYPE user_role AS ENUM (
    'CLIENT', 'SUPER_ADMIN', 'COMPANY_ADMIN',
    'COMPANY_OPERATOR', 'COMPANY_FINANCIAL'
);

CREATE TYPE vehicle_type AS ENUM ('BUS', 'MINIBUS', 'VAN');

CREATE TYPE addon_pricing_type AS ENUM ('FIXED', 'PER_PERSON', 'PACKAGE');

CREATE TYPE document_entity_type AS ENUM ('COMPANY', 'VEHICLE', 'DRIVER');

CREATE TYPE booking_status AS ENUM (
    'PENDING_APPROVAL', 'PENDING_PAYMENT', 'CONFIRMED',
    'IN_PROGRESS', 'PENDING_COMPLETION', 'COMPLETED',
    'CANCELLED_BY_CLIENT', 'CANCELLED_BY_COMPANY',
    'REJECTED', 'EXPIRED', 'NO_SHOW_CLIENT', 'NO_SHOW_COMPANY'
);

CREATE TYPE dispute_status AS ENUM ('OPEN', 'IN_REVIEW', 'ESCALATED', 'RESOLVED');

CREATE TYPE dispute_category AS ENUM (
    'VEHICLE_DIFFERENT', 'DELAY', 'SAFETY', 'DRIVER',
    'AMENITIES', 'NO_SHOW_COMPANY', 'OTHER'
);

CREATE TYPE dispute_resolution AS ENUM (
    'FULL_REFUND', 'PARTIAL_REFUND', 'DISMISSED', 'PENALTY'
);

CREATE TYPE partner_application_status AS ENUM (
    'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'PENDING_DOCUMENTS'
);

-- =====================================================================
-- TRIGGER FUNCTION: updated_at
-- =====================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- COMPANIES
-- =====================================================================

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    logo_url VARCHAR(500),
    description TEXT,
    operating_regions TEXT[] DEFAULT ARRAY[]::TEXT[],
    monthly_fee NUMERIC(10, 2) DEFAULT 0,
    transaction_fee NUMERIC(10, 2) DEFAULT 0,
    average_rating NUMERIC(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    cancellation_count INTEGER DEFAULT 0,
    max_installments INTEGER DEFAULT 12,
    interest_free_installments INTEGER DEFAULT 1,
    stripe_account_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER companies_set_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_companies_status ON companies(status);

-- =====================================================================
-- COMPANY_ADDRESSES
-- =====================================================================

CREATE TABLE company_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(100),
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_company_addresses_company ON company_addresses(company_id);

-- =====================================================================
-- PROFILES (estende auth.users)
-- O PRD chama de "users" mas o Supabase já tem auth.users
-- =====================================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    date_of_birth DATE,
    role user_role NOT NULL DEFAULT 'CLIENT',
    kyc_status VARCHAR(50) NOT NULL DEFAULT 'NOT_VERIFIED',
    is_active BOOLEAN DEFAULT true,
    avatar_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_profiles_company ON profiles(company_id) WHERE company_id IS NOT NULL;
CREATE INDEX idx_profiles_role ON profiles(role);

-- =====================================================================
-- GARAGES
-- =====================================================================

CREATE TABLE garages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER garages_set_updated_at BEFORE UPDATE ON garages
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_garages_company ON garages(company_id);

-- =====================================================================
-- VEHICLES
-- =====================================================================

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE RESTRICT,
    plate VARCHAR(10) NOT NULL UNIQUE,
    model VARCHAR(255) NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    price_per_km NUMERIC(10, 2) NOT NULL CHECK (price_per_km > 0),
    min_departure_cost NUMERIC(10, 2) NOT NULL CHECK (min_departure_cost > 0),
    dynamic_pricing_enabled BOOLEAN DEFAULT true,
    average_rating NUMERIC(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER vehicles_set_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_vehicles_company ON vehicles(company_id);
CREATE INDEX idx_vehicles_garage ON vehicles(garage_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);

-- =====================================================================
-- VEHICLE_PHOTOS
-- =====================================================================

CREATE TABLE vehicle_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    file_url VARCHAR(500) NOT NULL,
    file_key VARCHAR(255),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vehicle_photos_vehicle ON vehicle_photos(vehicle_id, display_order);

-- =====================================================================
-- AMENITIES (lookup)
-- =====================================================================

CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true
);

-- =====================================================================
-- VEHICLE_AMENITIES (M:N)
-- =====================================================================

CREATE TABLE vehicle_amenities (
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (vehicle_id, amenity_id)
);

-- =====================================================================
-- DRIVERS
-- =====================================================================

CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    cnh_number VARCHAR(20) NOT NULL UNIQUE,
    cnh_category VARCHAR(5) NOT NULL,
    cnh_expiry_date DATE NOT NULL,
    phone VARCHAR(20),
    photo_url VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER drivers_set_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_drivers_company ON drivers(company_id);
CREATE INDEX idx_drivers_status ON drivers(status);

-- =====================================================================
-- ADDONS
-- =====================================================================

CREATE TABLE addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pricing_type addon_pricing_type NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_addons_company ON addons(company_id, is_active);

-- =====================================================================
-- DOCUMENTS (genérica para empresa, veículo e motorista)
-- =====================================================================

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type document_entity_type NOT NULL,
    entity_id UUID NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_key VARCHAR(255),
    expiry_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'VALID',
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_documents_expiry ON documents(expiry_date) WHERE expiry_date IS NOT NULL;

-- =====================================================================
-- BOOKINGS
-- =====================================================================

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(20) UNIQUE,
    client_id UUID NOT NULL REFERENCES profiles(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    driver_id UUID REFERENCES drivers(id),
    status booking_status NOT NULL DEFAULT 'PENDING_APPROVAL',
    is_round_trip BOOLEAN DEFAULT false,
    passengers INTEGER NOT NULL CHECK (passengers > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    dynamic_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
    platform_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    company_payout NUMERIC(10, 2) NOT NULL DEFAULT 0,
    security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_distance_km NUMERIC(10, 2) NOT NULL,
    estimated_duration_hours NUMERIC(5, 2),
    origin_address TEXT NOT NULL,
    origin_latitude NUMERIC(10, 7),
    origin_longitude NUMERIC(10, 7),
    destination_address TEXT NOT NULL,
    destination_latitude NUMERIC(10, 7),
    destination_longitude NUMERIC(10, 7),
    departure_date TIMESTAMPTZ NOT NULL,
    return_date TIMESTAMPTZ,
    actual_start_at TIMESTAMPTZ,
    actual_end_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES profiles(id),
    cancelled_at TIMESTAMPTZ,
    rejection_reason TEXT,
    payout_scheduled_date DATE,
    payout_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER bookings_set_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_bookings_client ON bookings(client_id, departure_date DESC);
CREATE INDEX idx_bookings_company ON bookings(company_id, status, departure_date DESC);
CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_id, departure_date);
CREATE INDEX idx_bookings_status ON bookings(status, departure_date);

-- =====================================================================
-- BOOKING_STOPS
-- =====================================================================

CREATE TABLE booking_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    stop_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_booking_stops_booking ON booking_stops(booking_id, stop_order);

-- =====================================================================
-- BOOKING_ADDONS
-- =====================================================================

CREATE TABLE booking_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    addon_id UUID NOT NULL REFERENCES addons(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_booking_addons_booking ON booking_addons(booking_id);

-- =====================================================================
-- TRANSACTIONS
-- =====================================================================

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    stripe_transfer_id VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    refund_percentage NUMERIC(5, 2),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_booking ON transactions(booking_id);

-- =====================================================================
-- REVIEWS
-- =====================================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id),
    client_id UUID NOT NULL REFERENCES profiles(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    overall_rating SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    punctuality_rating SMALLINT NOT NULL CHECK (punctuality_rating BETWEEN 1 AND 5),
    vehicle_rating SMALLINT NOT NULL CHECK (vehicle_rating BETWEEN 1 AND 5),
    driver_rating SMALLINT NOT NULL CHECK (driver_rating BETWEEN 1 AND 5),
    value_rating SMALLINT NOT NULL CHECK (value_rating BETWEEN 1 AND 5),
    comment TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER reviews_set_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_reviews_company ON reviews(company_id, status, created_at DESC);
CREATE INDEX idx_reviews_vehicle ON reviews(vehicle_id, status);
CREATE INDEX idx_reviews_client ON reviews(client_id);

-- =====================================================================
-- REVIEW_RESPONSES
-- =====================================================================

CREATE TABLE review_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL UNIQUE REFERENCES reviews(id) ON DELETE CASCADE,
    responder_id UUID NOT NULL REFERENCES profiles(id),
    response TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER review_responses_set_updated_at BEFORE UPDATE ON review_responses
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================================
-- DISPUTES
-- =====================================================================

CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    client_id UUID NOT NULL REFERENCES profiles(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    category dispute_category NOT NULL,
    description TEXT NOT NULL,
    status dispute_status NOT NULL DEFAULT 'OPEN',
    company_response TEXT,
    company_responded_at TIMESTAMPTZ,
    resolution dispute_resolution,
    resolution_justification TEXT,
    refund_percentage NUMERIC(5, 2),
    penalty_amount NUMERIC(10, 2),
    resolved_by UUID REFERENCES profiles(id),
    resolved_at TIMESTAMPTZ,
    company_response_deadline TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER disputes_set_updated_at BEFORE UPDATE ON disputes
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_disputes_status ON disputes(status, created_at DESC);
CREATE INDEX idx_disputes_company ON disputes(company_id);
CREATE INDEX idx_disputes_client ON disputes(client_id);

-- =====================================================================
-- DISPUTE_EVIDENCES
-- =====================================================================

CREATE TABLE dispute_evidences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    file_url VARCHAR(500) NOT NULL,
    file_key VARCHAR(255),
    file_type VARCHAR(10) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_dispute_evidences_dispute ON dispute_evidences(dispute_id);

-- =====================================================================
-- NOTIFICATIONS
-- =====================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read)
    WHERE is_read = false;

-- =====================================================================
-- AUDIT_LOG
-- =====================================================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);

-- =====================================================================
-- SYSTEM_SETTINGS
-- =====================================================================

CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- PARTNER_APPLICATIONS
-- =====================================================================

CREATE TABLE partner_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    address_street VARCHAR(255),
    address_number VARCHAR(20),
    address_complement VARCHAR(100),
    address_city VARCHAR(100),
    address_state VARCHAR(2),
    address_zip VARCHAR(10),
    company_phone VARCHAR(20),
    representative_name VARCHAR(255) NOT NULL,
    representative_cpf VARCHAR(14) NOT NULL,
    representative_email VARCHAR(255) NOT NULL,
    representative_phone VARCHAR(20) NOT NULL,
    representative_role VARCHAR(100),
    estimated_vehicle_count VARCHAR(20),
    vehicle_types TEXT[],
    operating_regions TEXT[],
    description TEXT,
    social_contract_file_url VARCHAR(500),
    permit_file_url VARCHAR(500),
    antt_file_url VARCHAR(500),
    status partner_application_status NOT NULL DEFAULT 'PENDING_APPROVAL',
    rejection_reason TEXT,
    additional_docs_request TEXT,
    approved_monthly_fee NUMERIC(10, 2),
    approved_transaction_fee NUMERIC(10, 2),
    company_id UUID REFERENCES companies(id),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER partner_applications_set_updated_at BEFORE UPDATE ON partner_applications
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE UNIQUE INDEX idx_partner_applications_cnpj
    ON partner_applications(cnpj)
    WHERE status IN ('PENDING_APPROVAL', 'PENDING_DOCUMENTS', 'APPROVED');

-- =====================================================================
-- TICKETS (Bilhete digital QR)
-- =====================================================================

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id),
    ticket_code VARCHAR(20) NOT NULL UNIQUE,
    qr_payload TEXT NOT NULL,
    qr_hash VARCHAR(64) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'VALID',
    used_at TIMESTAMPTZ,
    validated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- DEMAND_SNAPSHOTS (pricing dinâmico)
-- =====================================================================

CREATE TABLE demand_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_hash VARCHAR(64) NOT NULL,
    travel_date DATE NOT NULL,
    search_count INTEGER NOT NULL DEFAULT 0,
    available_vehicles INTEGER NOT NULL DEFAULT 0,
    occupancy_rate NUMERIC(5, 2),
    calculated_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
    snapshot_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_demand_snapshots_route_date
    ON demand_snapshots(route_hash, travel_date, snapshot_at DESC);

-- =====================================================================
-- PRICING_EVENTS
-- =====================================================================

CREATE TABLE pricing_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    affected_regions TEXT[],
    minimum_multiplier_level VARCHAR(20) NOT NULL DEFAULT 'HIGH',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pricing_events_dates ON pricing_events(start_date, end_date) WHERE is_active = true;

-- =====================================================================
-- LOCKED_QUOTES
-- =====================================================================

CREATE TABLE locked_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES profiles(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    base_price NUMERIC(10, 2) NOT NULL,
    multiplier NUMERIC(3, 2) NOT NULL,
    final_price NUMERIC(10, 2) NOT NULL,
    route_origin TEXT NOT NULL,
    route_destination TEXT NOT NULL,
    travel_date TIMESTAMPTZ NOT NULL,
    locked_until TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_locked_quotes_client ON locked_quotes(client_id, locked_until DESC);

-- =====================================================================
-- TRIGGER: criar profile automaticamente ao criar auth.user
-- =====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, email, first_name, last_name, role, kyc_status
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuário'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'CLIENT'),
        'NOT_VERIFIED'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
