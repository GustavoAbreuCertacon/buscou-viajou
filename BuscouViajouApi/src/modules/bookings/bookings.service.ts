import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';
import { resolveCity } from '../../common/geo/brazil-cities';
import { CancelBookingDto, CreateBookingDto } from './bookings.dto';
import { Database } from '../../database/database.types';
import { randomUUID } from 'crypto';

type BookingRow = Database['public']['Tables']['bookings']['Row'];
type BookingStatus = Database['public']['Enums']['booking_status'];

const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING_APPROVAL:   ['PENDING_PAYMENT', 'REJECTED', 'EXPIRED', 'CANCELLED_BY_CLIENT'],
  PENDING_PAYMENT:    ['CONFIRMED', 'CANCELLED_BY_CLIENT', 'EXPIRED'],
  CONFIRMED:          ['IN_PROGRESS', 'CANCELLED_BY_CLIENT', 'CANCELLED_BY_COMPANY', 'NO_SHOW_CLIENT', 'NO_SHOW_COMPANY'],
  IN_PROGRESS:        ['PENDING_COMPLETION'],
  PENDING_COMPLETION: ['COMPLETED'],
  COMPLETED:          [],
  CANCELLED_BY_CLIENT:[],
  CANCELLED_BY_COMPANY:[],
  REJECTED:           [],
  EXPIRED:            [],
  NO_SHOW_CLIENT:     [],
  NO_SHOW_COMPANY:    [],
};

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async create(dto: CreateBookingDto, clientId: string): Promise<BookingRow> {
    // 1. Recupera locked_quote
    const { data: quote, error: quoteErr } = await this.supabase.admin
      .from('locked_quotes')
      .select('*')
      .eq('id', dto.lockedQuoteId)
      .maybeSingle();

    if (quoteErr) throw quoteErr;
    if (!quote) throw new NotFoundException('Cotação não encontrada');
    if (quote.is_used) throw new ConflictException('Esta cotação já foi utilizada');
    if (new Date(quote.locked_until).getTime() < Date.now()) {
      throw new BadRequestException('Cotação expirada — refaça a busca');
    }

    // 2. Recupera veículo + empresa
    const { data: vehicle, error: vErr } = await this.supabase.admin
      .from('vehicles')
      .select('id, company_id, capacity, garage_id, garages(latitude, longitude)')
      .eq('id', quote.vehicle_id)
      .maybeSingle();
    if (vErr) throw vErr;
    if (!vehicle) throw new NotFoundException('Veículo não disponível');
    if (vehicle.capacity < dto.passengers) {
      throw new BadRequestException('Veículo não comporta o número de passageiros');
    }

    // 3. Calcula taxas e payout (mock)
    const totalPrice = Number(quote.final_price);
    const platformFee = +(totalPrice * 0.05).toFixed(2);
    const companyPayout = +(totalPrice - platformFee).toFixed(2);
    const securityDeposit = +Math.min(Math.max(totalPrice * 0.1, 100), 5000).toFixed(2);

    // 4. Resolve coordenadas
    const origin = resolveCity(quote.route_origin.split(',')[0].trim());
    const destination = resolveCity(quote.route_destination.split(',')[0].trim());

    // 5. Estimativas de distância e duração (já no preço)
    const distanceKm = Math.round((Number(quote.final_price) / Number(quote.base_price)) * 100); // sanity fallback
    // Recupera distância real via cálculo:
    const realDistance = origin && destination
      ? Math.round(haversineKmRough(origin, destination) * 1.15)
      : 0;
    const totalDistanceKm = realDistance * 2;

    const bookingCode = generateBookingCode();

    // 6. Insert booking
    const { data: booking, error: bookErr } = await this.supabase.admin
      .from('bookings')
      .insert({
        booking_code: bookingCode,
        client_id: clientId,
        vehicle_id: vehicle.id,
        company_id: vehicle.company_id,
        status: 'PENDING_APPROVAL',
        is_round_trip: dto.isRoundTrip,
        passengers: dto.passengers,
        total_price: totalPrice,
        base_price: Number(quote.base_price),
        dynamic_multiplier: Number(quote.multiplier),
        platform_fee: platformFee,
        company_payout: companyPayout,
        security_deposit: securityDeposit,
        total_distance_km: totalDistanceKm,
        estimated_duration_hours: realDistance > 0 ? +(realDistance / 70).toFixed(1) : null,
        origin_address: quote.route_origin,
        origin_latitude: origin?.lat,
        origin_longitude: origin?.lng,
        destination_address: quote.route_destination,
        destination_latitude: destination?.lat,
        destination_longitude: destination?.lng,
        departure_date: quote.travel_date,
        return_date: dto.returnDate ?? null,
      })
      .select('*')
      .single();

    if (bookErr) throw bookErr;

    // 7. Insert stops, se houver
    if (dto.stops?.length) {
      await this.supabase.admin.from('booking_stops').insert(
        dto.stops.map((s, i) => ({
          booking_id: booking.id,
          address: s.address,
          latitude: s.latitude ?? null,
          longitude: s.longitude ?? null,
          stop_order: i + 1,
        })),
      );
    }

    // 8. Insert addons selecionados
    if (dto.addonIds?.length) {
      const { data: addons } = await this.supabase.admin
        .from('addons')
        .select('id, price, pricing_type')
        .in('id', dto.addonIds);
      if (addons?.length) {
        await this.supabase.admin.from('booking_addons').insert(
          addons.map((a) => {
            const qty = a.pricing_type === 'PER_PERSON' ? dto.passengers : 1;
            const totalP = Number(a.price) * qty;
            return {
              booking_id: booking.id,
              addon_id: a.id,
              quantity: qty,
              unit_price: Number(a.price),
              total_price: totalP,
            };
          }),
        );
      }
    }

    // 9. Marca cotação como usada
    await this.supabase.admin
      .from('locked_quotes')
      .update({ is_used: true })
      .eq('id', dto.lockedQuoteId);

    return booking;
  }

  async listByClient(clientId: string, status?: string) {
    let q = this.supabase.admin
      .from('bookings')
      .select(
        `
        *,
        vehicle:vehicles ( id, model, vehicle_type, photos:vehicle_photos ( file_url, display_order ) ),
        company:companies ( id, name, logo_url ),
        ticket:tickets ( ticket_code, status )
      `,
      )
      .eq('client_id', clientId)
      .order('departure_date', { ascending: false });

    if (status) q = q.eq('status', status as BookingStatus);

    const { data, error } = await q;
    if (error) throw error;
    return { data };
  }

  async findOne(id: string, clientId: string, isSuperAdmin = false) {
    const { data, error } = await this.supabase.admin
      .from('bookings')
      .select(
        `
        *,
        vehicle:vehicles ( id, model, vehicle_type, capacity, photos:vehicle_photos ( file_url, display_order ), garage:garages ( name, city, state, latitude, longitude ) ),
        company:companies ( id, name, logo_url, average_rating, total_reviews ),
        client:profiles!client_id ( id, first_name, last_name, email, phone ),
        driver:drivers ( first_name, last_name, phone, photo_url ),
        stops:booking_stops ( id, address, latitude, longitude, stop_order ),
        addons:booking_addons ( id, quantity, unit_price, total_price, addon:addons ( name, description ) ),
        ticket:tickets ( ticket_code, qr_payload, status )
      `,
      )
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new NotFoundException('Reserva não encontrada');
    if (!isSuperAdmin && data.client_id !== clientId) {
      throw new ForbiddenException('Acesso negado a esta reserva');
    }
    return data;
  }

  async cancelByClient(id: string, dto: CancelBookingDto, clientId: string) {
    const booking = await this.findOne(id, clientId);

    this.assertTransition(booking.status as BookingStatus, 'CANCELLED_BY_CLIENT');

    // Calcula reembolso conforme RN-FIN-002
    const departure = new Date(booking.departure_date).getTime();
    const hoursToTrip = (departure - Date.now()) / (1000 * 60 * 60);
    let refundPercent = 0;
    if (hoursToTrip >= 72) refundPercent = 100;
    else if (hoursToTrip >= 24) refundPercent = 50;
    else refundPercent = 0;

    await this.supabase.admin
      .from('bookings')
      .update({
        status: 'CANCELLED_BY_CLIENT',
        cancellation_reason: dto.reason,
        cancelled_by: clientId,
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', id);

    return {
      booking_id: id,
      refund_percentage: refundPercent,
      refund_amount: +(Number(booking.total_price) * (refundPercent / 100)).toFixed(2),
      message:
        refundPercent === 100
          ? 'Cancelamento dentro do prazo. Reembolso total.'
          : refundPercent === 50
          ? 'Cancelamento entre 24h e 72h. Reembolso de 50%.'
          : 'Cancelamento com menos de 24h. Sem reembolso.',
    };
  }

  /**
   * Demo helper: simula a empresa aprovando + cliente pagando, vai direto pra CONFIRMED.
   * Em produção isso seria 2 endpoints separados (UC-002 e UC-001 step 10-13).
   */
  async demoApproveAndPay(id: string, clientId: string) {
    const booking = await this.findOne(id, clientId);
    if (booking.status !== 'PENDING_APPROVAL') {
      throw new BadRequestException(`Reserva está em status ${booking.status} — não pode ser aprovada`);
    }

    // Aloca um motorista qualquer da empresa
    const { data: driver } = await this.supabase.admin
      .from('drivers')
      .select('id')
      .eq('company_id', booking.company_id)
      .eq('status', 'ACTIVE')
      .limit(1)
      .maybeSingle();

    // Update pra CONFIRMED diretamente
    await this.supabase.admin
      .from('bookings')
      .update({
        status: 'CONFIRMED',
        driver_id: driver?.id ?? null,
        payout_status: 'PENDING',
      })
      .eq('id', id);

    // Cria transação mock de pagamento
    await this.supabase.admin.from('transactions').insert({
      booking_id: id,
      stripe_payment_intent_id: `pi_demo_${randomUUID().slice(0, 16)}`,
      amount: booking.total_price,
      type: 'PAYMENT',
      status: 'SUCCEEDED',
      metadata: { demo: true, simulated_at: new Date().toISOString() },
    });

    return {
      booking_id: id,
      new_status: 'CONFIRMED',
      driver_assigned: !!driver,
      message: 'Reserva aprovada e paga (simulação).',
    };
  }

  private assertTransition(from: BookingStatus, to: BookingStatus): void {
    const allowed = VALID_TRANSITIONS[from] ?? [];
    if (!allowed.includes(to)) {
      throw new BadRequestException(`Transição inválida: ${from} → ${to}`);
    }
  }
}

function haversineKmRough(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

function generateBookingCode(): string {
  const year = new Date().getFullYear();
  const rand = randomUUID().replace(/-/g, '').slice(0, 4).toUpperCase();
  return `BV-${year}-${rand}`;
}
