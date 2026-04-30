import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { Public } from '../../auth/decorators';
import { PartnersService } from './partners.service';
import { PartnerSignupDto, PartnerSignupSchema } from './partners.dto';

@ApiTags('Partners')
@Controller({ path: 'partners', version: '1' })
export class PartnersController {
  constructor(private readonly partners: PartnersService) {}

  @Post('signup')
  @Public()
  @ApiOperation({
    summary:
      'Cadastro público de empresa parceira (UC-003). Submete formulário em 4 etapas + aceite do código.',
  })
  async signup(
    @Body(new ZodValidationPipe(PartnerSignupSchema)) dto: PartnerSignupDto,
    @Req() request: Request,
  ) {
    const ip =
      (request.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
      request.socket?.remoteAddress ??
      null;
    const userAgent = (request.headers['user-agent'] as string | undefined) ?? null;

    return this.partners.signup(dto, { ip, userAgent });
  }
}
