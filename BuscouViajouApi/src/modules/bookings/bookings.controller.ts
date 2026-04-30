import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import {
  CancelBookingDto,
  CancelBookingSchema,
  CreateBookingDto,
  CreateBookingSchema,
} from './bookings.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CurrentUser } from '../../auth/decorators';
import { SupabaseJwtPayload } from '../../auth/jwks.service';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller({ path: 'bookings', version: '1' })
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria nova solicitação de reserva (PENDING_APPROVAL)' })
  create(
    @Body(new ZodValidationPipe(CreateBookingSchema)) dto: CreateBookingDto,
    @CurrentUser() user: SupabaseJwtPayload,
  ) {
    return this.bookings.create(dto, user.sub);
  }

  @Get()
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'Lista reservas do cliente logado' })
  list(@Query('status') status: string | undefined, @CurrentUser() user: SupabaseJwtPayload) {
    return this.bookings.listByClient(user.sub, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de uma reserva (com veículo, empresa, motorista, ticket, etc)' })
  findOne(@Param('id') id: string, @CurrentUser() user: SupabaseJwtPayload) {
    return this.bookings.findOne(id, user.sub);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancelamento pelo cliente (aplica RN-FIN-002)' })
  cancel(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CancelBookingSchema)) dto: CancelBookingDto,
    @CurrentUser() user: SupabaseJwtPayload,
  ) {
    return this.bookings.cancelByClient(id, dto, user.sub);
  }

  @Post(':id/_demo/approve-and-pay')
  @ApiOperation({
    summary: '[DEMO] Simula aprovação da empresa + pagamento → CONFIRMED',
    description: 'Atalho da demo. Em produção isso seria UC-002 + Stripe Checkout.',
  })
  demoApprove(@Param('id') id: string, @CurrentUser() user: SupabaseJwtPayload) {
    return this.bookings.demoApproveAndPay(id, user.sub);
  }
}
