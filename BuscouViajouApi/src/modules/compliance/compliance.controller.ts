import { Controller, Get, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser, Public } from '../../auth/decorators';
import type { SupabaseJwtPayload } from '../../auth/jwks.service';
import { ComplianceService } from './compliance.service';

@ApiTags('Compliance')
@Controller({ path: 'compliance', version: '1' })
export class ComplianceController {
  constructor(private readonly compliance: ComplianceService) {}

  @Get('code-of-conduct')
  @Public()
  @ApiOperation({ summary: 'Versão atual do código de conduta + URL do documento' })
  current() {
    return this.compliance.getCurrent();
  }

  @Get('me/status')
  @ApiOperation({
    summary: 'Status de aceite da empresa do usuário logado em relação à versão atual',
  })
  async status(@CurrentUser() user: SupabaseJwtPayload) {
    return this.compliance.getStatus(user.sub);
  }

  @Post('me/accept')
  @ApiOperation({ summary: 'Registra o aceite do código de conduta pela empresa logada' })
  async accept(@CurrentUser() user: SupabaseJwtPayload, @Req() request: Request) {
    const ip =
      (request.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
      request.socket?.remoteAddress ??
      null;
    const userAgent = (request.headers['user-agent'] as string | undefined) ?? null;
    return this.compliance.accept(user.sub, { ip, userAgent });
  }
}
