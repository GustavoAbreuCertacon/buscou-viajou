import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';
import { resolveCity, haversineKm } from '../../common/geo/brazil-cities';
import { QuoteResultItem, SearchQuoteDto } from './quotes.dto';

interface PricingEventRow {
  minimum_multiplier_level: string;
  affected_regions: string[] | null;
  start_date: string;
  end_date: string;
}

const LEVEL_MULTIPLIER: Record<string, number> = {
  NORMAL: 1.0,
  HIGH: 1.2,
  VERY_HIGH: 1.45,
  PEAK: 1.8,
};

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async search(dto: SearchQuoteDto, clientId?: string): Promise<{
    data: QuoteResultItem[];
    meta: {
      origin: { name: string; state: string; lat: number; lng: number };
      destination: { name: string; state: string; lat: number; lng: number };
      distanceKm: number;
      estimatedDurationHours: number;
      multiplier: number;
      multiplierIndicator: string;
    };
  }> {
    const origin = resolveCity(dto.origin);
    const destination = resolveCity(dto.destination);
    if (!origin || !destination) {
      throw new BadRequestException(
        `Cidade não encontrada (origem: "${dto.origin}", destino: "${dto.destination}")`,
      );
    }
    if (origin.name === destination.name) {
      throw new BadRequestException('Origem e destino devem ser diferentes');
    }

    const distanceKm = Math.round(haversineKm(origin, destination) * 1.15); // fator pra estradas reais
    const totalDistance = distanceKm * 2; // ida + retorno garagem

    // Multiplicador dinâmico baseado em pricing_events ativos pra data
    const departureDateOnly = dto.departureDate.slice(0, 10);
    const { data: events } = await this.supabase.admin
      .from('pricing_events')
      .select('minimum_multiplier_level, affected_regions, start_date, end_date')
      .lte('start_date', departureDateOnly)
      .gte('end_date', departureDateOnly)
      .eq('is_active', true);

    const multiplier = this.computeMultiplier(events ?? [], origin.state, destination.state);
    const indicator = this.indicatorFromMultiplier(multiplier);

    // Estimativa de tempo: ~70km/h média rodoviária
    const estimatedDurationHours = +(distanceKm / 70).toFixed(1);

    // Veículos disponíveis
    let vehicleQuery = this.supabase.admin
      .from('vehicles')
      .select(
        `
        id, model, vehicle_type, capacity, price_per_km, min_departure_cost,
        average_rating, total_reviews, dynamic_pricing_enabled,
        company:companies!inner ( id, name, logo_url, status, average_rating, total_reviews ),
        photos:vehicle_photos ( file_url, display_order ),
        vehicle_amenities ( amenities ( id, name, icon ) )
      `,
      )
      .eq('status', 'ACTIVE')
      .eq('company.status', 'ACTIVE')
      .gte('capacity', dto.passengers);

    if (dto.vehicleTypes?.length) {
      vehicleQuery = vehicleQuery.in('vehicle_type', dto.vehicleTypes);
    }

    const { data: vehicles, error } = await vehicleQuery;
    if (error) throw error;

    const lockMinutes = 30;
    const lockedUntil = new Date(Date.now() + lockMinutes * 60_000).toISOString();

    const results: QuoteResultItem[] = [];
    const lockedRows: any[] = [];

    for (const v of vehicles ?? []) {
      const company = (v as any).company;
      const effectiveMultiplier = v.dynamic_pricing_enabled ? multiplier : 1.0;
      const baseFromKm = totalDistance * Number(v.price_per_km);
      const basePrice = Math.max(Number(v.min_departure_cost), baseFromKm);
      const finalPrice = +(basePrice * effectiveMultiplier).toFixed(2);

      if (dto.maxPrice && finalPrice > dto.maxPrice) continue;
      if (dto.minRating && Number(v.average_rating ?? 0) < dto.minRating) continue;

      const photos = (v as any).photos
        ?.sort((a: any, b: any) => a.display_order - b.display_order)
        .map((p: any) => p.file_url) ?? [];

      const amenities = (v as any).vehicle_amenities
        ?.map((va: any) => va.amenities)
        .filter(Boolean) ?? [];

      const item: QuoteResultItem = {
        vehicleId: v.id,
        lockedQuoteId: '', // preenchido após insert
        model: v.model,
        vehicleType: v.vehicle_type as any,
        capacity: v.capacity,
        averageRating: Number(v.average_rating ?? 0),
        totalReviews: v.total_reviews ?? 0,
        photos,
        amenities,
        company: {
          id: company.id,
          name: company.name,
          logoUrl: company.logo_url,
          averageRating: Number(company.average_rating ?? 0),
          totalReviews: company.total_reviews ?? 0,
        },
        pricing: {
          basePrice: +basePrice.toFixed(2),
          multiplier: effectiveMultiplier,
          finalPrice,
          indicator: this.indicatorFromMultiplier(effectiveMultiplier),
          indicatorLabel: this.labelFromIndicator(this.indicatorFromMultiplier(effectiveMultiplier)),
          lockedUntil,
        },
        route: {
          distanceKm,
          estimatedDurationHours,
        },
      };
      results.push(item);

      lockedRows.push({
        client_id: clientId ?? null,
        vehicle_id: v.id,
        base_price: basePrice,
        multiplier: effectiveMultiplier,
        final_price: finalPrice,
        route_origin: `${origin.name}, ${origin.state}`,
        route_destination: `${destination.name}, ${destination.state}`,
        travel_date: dto.departureDate,
        locked_until: lockedUntil,
      });
    }

    // Bulk insert dos locked_quotes pra travar preço
    if (lockedRows.length) {
      const { data: locked, error: lockErr } = await this.supabase.admin
        .from('locked_quotes')
        .insert(lockedRows)
        .select('id, vehicle_id');
      if (lockErr) {
        this.logger.warn(`Failed to lock quotes: ${lockErr.message}`);
      } else {
        const map = new Map(locked.map((l: any) => [l.vehicle_id, l.id]));
        results.forEach((r) => {
          r.lockedQuoteId = map.get(r.vehicleId) ?? '';
        });
      }
    }

    // Ordenar por menor preço (default)
    results.sort((a, b) => a.pricing.finalPrice - b.pricing.finalPrice);

    return {
      data: results,
      meta: {
        origin: { name: origin.name, state: origin.state, lat: origin.lat, lng: origin.lng },
        destination: {
          name: destination.name,
          state: destination.state,
          lat: destination.lat,
          lng: destination.lng,
        },
        distanceKm,
        estimatedDurationHours,
        multiplier,
        multiplierIndicator: indicator,
      },
    };
  }

  private computeMultiplier(
    events: PricingEventRow[],
    originState: string,
    destinationState: string,
  ): number {
    let highest = 1.0;
    for (const e of events) {
      const regions = e.affected_regions ?? [];
      const matches = regions.length === 0 || regions.includes(originState) || regions.includes(destinationState);
      if (!matches) continue;
      const m = LEVEL_MULTIPLIER[e.minimum_multiplier_level] ?? 1.0;
      if (m > highest) highest = m;
    }
    return highest;
  }

  private indicatorFromMultiplier(m: number): QuoteResultItem['pricing']['indicator'] {
    if (m < 1.0) return 'PROMO';
    if (m < 1.1) return 'NORMAL';
    if (m < 1.4) return 'HIGH';
    if (m < 1.7) return 'VERY_HIGH';
    return 'PEAK';
  }

  private labelFromIndicator(ind: QuoteResultItem['pricing']['indicator']): string {
    switch (ind) {
      case 'PROMO':     return 'Melhor preço';
      case 'NORMAL':    return 'Preço normal';
      case 'HIGH':      return 'Alta procura';
      case 'VERY_HIGH': return 'Procura muito alta';
      case 'PEAK':      return 'Preço de pico';
    }
  }
}
