import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CurrentUser, Public } from '../../auth/decorators';
import type { SupabaseJwtPayload } from '../../auth/jwks.service';
import { SupabaseService } from '../../database/supabase.service';
import { CompanyService } from './company.service';
import {
  CreateGarageDto,
  CreateGarageSchema,
  CreateVehicleDto,
  CreateVehicleSchema,
} from './company.dto';

@ApiTags('Company (me)')
@Controller({ path: 'company', version: '1' })
export class CompanyController {
  constructor(
    private readonly company: CompanyService,
    private readonly supabase: SupabaseService,
  ) {}

  @Get('me/garages')
  @ApiOperation({ summary: 'Lista garagens da empresa do usuário logado' })
  listGarages(@CurrentUser() user: SupabaseJwtPayload) {
    return this.company.listGarages(user.sub);
  }

  @Post('me/garages')
  @ApiOperation({ summary: 'Cadastra nova garagem pra empresa do usuário logado' })
  createGarage(
    @CurrentUser() user: SupabaseJwtPayload,
    @Body(new ZodValidationPipe(CreateGarageSchema)) dto: CreateGarageDto,
  ) {
    return this.company.createGarage(user.sub, dto);
  }

  @Post('me/vehicles')
  @ApiOperation({
    summary:
      'Cadastra novo veículo pra empresa do usuário logado. Body inclui amenityIds e photoUrls (já uploaded via /v1/uploads/vehicle-photo).',
  })
  createVehicle(
    @CurrentUser() user: SupabaseJwtPayload,
    @Body(new ZodValidationPipe(CreateVehicleSchema)) dto: CreateVehicleDto,
  ) {
    return this.company.createVehicle(user.sub, dto);
  }

  @Get('amenities')
  @Public()
  @ApiOperation({ summary: 'Lista catálogo de amenities (público)' })
  async amenities() {
    const { data, error } = await this.supabase.admin
      .from('amenities')
      .select('id, name, icon, description')
      .order('name');
    if (error) throw error;
    return { data: data ?? [] };
  }
}
