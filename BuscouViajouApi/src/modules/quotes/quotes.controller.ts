import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuotesService } from './quotes.service';
import { SearchQuoteDto, SearchQuoteSchema } from './quotes.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CurrentUser, OptionalAuth } from '../../auth/decorators';
import { SupabaseJwtPayload } from '../../auth/jwks.service';

@ApiTags('Quotes')
@Controller({ path: 'quotes', version: '1' })
export class QuotesController {
  constructor(private readonly quotes: QuotesService) {}

  @Post()
  @OptionalAuth()
  @ApiOperation({
    summary: 'Busca veículos disponíveis pra uma rota e calcula preços',
    description:
      'Retorna lista de veículos com preço final aplicando pricing dinâmico. Preço travado por 30 minutos (locked_quotes).',
  })
  async search(
    @Body(new ZodValidationPipe(SearchQuoteSchema)) dto: SearchQuoteDto,
    @CurrentUser() user?: SupabaseJwtPayload,
  ) {
    return this.quotes.search(dto, user?.sub);
  }
}
