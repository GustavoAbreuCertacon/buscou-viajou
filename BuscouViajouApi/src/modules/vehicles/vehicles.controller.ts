import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators';
import { SupabaseService } from '../../database/supabase.service';

@ApiTags('Vehicles')
@Controller({ path: 'vehicles', version: '1' })
export class VehiclesController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Detalhes públicos de um veículo' })
  async findOne(@Param('id') id: string) {
    const { data, error } = await this.supabase.admin
      .from('vehicles')
      .select(
        `
        id, model, vehicle_type, capacity, price_per_km, min_departure_cost,
        average_rating, total_reviews, dynamic_pricing_enabled,
        company:companies ( id, name, logo_url, average_rating, total_reviews, description ),
        garage:garages ( id, name, city, state, latitude, longitude ),
        photos:vehicle_photos ( file_url, display_order ),
        vehicle_amenities ( amenities ( id, name, icon ) )
      `,
      )
      .eq('id', id)
      .eq('status', 'ACTIVE')
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new NotFoundException('Veículo não encontrado');

    const photos = ((data as any).photos ?? [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((p: any) => p.file_url);

    const amenities = ((data as any).vehicle_amenities ?? [])
      .map((va: any) => va.amenities)
      .filter(Boolean);

    return {
      ...data,
      photos,
      amenities,
    };
  }

  @Get(':id/reviews')
  @Public()
  @ApiOperation({ summary: 'Avaliações de um veículo específico' })
  async reviews(@Param('id') id: string) {
    const { data, error } = await this.supabase.admin
      .from('reviews')
      .select(
        `
        id, overall_rating, comment, created_at,
        client:profiles!client_id ( first_name, last_name )
      `,
      )
      .eq('vehicle_id', id)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return {
      data: (data ?? []).map((r: any) => ({
        ...r,
        client: r.client
          ? { first_name: r.client.first_name, last_initial: r.client.last_name?.[0] ?? '' }
          : null,
      })),
    };
  }
}
