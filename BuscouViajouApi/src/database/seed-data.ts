/**
 * Seed estático com dados realistas brasileiros pra demo.
 * Empresas, veículos, motoristas, garagens, fotos.
 */

export const SEED_COMPANIES = [
  {
    name: 'TransTur SP',
    legal_name: 'TransTur Transportes Turísticos Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'contato@transtur.com.br',
    phone: '+551133334444',
    description:
      'Mais de 25 anos no fretamento turístico em São Paulo. Frota renovada e motoristas treinados.',
    operating_regions: ['SP', 'RJ', 'MG'],
    monthly_fee: 199.9,
    transaction_fee: 49.9,
    average_rating: 4.6,
    total_reviews: 152,
    logo_url: 'https://placehold.co/200x80/0B2A43/FFFFFF/png?text=TransTur+SP',
  },
  {
    name: 'Capital Tour',
    legal_name: 'Capital Tour Fretamentos S.A.',
    cnpj: '23.456.789/0001-12',
    email: 'reservas@capitaltour.com.br',
    phone: '+551144445555',
    description: 'Fretamento executivo e turístico. Frota com Wi-Fi e ar-condicionado.',
    operating_regions: ['SP'],
    monthly_fee: 149.9,
    transaction_fee: 39.9,
    average_rating: 4.4,
    total_reviews: 89,
    logo_url: 'https://placehold.co/200x80/2B9366/FFFFFF/png?text=Capital+Tour',
  },
  {
    name: 'Litoral Express',
    legal_name: 'Litoral Express Transporte de Passageiros Ltda',
    cnpj: '34.567.890/0001-34',
    email: 'oi@litoralexpress.com.br',
    phone: '+551155556666',
    description: 'Especialistas em rotas para o litoral norte e sul de SP.',
    operating_regions: ['SP', 'RJ'],
    monthly_fee: 199.9,
    transaction_fee: 49.9,
    average_rating: 4.7,
    total_reviews: 201,
    logo_url: 'https://placehold.co/200x80/0B2A43/FFFFFF/png?text=Litoral+Express',
  },
  {
    name: 'Mineiro Tur',
    legal_name: 'Mineiro Turismo e Fretamento Ltda',
    cnpj: '45.678.901/0001-56',
    email: 'fala@mineirotur.com.br',
    phone: '+553133337777',
    description: 'Roteiros turísticos por Minas Gerais e capitais vizinhas.',
    operating_regions: ['MG', 'SP', 'RJ', 'DF'],
    monthly_fee: 149.9,
    transaction_fee: 39.9,
    average_rating: 4.5,
    total_reviews: 178,
    logo_url: 'https://placehold.co/200x80/2B9366/FFFFFF/png?text=Mineiro+Tur',
  },
  {
    name: 'ViaSul Fretamento',
    legal_name: 'ViaSul Transporte e Turismo Ltda',
    cnpj: '56.789.012/0001-78',
    email: 'contato@viasul.com.br',
    phone: '+554833338888',
    description: 'Especialista em viagens pra Sul do Brasil. Frota premium.',
    operating_regions: ['SC', 'RS', 'PR', 'SP'],
    monthly_fee: 249.9,
    transaction_fee: 59.9,
    average_rating: 4.8,
    total_reviews: 312,
    logo_url: 'https://placehold.co/200x80/0B2A43/FFFFFF/png?text=ViaSul',
  },
  {
    name: 'Norte Brasil Fretamento',
    legal_name: 'Norte Brasil Transportes Especiais Ltda',
    cnpj: '67.890.123/0001-90',
    email: 'reservas@nortebrasil.com.br',
    phone: '+558533339999',
    description: 'Operação no Nordeste, especializada em rotas litorâneas.',
    operating_regions: ['CE', 'RN', 'PB', 'PE', 'BA'],
    monthly_fee: 149.9,
    transaction_fee: 39.9,
    average_rating: 4.3,
    total_reviews: 67,
    logo_url: 'https://placehold.co/200x80/2B9366/FFFFFF/png?text=Norte+Brasil',
  },
  {
    name: 'Pernambuco Tour',
    legal_name: 'Pernambuco Tour Fretamento Ltda',
    cnpj: '78.901.234/0001-12',
    email: 'pe@pernambucotour.com.br',
    phone: '+558133331111',
    description: 'Recife, Olinda, Porto de Galinhas. Vinte anos de experiência.',
    operating_regions: ['PE', 'PB', 'AL', 'BA'],
    monthly_fee: 99.9,
    transaction_fee: 29.9,
    average_rating: 4.6,
    total_reviews: 124,
    logo_url: 'https://placehold.co/200x80/0B2A43/FFFFFF/png?text=PE+Tour',
  },
  {
    name: 'Rota Carioca',
    legal_name: 'Rota Carioca Fretamento e Turismo Ltda',
    cnpj: '89.012.345/0001-34',
    email: 'rota@rotacarioca.com.br',
    phone: '+552122223333',
    description: 'No Rio de Janeiro desde 2008. Especialistas em Costa Verde e Região dos Lagos.',
    operating_regions: ['RJ', 'SP', 'ES', 'MG'],
    monthly_fee: 199.9,
    transaction_fee: 49.9,
    average_rating: 4.5,
    total_reviews: 198,
    logo_url: 'https://placehold.co/200x80/2B9366/FFFFFF/png?text=Rota+Carioca',
  },
];

export const SEED_GARAGES = [
  // Cada empresa tem uma garagem na cidade-sede
  { company_idx: 0, name: 'Sede - Tatuapé',         street: 'R. Tuiuti',            number: '1500', neighborhood: 'Tatuapé',         city: 'São Paulo',     state: 'SP', zip_code: '03307-001', latitude: -23.5435, lng: -46.5752 },
  { company_idx: 1, name: 'Garagem Vila Mariana',    street: 'R. Domingos de Morais', number: '2100', neighborhood: 'Vila Mariana',    city: 'São Paulo',     state: 'SP', zip_code: '04036-002', latitude: -23.5855, lng: -46.6324 },
  { company_idx: 2, name: 'Sede Litoral',            street: 'Av. Pedro Lessa',      number: '901',  neighborhood: 'Centro',          city: 'Santos',        state: 'SP', zip_code: '11075-005', latitude: -23.9618, lng: -46.3340 },
  { company_idx: 3, name: 'Sede BH',                 street: 'Av. Cristiano Machado',number: '4400', neighborhood: 'União',           city: 'Belo Horizonte',state: 'MG', zip_code: '31170-001', latitude: -19.8512, lng: -43.9234 },
  { company_idx: 4, name: 'Sede Floripa',            street: 'Av. Beira-Mar Norte',  number: '7000', neighborhood: 'Centro',          city: 'Florianópolis', state: 'SC', zip_code: '88015-700', latitude: -27.5912, lng: -48.5482 },
  { company_idx: 5, name: 'Sede Fortaleza',          street: 'Av. Beira Mar',        number: '4500', neighborhood: 'Meireles',        city: 'Fortaleza',     state: 'CE', zip_code: '60165-121', latitude: -3.7236,  lng: -38.4948 },
  { company_idx: 6, name: 'Sede Recife',             street: 'Av. Boa Viagem',       number: '5000', neighborhood: 'Boa Viagem',      city: 'Recife',        state: 'PE', zip_code: '51011-000', latitude: -8.1242,  lng: -34.9038 },
  { company_idx: 7, name: 'Sede Botafogo',           street: 'R. Voluntários da Pátria', number: '2200', neighborhood: 'Botafogo',     city: 'Rio de Janeiro', state: 'RJ', zip_code: '22270-008', latitude: -22.9542, lng: -43.1854 },
];

export const SEED_DRIVERS = [
  // 15 motoristas distribuídos
  { company_idx: 0, first_name: 'Carlos',     last_name: 'Almeida',    cpf: '111.222.333-44', cnh_number: 'CNH001234567', cnh_category: 'D', cnh_expiry_date: '2027-08-15', phone: '+5511990001111' },
  { company_idx: 0, first_name: 'Roberto',    last_name: 'Silva',      cpf: '222.333.444-55', cnh_number: 'CNH002345678', cnh_category: 'D', cnh_expiry_date: '2026-11-30', phone: '+5511990002222' },
  { company_idx: 1, first_name: 'Fernando',   last_name: 'Souza',      cpf: '333.444.555-66', cnh_number: 'CNH003456789', cnh_category: 'D', cnh_expiry_date: '2028-03-22', phone: '+5511990003333' },
  { company_idx: 1, first_name: 'José',       last_name: 'Pereira',    cpf: '444.555.666-77', cnh_number: 'CNH004567890', cnh_category: 'D', cnh_expiry_date: '2027-05-10', phone: '+5511990004444' },
  { company_idx: 2, first_name: 'Marcos',     last_name: 'Ferreira',   cpf: '555.666.777-88', cnh_number: 'CNH005678901', cnh_category: 'E', cnh_expiry_date: '2027-09-18', phone: '+5513991115555' },
  { company_idx: 2, first_name: 'Antônio',    last_name: 'Lima',       cpf: '666.777.888-99', cnh_number: 'CNH006789012', cnh_category: 'D', cnh_expiry_date: '2026-12-01', phone: '+5513991116666' },
  { company_idx: 3, first_name: 'Geraldo',    last_name: 'Costa',      cpf: '777.888.999-00', cnh_number: 'CNH007890123', cnh_category: 'D', cnh_expiry_date: '2028-01-20', phone: '+5531991117777' },
  { company_idx: 3, first_name: 'Paulo',      last_name: 'Oliveira',   cpf: '888.999.000-11', cnh_number: 'CNH008901234', cnh_category: 'E', cnh_expiry_date: '2027-04-12', phone: '+5531991118888' },
  { company_idx: 4, first_name: 'Vinícius',   last_name: 'Schmidt',    cpf: '999.000.111-22', cnh_number: 'CNH009012345', cnh_category: 'D', cnh_expiry_date: '2027-07-05', phone: '+5548991119999' },
  { company_idx: 4, first_name: 'Daniel',     last_name: 'Müller',     cpf: '000.111.222-33', cnh_number: 'CNH010123456', cnh_category: 'D', cnh_expiry_date: '2028-02-28', phone: '+5548991110000' },
  { company_idx: 5, first_name: 'Francisco',  last_name: 'Sousa',      cpf: '111.000.222-44', cnh_number: 'CNH011234567', cnh_category: 'D', cnh_expiry_date: '2026-10-15', phone: '+5585991111111' },
  { company_idx: 5, first_name: 'Rômulo',     last_name: 'Cavalcante', cpf: '222.111.333-55', cnh_number: 'CNH012345678', cnh_category: 'E', cnh_expiry_date: '2027-12-22', phone: '+5585991112222' },
  { company_idx: 6, first_name: 'Lucas',      last_name: 'Mendes',     cpf: '333.222.444-66', cnh_number: 'CNH013456789', cnh_category: 'D', cnh_expiry_date: '2027-06-08', phone: '+5581991113333' },
  { company_idx: 7, first_name: 'Ricardo',    last_name: 'Barbosa',    cpf: '444.333.555-77', cnh_number: 'CNH014567890', cnh_category: 'E', cnh_expiry_date: '2028-04-30', phone: '+5521991114444' },
  { company_idx: 7, first_name: 'Eduardo',    last_name: 'Pacheco',    cpf: '555.444.666-88', cnh_number: 'CNH015678901', cnh_category: 'D', cnh_expiry_date: '2026-12-12', phone: '+5521991115555' },
];

export interface VehicleSeed {
  company_idx: number;
  garage_idx: number;
  plate: string;
  model: string;
  vehicle_type: 'BUS' | 'MINIBUS' | 'VAN';
  capacity: number;
  price_per_km: number;
  min_departure_cost: number;
  dynamic_pricing_enabled: boolean;
  amenities: string[]; // nomes — vão ser resolvidos pra ID no seed
  photos: string[];    // URLs externas
}

/**
 * Fotos de ônibus/van reais do Unsplash, **validadas visualmente** em
 * 2026-04-30 como adequadas pro posicionamento do produto.
 *
 * Histórico:
 * - VAN_PHOTO antigos retornavam carros esportivos (BMW M4, McLaren) → removidos
 * - 5 BUS_PHOTOs originais tinham 2 IDs com carros/paisagem (Porsche, ilha) → reduzido pra 3
 *
 * IDs ativos:
 *  - 1570125909232-eb263c188f7e — ônibus de turismo 2 andares colorido
 *  - 1544620347-c4fd4a3d5957     — ônibus noturno em montanhas
 *  - 1469854523086-cc02fe5d8800  — Kombi/van clássica em estrada
 */
const BUS_PHOTO = (i: number) => `https://images.unsplash.com/photo-${[
  '1570125909232-eb263c188f7e',
  '1544620347-c4fd4a3d5957',
  '1469854523086-cc02fe5d8800',
][i % 3]}?w=1200&q=80&auto=format`;

export const SEED_VEHICLES: VehicleSeed[] = [
  // TransTur SP (idx 0)
  { company_idx: 0, garage_idx: 0, plate: 'BVA1A01', model: 'Marcopolo Paradiso G8 1800 DD',  vehicle_type: 'BUS',     capacity: 46, price_per_km: 6.50, min_departure_cost: 600, dynamic_pricing_enabled: true,  amenities: ['Wi-Fi','Ar-condicionado','Banheiro','TV','Tomada USB','Poltrona-leito'], photos: [BUS_PHOTO(0), BUS_PHOTO(1), BUS_PHOTO(2)] },
  { company_idx: 0, garage_idx: 0, plate: 'BVA1A02', model: 'Comil Campione DD',               vehicle_type: 'BUS',     capacity: 44, price_per_km: 6.20, min_departure_cost: 580, dynamic_pricing_enabled: true,  amenities: ['Wi-Fi','Ar-condicionado','Banheiro','Tomada USB'], photos: [BUS_PHOTO(1), BUS_PHOTO(3)] },
  { company_idx: 0, garage_idx: 0, plate: 'BVA1A03', model: 'Volare W9 Limousine',             vehicle_type: 'MINIBUS', capacity: 26, price_per_km: 4.80, min_departure_cost: 480, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','TV','Tomada USB','Som ambiente'], photos: [BUS_PHOTO(0), BUS_PHOTO(1)] },
  { company_idx: 0, garage_idx: 0, plate: 'BVA1A04', model: 'Mercedes-Benz Sprinter 519',      vehicle_type: 'VAN',     capacity: 16, price_per_km: 3.50, min_departure_cost: 380, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','Tomada USB','Som ambiente'], photos: [BUS_PHOTO(2)] },

  // Capital Tour (idx 1)
  { company_idx: 1, garage_idx: 1, plate: 'BVB2B01', model: 'Marcopolo Viaggio G7 1050',       vehicle_type: 'BUS',     capacity: 50, price_per_km: 6.00, min_departure_cost: 550, dynamic_pricing_enabled: true,  amenities: ['Wi-Fi','Ar-condicionado','Banheiro','Tomada USB'], photos: [BUS_PHOTO(2), BUS_PHOTO(4)] },
  { company_idx: 1, garage_idx: 1, plate: 'BVB2B02', model: 'Volare V8L Executive',            vehicle_type: 'MINIBUS', capacity: 24, price_per_km: 4.50, min_departure_cost: 420, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','Tomada USB','Som ambiente'], photos: [BUS_PHOTO(3), BUS_PHOTO(4)] },
  { company_idx: 1, garage_idx: 1, plate: 'BVB2B03', model: 'Renault Master Executiva',        vehicle_type: 'VAN',     capacity: 15, price_per_km: 3.20, min_departure_cost: 350, dynamic_pricing_enabled: false, amenities: ['Ar-condicionado','Tomada USB'], photos: [BUS_PHOTO(0)] },

  // Litoral Express (idx 2)
  { company_idx: 2, garage_idx: 2, plate: 'BVC3C01', model: 'Marcopolo Paradiso G8 1200',      vehicle_type: 'BUS',     capacity: 42, price_per_km: 6.80, min_departure_cost: 620, dynamic_pricing_enabled: true,  amenities: ['Wi-Fi','Ar-condicionado','Banheiro','TV','Tomada USB','Poltrona-leito'], photos: [BUS_PHOTO(0), BUS_PHOTO(2)] },
  { company_idx: 2, garage_idx: 2, plate: 'BVC3C02', model: 'Comil Versatile Plus',            vehicle_type: 'MINIBUS', capacity: 28, price_per_km: 4.90, min_departure_cost: 490, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','TV','Tomada USB'], photos: [BUS_PHOTO(1)] },
  { company_idx: 2, garage_idx: 2, plate: 'BVC3C03', model: 'Iveco Daily Minibus',             vehicle_type: 'VAN',     capacity: 18, price_per_km: 3.80, min_departure_cost: 400, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','Tomada USB','Som ambiente'], photos: [BUS_PHOTO(2), BUS_PHOTO(4)] },

  // Mineiro Tur (idx 3)
  { company_idx: 3, garage_idx: 3, plate: 'BVD4D01', model: 'Marcopolo Paradiso G8 1800',      vehicle_type: 'BUS',     capacity: 46, price_per_km: 6.40, min_departure_cost: 580, dynamic_pricing_enabled: true,  amenities: ['Wi-Fi','Ar-condicionado','Banheiro','TV','Tomada USB'], photos: [BUS_PHOTO(3), BUS_PHOTO(0)] },
  { company_idx: 3, garage_idx: 3, plate: 'BVD4D02', model: 'Volare DW9 ON',                   vehicle_type: 'MINIBUS', capacity: 22, price_per_km: 4.60, min_departure_cost: 440, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','TV','Tomada USB'], photos: [BUS_PHOTO(3)] },
  { company_idx: 3, garage_idx: 3, plate: 'BVD4D03', model: 'Mercedes-Benz Sprinter 415',      vehicle_type: 'VAN',     capacity: 14, price_per_km: 3.30, min_departure_cost: 360, dynamic_pricing_enabled: false, amenities: ['Ar-condicionado','Tomada USB'], photos: [BUS_PHOTO(4)] },

  // ViaSul (idx 4)
  { company_idx: 4, garage_idx: 4, plate: 'BVE5E01', model: 'Marcopolo Paradiso G8 1800 DD',   vehicle_type: 'BUS',     capacity: 50, price_per_km: 7.00, min_departure_cost: 650, dynamic_pricing_enabled: true,  amenities: ['Wi-Fi','Ar-condicionado','Banheiro','TV','Tomada USB','Poltrona-leito','Geladeira'], photos: [BUS_PHOTO(4), BUS_PHOTO(0), BUS_PHOTO(2)] },
  { company_idx: 4, garage_idx: 4, plate: 'BVE5E02', model: 'Comil Campione Invictus DD',      vehicle_type: 'BUS',     capacity: 48, price_per_km: 6.80, min_departure_cost: 620, dynamic_pricing_enabled: true,  amenities: ['Wi-Fi','Ar-condicionado','Banheiro','TV','Tomada USB','Poltrona-leito'], photos: [BUS_PHOTO(1), BUS_PHOTO(3)] },
  { company_idx: 4, garage_idx: 4, plate: 'BVE5E03', model: 'Volare Cinco MA',                 vehicle_type: 'MINIBUS', capacity: 30, price_per_km: 5.20, min_departure_cost: 510, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','TV','Tomada USB','Som ambiente'], photos: [BUS_PHOTO(0), BUS_PHOTO(2)] },

  // Norte Brasil (idx 5)
  { company_idx: 5, garage_idx: 5, plate: 'BVF6F01', model: 'Marcopolo Viaggio G7 1050',       vehicle_type: 'BUS',     capacity: 46, price_per_km: 5.90, min_departure_cost: 540, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','Banheiro','Tomada USB'], photos: [BUS_PHOTO(2)] },
  { company_idx: 5, garage_idx: 5, plate: 'BVF6F02', model: 'Volare W9 ON',                    vehicle_type: 'MINIBUS', capacity: 24, price_per_km: 4.40, min_departure_cost: 420, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','Tomada USB'], photos: [BUS_PHOTO(1), BUS_PHOTO(3)] },
  { company_idx: 5, garage_idx: 5, plate: 'BVF6F03', model: 'Iveco Daily City Class',          vehicle_type: 'VAN',     capacity: 16, price_per_km: 3.40, min_departure_cost: 370, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','Tomada USB'], photos: [BUS_PHOTO(2)] },

  // Pernambuco Tour (idx 6)
  { company_idx: 6, garage_idx: 6, plate: 'BVG7G01', model: 'Comil Campione Vision',           vehicle_type: 'BUS',     capacity: 44, price_per_km: 5.70, min_departure_cost: 520, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','Banheiro','Tomada USB','Som ambiente'], photos: [BUS_PHOTO(0)] },
  { company_idx: 6, garage_idx: 6, plate: 'BVG7G02', model: 'Volare V8L',                      vehicle_type: 'MINIBUS', capacity: 22, price_per_km: 4.20, min_departure_cost: 400, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','Tomada USB'], photos: [BUS_PHOTO(0)] },
  { company_idx: 6, garage_idx: 6, plate: 'BVG7G03', model: 'Mercedes-Benz Sprinter Tourer',   vehicle_type: 'VAN',     capacity: 19, price_per_km: 3.60, min_departure_cost: 380, dynamic_pricing_enabled: false, amenities: ['Ar-condicionado','Tomada USB'], photos: [BUS_PHOTO(4)] },

  // Rota Carioca (idx 7)
  { company_idx: 7, garage_idx: 7, plate: 'BVH8H01', model: 'Marcopolo Paradiso G8 1800 DD',   vehicle_type: 'BUS',     capacity: 48, price_per_km: 6.70, min_departure_cost: 610, dynamic_pricing_enabled: true,  amenities: ['Wi-Fi','Ar-condicionado','Banheiro','TV','Tomada USB','Poltrona-leito','Geladeira'], photos: [BUS_PHOTO(3), BUS_PHOTO(4)] },
  { company_idx: 7, garage_idx: 7, plate: 'BVH8H02', model: 'Comil Versatile',                 vehicle_type: 'MINIBUS', capacity: 28, price_per_km: 4.80, min_departure_cost: 480, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','TV','Tomada USB'], photos: [BUS_PHOTO(2), BUS_PHOTO(0)] },
  { company_idx: 7, garage_idx: 7, plate: 'BVH8H03', model: 'Renault Master 16L',              vehicle_type: 'VAN',     capacity: 15, price_per_km: 3.30, min_departure_cost: 360, dynamic_pricing_enabled: true,  amenities: ['Ar-condicionado','Tomada USB','Som ambiente'], photos: [BUS_PHOTO(1)] },
];
