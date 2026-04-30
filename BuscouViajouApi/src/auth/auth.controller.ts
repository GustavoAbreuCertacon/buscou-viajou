import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from './decorators';
import { SupabaseJwtPayload } from './jwks.service';
import { SupabaseService } from '../database/supabase.service';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get('me')
  @ApiOperation({ summary: 'Retorna o profile do usuário autenticado' })
  async me(@CurrentUser() user: SupabaseJwtPayload) {
    const { data, error } = await this.supabase.admin
      .from('profiles')
      .select('id, email, first_name, last_name, role, kyc_status, company_id, avatar_url, phone, cpf, created_at')
      .eq('id', user.sub)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new NotFoundException('Profile not found');
    return data;
  }
}
