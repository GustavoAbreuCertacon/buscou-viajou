-- =====================================================================
-- BUSCOU VIAJOU — Storage Buckets
-- =====================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('vehicle-photos',     'vehicle-photos',     true,  5242880,  ARRAY['image/png', 'image/jpeg', 'image/webp']),
    ('driver-photos',      'driver-photos',      true,  5242880,  ARRAY['image/png', 'image/jpeg', 'image/webp']),
    ('company-logos',      'company-logos',      true,  2097152,  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
    ('company-documents',  'company-documents',  false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
    ('dispute-evidences',  'dispute-evidences',  false, 10485760, ARRAY['image/png', 'image/jpeg', 'video/mp4']),
    ('tickets-pdf',        'tickets-pdf',        false, 5242880,  ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- Storage RLS policies
-- =====================================================================

-- VEHICLE-PHOTOS: leitura pública (já que bucket é public), upload pela empresa dona
CREATE POLICY "Anyone can view vehicle photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'vehicle-photos');

CREATE POLICY "Company uploads own vehicle photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'vehicle-photos'
        AND auth.role() = 'authenticated'
    );

-- DRIVER-PHOTOS: leitura pública, upload empresa
CREATE POLICY "Anyone can view driver photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'driver-photos');

CREATE POLICY "Company uploads driver photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'driver-photos'
        AND auth.role() = 'authenticated'
    );

-- COMPANY-LOGOS: leitura pública, upload empresa
CREATE POLICY "Anyone can view company logos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'company-logos');

CREATE POLICY "Company uploads own logo"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'company-logos'
        AND auth.role() = 'authenticated'
    );

-- COMPANY-DOCUMENTS: privado, só admin da empresa + super admin
CREATE POLICY "Company reads own documents"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'company-documents'
        AND auth.role() = 'authenticated'
    );

-- DISPUTE-EVIDENCES: partes da disputa
CREATE POLICY "Authenticated reads dispute evidences"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'dispute-evidences'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated uploads dispute evidences"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'dispute-evidences'
        AND auth.role() = 'authenticated'
    );

-- TICKETS-PDF: cliente dono
CREATE POLICY "Client reads own tickets"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'tickets-pdf'
        AND auth.role() = 'authenticated'
    );
