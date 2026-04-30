import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators';
import { SupabaseService } from '../../database/supabase.service';

@ApiTags('Companies')
@Controller({ path: 'companies', version: '1' })
export class CompaniesController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lista empresas ativas (público)' })
  async list() {
    const { data, error } = await this.supabase.admin
      .from('companies')
      .select('id, name, logo_url, average_rating, total_reviews, operating_regions, description')
      .eq('status', 'ACTIVE')
      .order('average_rating', { ascending: false });

    if (error) throw error;
    return { data };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Perfil público da empresa' })
  async findOne(@Param('id') id: string) {
    const { data, error } = await this.supabase.admin
      .from('companies')
      .select(
        `
        id, name, legal_name, logo_url, description, operating_regions,
        average_rating, total_reviews, status,
        addresses:company_addresses ( street, number, city, state, zip_code, neighborhood )
      `,
      )
      .eq('id', id)
      .eq('status', 'ACTIVE')
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new NotFoundException('Empresa não encontrada');
    return data;
  }

  @Get(':id/reviews')
  @Public()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'rating', required: false, type: Number })
  @ApiOperation({ summary: 'Avaliações públicas da empresa' })
  async reviews(
    @Param('id') id: string,
    @Query('limit') limit = '20',
    @Query('rating') rating?: string,
  ) {
    let query = this.supabase.admin
      .from('reviews')
      .select(
        `
        id, overall_rating, punctuality_rating, vehicle_rating, driver_rating, value_rating,
        comment, created_at,
        client:profiles!client_id ( first_name, last_name ),
        vehicle:vehicles ( id, model ),
        response:review_responses ( response, created_at )
      `,
      )
      .eq('company_id', id)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (rating) query = query.eq('overall_rating', Number(rating));

    const { data, error } = await query;
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

  @Get(':id/vehicles')
  @Public()
  @ApiOperation({ summary: 'Lista de veículos da empresa' })
  async vehicles(@Param('id') id: string) {
    const { data, error } = await this.supabase.admin
      .from('vehicles')
      .select(
        `
        id, model, vehicle_type, capacity, average_rating, total_reviews,
        photos:vehicle_photos ( file_url, display_order )
      `,
      )
      .eq('company_id', id)
      .eq('status', 'ACTIVE')
      .order('average_rating', { ascending: false });

    if (error) throw error;
    return { data };
  }
}
