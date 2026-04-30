-- =====================================================================
-- BUSCOU VIAJOU — Seed Static Data
-- Dados que não mudam: amenities, system_settings, pricing_events
-- =====================================================================

-- Amenities (lookup)
INSERT INTO amenities (name, icon) VALUES
    ('Wi-Fi',           'wifi'),
    ('Ar-condicionado', 'air-vent'),
    ('Banheiro',        'toilet'),
    ('TV',              'tv'),
    ('Tomada USB',      'usb'),
    ('Geladeira',       'refrigerator'),
    ('Poltrona-leito',  'armchair'),
    ('Cadeirante',      'accessibility'),
    ('Cooler',          'snowflake'),
    ('Som ambiente',    'music')
ON CONFLICT (name) DO NOTHING;

-- System settings (RN-* configuráveis)
INSERT INTO system_settings (key, value, description) VALUES
    ('approval_sla_hours',                '24',  'Prazo em horas para empresa aprovar/recusar solicitação'),
    ('min_booking_advance_hours',         '24',  'Antecedência mínima em horas para solicitar viagem'),
    ('dispute_window_hours',              '72',  'Prazo em horas após conclusão para abrir disputa'),
    ('review_window_days',                '7',   'Prazo em dias após conclusão para avaliar viagem'),
    ('completion_confirmation_hours',     '24',  'Prazo para cliente confirmar conclusão da viagem'),
    ('company_dispute_response_hours',    '48',  'Prazo para empresa contestar disputa'),
    ('default_payout_delay_days',         '15',  'Prazo padrão D+N para repasse após conclusão'),
    ('cancel_full_refund_hours',          '72',  'Cancelamento com reembolso total se > Xh de antecedência'),
    ('cancel_partial_refund_hours',       '24',  'Cancelamento com 50% multa se entre X e Yh'),
    ('security_deposit_percentage',       '10',  'Percentual do valor da viagem como depósito caução'),
    ('dynamic_pricing_max_multiplier',    '2.0', 'Multiplicador máximo do pricing dinâmico'),
    ('dynamic_pricing_min_multiplier',    '0.8', 'Multiplicador mínimo do pricing dinâmico'),
    ('dynamic_pricing_recalc_minutes',    '15',  'Frequência de recálculo do multiplicador'),
    ('quote_lock_minutes',                '30',  'Tempo em minutos que o preço cotado fica travado'),
    ('partner_review_sla_hours',          '48',  'SLA para análise de solicitações de parceria')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;

-- Eventos de pricing dinâmico (feriados e datas com alta demanda)
INSERT INTO pricing_events (name, start_date, end_date, affected_regions, minimum_multiplier_level, is_active) VALUES
    ('Carnaval 2026',          '2026-02-14', '2026-02-18', ARRAY['SP', 'RJ', 'BA', 'PE', 'MG'], 'VERY_HIGH', true),
    ('Semana Santa 2026',      '2026-04-02', '2026-04-05', ARRAY['SP', 'RJ', 'MG'],             'HIGH',      true),
    ('Tiradentes 2026',        '2026-04-21', '2026-04-21', ARRAY['SP', 'RJ', 'MG'],             'HIGH',      true),
    ('Réveillon 2026/2027',    '2026-12-29', '2027-01-02', ARRAY['SP', 'RJ', 'BA', 'SC'],       'PEAK',      true),
    ('Festas Juninas 2026',    '2026-06-12', '2026-06-29', ARRAY['PE', 'BA', 'PB', 'CE'],       'HIGH',      true)
ON CONFLICT DO NOTHING;
