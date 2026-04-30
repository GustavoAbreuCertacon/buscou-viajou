/**
 * Seed dinâmico do Buscou Viajou.
 * Roda uma vez via `npm run db:seed`.
 *
 * Cria:
 *   - 8 empresas + endereços + garagens
 *   - 25 veículos com fotos e amenities
 *   - 15 motoristas
 *   - 3 clientes mock + 2 admins de empresa + 1 super admin (via Supabase Auth)
 *   - ~30 reservas em status variados
 *   - ~80 avaliações em reservas COMPLETED
 */
import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { SEED_COMPANIES, SEED_GARAGES, SEED_DRIVERS, SEED_VEHICLES } from './seed-data';
import { randomUUID } from 'crypto';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !serviceKey) {
  console.error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios');
  process.exit(1);
}

const sb: SupabaseClient<Database> = createClient<Database>(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed...');
  await wipe();

  const companyIds = await seedCompanies();
  const garageIds = await seedGarages(companyIds);
  const driverIds = await seedDrivers(companyIds);
  const amenityMap = await loadAmenities();
  const vehicleIds = await seedVehicles(companyIds, garageIds, amenityMap);

  const clientIds = await seedAuthUsers();
  await seedBookingsAndReviews(companyIds, vehicleIds, driverIds, clientIds);

  console.log('✅ Seed concluído.');
}

async function wipe(): Promise<void> {
  console.log('   limpando tabelas dinâmicas...');
  // Ordem importa por causa das FKs.
  // vehicle_amenities é PK composta (sem coluna id), então é limpa via CASCADE quando deletamos vehicles.
  const tables: string[] = [
    'review_responses', 'reviews', 'booking_addons', 'booking_stops',
    'tickets', 'transactions', 'bookings', 'locked_quotes',
    'vehicle_photos', 'documents', 'addons',
    'drivers', 'vehicles', 'garages', 'company_addresses', 'companies',
  ];
  for (const t of tables) {
    const { error } = await (sb as any)
      .from(t)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) console.warn(`   ⚠ ${t}: ${error.message}`);
  }
  // Limpa auth.users (todos os atuais)
  const { data: users } = await sb.auth.admin.listUsers();
  for (const u of users?.users ?? []) {
    await sb.auth.admin.deleteUser(u.id);
  }
}

async function seedCompanies(): Promise<string[]> {
  console.log('   empresas...');
  const ids: string[] = [];
  for (const c of SEED_COMPANIES) {
    const { data, error } = await sb
      .from('companies')
      .insert({
        name: c.name,
        legal_name: c.legal_name,
        cnpj: c.cnpj,
        email: c.email,
        phone: c.phone,
        description: c.description,
        operating_regions: c.operating_regions,
        monthly_fee: c.monthly_fee,
        transaction_fee: c.transaction_fee,
        average_rating: c.average_rating,
        total_reviews: c.total_reviews,
        logo_url: c.logo_url,
        status: 'ACTIVE',
      })
      .select('id')
      .single();
    if (error) throw error;
    ids.push(data!.id);
  }
  return ids;
}

async function seedGarages(companyIds: string[]): Promise<string[]> {
  console.log('   garagens...');
  const ids: string[] = [];
  for (const g of SEED_GARAGES) {
    const { data, error } = await sb
      .from('garages')
      .insert({
        company_id: companyIds[g.company_idx],
        name: g.name,
        street: g.street,
        number: g.number,
        neighborhood: g.neighborhood ?? null,
        city: g.city,
        state: g.state,
        zip_code: g.zip_code,
        latitude: g.latitude,
        longitude: g.lng,
      })
      .select('id')
      .single();
    if (error) throw error;
    ids.push(data!.id);
  }
  return ids;
}

async function seedDrivers(companyIds: string[]): Promise<string[]> {
  console.log('   motoristas...');
  const ids: string[] = [];
  for (const d of SEED_DRIVERS) {
    const { data, error } = await sb
      .from('drivers')
      .insert({
        company_id: companyIds[d.company_idx],
        first_name: d.first_name,
        last_name: d.last_name,
        cpf: d.cpf,
        cnh_number: d.cnh_number,
        cnh_category: d.cnh_category,
        cnh_expiry_date: d.cnh_expiry_date,
        phone: d.phone,
      })
      .select('id')
      .single();
    if (error) throw error;
    ids.push(data!.id);
  }
  return ids;
}

async function loadAmenities(): Promise<Map<string, string>> {
  const { data, error } = await sb.from('amenities').select('id, name');
  if (error) throw error;
  return new Map((data ?? []).map((a) => [a.name, a.id]));
}

async function seedVehicles(
  companyIds: string[],
  garageIds: string[],
  amenityMap: Map<string, string>,
): Promise<string[]> {
  console.log('   veículos...');
  const ids: string[] = [];
  for (const v of SEED_VEHICLES) {
    const { data: vehicle, error: vErr } = await sb
      .from('vehicles')
      .insert({
        company_id: companyIds[v.company_idx],
        garage_id: garageIds[v.garage_idx],
        plate: v.plate,
        model: v.model,
        vehicle_type: v.vehicle_type,
        capacity: v.capacity,
        price_per_km: v.price_per_km,
        min_departure_cost: v.min_departure_cost,
        dynamic_pricing_enabled: v.dynamic_pricing_enabled,
        average_rating: 4.0 + Math.random() * 1.0,
        total_reviews: Math.floor(Math.random() * 80) + 10,
      })
      .select('id')
      .single();
    if (vErr) throw vErr;
    const vehicleId = vehicle!.id;
    ids.push(vehicleId);

    // Photos
    if (v.photos.length) {
      await sb.from('vehicle_photos').insert(
        v.photos.map((url, i) => ({
          vehicle_id: vehicleId,
          file_url: url,
          file_key: `seed/${v.plate}/${i}.jpg`,
          display_order: i,
        })),
      );
    }

    // Amenities
    const amenIds = v.amenities
      .map((name) => amenityMap.get(name))
      .filter((id): id is string => !!id);
    if (amenIds.length) {
      await sb.from('vehicle_amenities').insert(
        amenIds.map((amenity_id) => ({
          vehicle_id: vehicleId,
          amenity_id,
        })),
      );
    }
  }
  return ids;
}

async function seedAuthUsers(): Promise<{
  clients: string[];
  companyAdmins: { id: string; companyIdx: number }[];
  superAdmin: string;
}> {
  console.log('   usuários (Auth)...');
  const clients: string[] = [];
  for (const i of [1, 2, 3]) {
    const email = `cliente${i}@buscouviajou.demo`;
    const { data, error } = await sb.auth.admin.createUser({
      email,
      password: 'demo12345',
      email_confirm: true,
      user_metadata: {
        first_name: ['Ana', 'Bruno', 'Camila'][i - 1],
        last_name: ['Souza', 'Pereira', 'Lima'][i - 1],
        role: 'CLIENT',
      },
    });
    if (error) throw error;
    clients.push(data.user.id);

    // Atualiza profile (criado pelo trigger)
    await sb
      .from('profiles')
      .update({
        cpf: `${100 + i}00000000${i}`,
        date_of_birth: '1990-01-01',
        phone: `+551199900000${i}`,
        kyc_status: 'VERIFIED',
      })
      .eq('id', data.user.id);
  }

  const companyAdmins: { id: string; companyIdx: number }[] = [];
  for (const idx of [0, 1]) {
    const email = `admin.empresa${idx + 1}@buscouviajou.demo`;
    const { data, error } = await sb.auth.admin.createUser({
      email,
      password: 'demo12345',
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: SEED_COMPANIES[idx].name,
        role: 'COMPANY_ADMIN',
      },
    });
    if (error) throw error;
    companyAdmins.push({ id: data.user.id, companyIdx: idx });
  }

  const { data: saData, error: saErr } = await sb.auth.admin.createUser({
    email: 'admin@buscouviajou.demo',
    password: 'demo12345',
    email_confirm: true,
    user_metadata: { first_name: 'Super', last_name: 'Admin', role: 'SUPER_ADMIN' },
  });
  if (saErr) throw saErr;
  const superAdmin = saData.user.id;

  return { clients, companyAdmins, superAdmin } as any;
}

async function seedBookingsAndReviews(
  companyIds: string[],
  vehicleIds: string[],
  driverIds: string[],
  authUsers: any,
): Promise<void> {
  console.log('   reservas + avaliações...');
  const { clients } = authUsers;

  // Atualiza company_id dos admins
  for (const a of authUsers.companyAdmins) {
    await sb.from('profiles').update({ company_id: companyIds[a.companyIdx], kyc_status: 'VERIFIED' }).eq('id', a.id);
  }
  await sb.from('profiles').update({ kyc_status: 'VERIFIED' }).eq('id', authUsers.superAdmin);

  const today = new Date();
  const routes = [
    { origin: 'São Paulo, SP',     dest: 'Rio de Janeiro, RJ',  dist: 430,  duration: 6.5 },
    { origin: 'São Paulo, SP',     dest: 'Campos do Jordão, SP', dist: 200,  duration: 3.0 },
    { origin: 'Rio de Janeiro, RJ', dest: 'Búzios, RJ',          dist: 175,  duration: 2.8 },
    { origin: 'Belo Horizonte, MG', dest: 'Ouro Preto, MG',      dist: 100,  duration: 1.7 },
    { origin: 'Florianópolis, SC',  dest: 'Balneário Camboriú, SC', dist: 80, duration: 1.3 },
    { origin: 'Recife, PE',        dest: 'Porto de Galinhas, PE', dist: 75, duration: 1.2 },
    { origin: 'Salvador, BA',      dest: 'Porto Seguro, BA',     dist: 720, duration: 10.5 },
    { origin: 'Curitiba, PR',      dest: 'Foz do Iguaçu, PR',    dist: 640, duration: 9.0 },
  ];

  const statusDistribution: { status: any; offset: number }[] = [
    { status: 'COMPLETED', offset: -45 }, { status: 'COMPLETED', offset: -30 },
    { status: 'COMPLETED', offset: -25 }, { status: 'COMPLETED', offset: -20 },
    { status: 'COMPLETED', offset: -15 }, { status: 'COMPLETED', offset: -10 },
    { status: 'COMPLETED', offset: -7 },  { status: 'COMPLETED', offset: -5 },
    { status: 'CONFIRMED', offset: 5 },   { status: 'CONFIRMED', offset: 10 },
    { status: 'CONFIRMED', offset: 15 },  { status: 'PENDING_PAYMENT', offset: 12 },
    { status: 'PENDING_APPROVAL', offset: 20 }, { status: 'PENDING_APPROVAL', offset: 25 },
    { status: 'CANCELLED_BY_CLIENT', offset: -35 },
    { status: 'IN_PROGRESS', offset: 0 },
  ];

  const bookingIds: { id: string; vehicleId: string; companyId: string; status: string; clientId: string }[] = [];

  for (let i = 0; i < statusDistribution.length; i++) {
    const route = routes[i % routes.length];
    const vehicleIdx = i % vehicleIds.length;
    const vehicleId = vehicleIds[vehicleIdx];
    const seedVehicle = SEED_VEHICLES[vehicleIdx];
    const companyId = companyIds[seedVehicle.company_idx];
    const clientId = clients[i % clients.length];
    const driverId = driverIds[seedVehicle.company_idx % driverIds.length];

    const departure = new Date(today);
    departure.setDate(departure.getDate() + statusDistribution[i].offset);
    departure.setHours(8 + (i % 8), 0, 0, 0);

    const distance = route.dist * 2;
    const passengers = Math.min(seedVehicle.capacity, 10 + (i % 30));
    const basePrice = Math.max(seedVehicle.min_departure_cost, distance * seedVehicle.price_per_km);
    const totalPrice = basePrice;
    const status = statusDistribution[i].status as any;

    const { data: booking, error } = await sb
      .from('bookings')
      .insert({
        booking_code: `BV-${today.getFullYear()}-${('00' + (i + 1)).slice(-3).toUpperCase()}`,
        client_id: clientId,
        vehicle_id: vehicleId,
        company_id: companyId,
        driver_id: ['CONFIRMED', 'IN_PROGRESS', 'PENDING_COMPLETION', 'COMPLETED'].includes(status) ? driverId : null,
        status,
        passengers,
        total_price: +totalPrice.toFixed(2),
        base_price: +basePrice.toFixed(2),
        dynamic_multiplier: 1.0,
        platform_fee: +(totalPrice * 0.05).toFixed(2),
        company_payout: +(totalPrice * 0.95).toFixed(2),
        security_deposit: Math.min(Math.max(totalPrice * 0.1, 100), 5000),
        total_distance_km: distance,
        estimated_duration_hours: route.duration,
        origin_address: route.origin,
        destination_address: route.dest,
        departure_date: departure.toISOString(),
      })
      .select('id, status, vehicle_id, company_id, client_id')
      .single();

    if (error) {
      console.warn(`   ⚠ booking ${i}: ${error.message}`);
      continue;
    }
    bookingIds.push({
      id: booking.id,
      vehicleId: booking.vehicle_id,
      companyId: booking.company_id,
      status: booking.status,
      clientId: booking.client_id,
    });

    // Cria ticket pra reservas confirmadas+
    if (['CONFIRMED', 'IN_PROGRESS', 'PENDING_COMPLETION', 'COMPLETED'].includes(status)) {
      await sb.from('tickets').insert({
        booking_id: booking.id,
        ticket_code: `BV-${today.getFullYear()}-${('00' + (i + 1)).slice(-3).toUpperCase()}`,
        qr_payload: JSON.stringify({ b: booking.id, v: 1 }) + '.demo',
        qr_hash: randomUUID().replace(/-/g, ''),
        status: status === 'COMPLETED' ? 'USED' : 'VALID',
      });

      await sb.from('transactions').insert({
        booking_id: booking.id,
        stripe_payment_intent_id: `pi_seed_${randomUUID().slice(0, 16)}`,
        amount: totalPrice,
        type: 'PAYMENT',
        status: 'SUCCEEDED',
      });
    }
  }

  // Reviews em reservas COMPLETED
  console.log('   avaliações...');
  const completed = bookingIds.filter((b) => b.status === 'COMPLETED');
  const comments = [
    'Viagem tranquila, motorista pontual e veículo em ótimo estado.',
    'Excelente atendimento. Voltarei a contratar.',
    'Cumpriram tudo o que prometeram, recomendo.',
    'Veículo confortável, ar-condicionado funcionando perfeitamente.',
    'Motorista educado e atencioso, viagem sem problemas.',
    'Boa empresa, mas chegou 15 minutos atrasada na origem.',
    'Tudo perfeito, do início ao fim.',
    'Wi-Fi não pegou em todo trajeto, mas no geral foi ótimo.',
  ];
  for (const b of completed) {
    const overall = 4 + Math.floor(Math.random() * 2);
    await sb.from('reviews').insert({
      booking_id: b.id,
      client_id: b.clientId,
      company_id: b.companyId,
      vehicle_id: b.vehicleId,
      overall_rating: overall,
      punctuality_rating: 4 + Math.floor(Math.random() * 2),
      vehicle_rating: 4 + Math.floor(Math.random() * 2),
      driver_rating: 5,
      value_rating: 4 + Math.floor(Math.random() * 2),
      comment: comments[Math.floor(Math.random() * comments.length)],
      status: 'PUBLISHED',
    });
  }
}

main().catch((err) => {
  console.error('❌ Seed falhou:', err);
  process.exit(1);
});
