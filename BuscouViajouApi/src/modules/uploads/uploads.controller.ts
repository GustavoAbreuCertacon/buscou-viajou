import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CurrentUser, Public } from '../../auth/decorators';
import type { SupabaseJwtPayload } from '../../auth/jwks.service';
import { SupabaseService } from '../../database/supabase.service';
import { UploadsService } from './uploads.service';
import {
  SignPartnerDocDto,
  SignPartnerDocSchema,
  SignVehiclePhotoDto,
  SignVehiclePhotoSchema,
} from './uploads.dto';

const COMPANY_ROLES = ['COMPANY_ADMIN', 'COMPANY_OPERATOR', 'COMPANY_FINANCIAL'];

@ApiTags('Uploads')
@Controller({ path: 'uploads', version: '1' })
export class UploadsController {
  constructor(
    private readonly uploads: UploadsService,
    private readonly supabase: SupabaseService,
  ) {}

  @Post('partner-doc')
  @Public()
  @ApiOperation({
    summary:
      'Signed URL pra upload de documento de empresa (cadastro público). Sem auth.',
  })
  async signPartnerDoc(
    @Body(new ZodValidationPipe(SignPartnerDocSchema)) dto: SignPartnerDocDto,
  ) {
    return this.uploads.signPartnerDoc(dto.slot, dto.filename);
  }

  @Post('vehicle-photo')
  @ApiOperation({
    summary:
      'Signed URL pra upload de foto de veículo. Auth obrigatório, role company_*.',
  })
  async signVehiclePhoto(
    @Body(new ZodValidationPipe(SignVehiclePhotoSchema)) dto: SignVehiclePhotoDto,
    @CurrentUser() user: SupabaseJwtPayload,
  ) {
    const { data, error } = await this.supabase.admin
      .from('profiles')
      .select('role, company_id')
      .eq('id', user.sub)
      .maybeSingle();

    if (error || !data) {
      throw new ForbiddenException('Perfil não encontrado');
    }
    if (!COMPANY_ROLES.includes(data.role) || !data.company_id) {
      throw new ForbiddenException(
        'Apenas usuários com perfil de empresa podem subir fotos de veículo',
      );
    }

    return this.uploads.signVehiclePhoto(data.company_id, dto.filename);
  }
}
